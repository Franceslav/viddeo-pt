'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { trpc } from '@/app/_trpc/client'
import { useSession } from 'next-auth/react'
import { formatDateShort, getInitials } from '@/lib/utils'
import { User, Calendar, Heart, MessageCircle, Play, Trash2, Upload, Camera } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

export const ProfileContent = () => {
  const { data: session } = useSession()
  const utils = trpc.useUtils()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // Получаем данные пользователя
  const { data: user, isLoading: userLoading } = trpc.user.getUserById.useQuery(
    { userId: session?.user?.id || '' },
    { enabled: !!session?.user?.id }
  )

  // Получаем комментарии пользователя
  const { data: userComments, isLoading: commentsLoading } = trpc.comment.getUserComments.useQuery(
    { userId: session?.user?.id || '' },
    { enabled: !!session?.user?.id }
  )

  // Получаем лайки пользователя
  const { data: userLikes } = trpc.likes.getUserLikes.useQuery(
    { userId: session?.user?.id || '' },
    { enabled: !!session?.user?.id }
  )

  const deleteComment = trpc.comment.deleteComment.useMutation({
    onSuccess: () => {
      toast.success('Комментарий удален!')
      utils.comment.getUserComments.invalidate({ userId: session?.user?.id || '' })
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const updateUserAvatar = trpc.user.updateUserAvatar.useMutation({
    onSuccess: () => {
      toast.success('Аватарка обновлена!')
      utils.user.getUserById.invalidate({ userId: session?.user?.id || '' })
      setSelectedFile(null)
      setPreviewUrl(null)
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const handleDeleteComment = (commentId: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот комментарий?')) {
      deleteComment.mutate({ id: commentId })
    }
  }

  const handleFileSelect = (file: File | null) => {
    if (file) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    } else {
      setSelectedFile(null)
      setPreviewUrl(null)
    }
  }

  const handleUploadAvatar = async () => {
    if (!selectedFile || !session?.user?.id) return

    const formData = new FormData()
    formData.append('file', selectedFile)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Ошибка загрузки файла')
      }

      const data = await response.json()
      updateUserAvatar.mutate({ 
        userId: session.user.id, 
        image: data.url 
      })
    } catch {
      toast.error('Ошибка загрузки аватарки')
    }
  }

  if (!session?.user) {
    return (
      <div className="text-center py-12">
        <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-8">
          <User className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
          <h3 className="text-2xl font-black text-yellow-800 mb-2" style={{ textShadow: '2px 2px 0px #000000' }}>
            &quot;RESPECT MY AUTHORITAH!&quot;
          </h3>
          <p className="text-yellow-700 font-bold text-lg mb-4">
            Войдите в систему, чтобы просмотреть свой профиль!
          </p>
          <Button 
            onClick={() => window.location.href = '/auth'} 
            className="bg-red-500 hover:bg-red-600 text-white border-2 border-black font-bold"
            style={{ textShadow: '1px 1px 0px #000000' }}
          >
            Войти
          </Button>
        </div>
      </div>
    )
  }

  if (userLoading) {
    return <ProfileLoading />
  }

  return (
    <div className="space-y-8">
      {/* Информация о пользователе */}
      <Card className="border-2 border-black shadow-lg">
        <CardHeader className="bg-gradient-to-r from-yellow-400 to-orange-400">
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <Avatar className="w-20 h-20 border-4 border-black">
                {user?.image ? (
                  <Image
                    src={user.image}
                    alt={session.user.name || 'Avatar'}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <AvatarFallback className="bg-red-500 text-white text-2xl font-black">
                    {getInitials(session.user.name ?? 'UN')}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <CardTitle className="text-3xl font-black text-black" style={{ textShadow: '2px 2px 0px #ff0000' }}>
                {session.user.name}
              </CardTitle>
              <CardDescription className="text-lg font-bold text-black">
                {session.user.email}
              </CardDescription>
              <div className="flex items-center space-x-4 mt-2 text-sm">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Участник с {user?.createdAt ? formatDateShort(user.createdAt) : 'недавно'}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-black" style={{ textShadow: '1px 1px 0px #000000' }}>
              Изменить аватарку
            </h3>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
                  className="hidden"
                  id="avatar-upload"
                />
                <label
                  htmlFor="avatar-upload"
                  className="cursor-pointer bg-red-500 hover:bg-red-600 text-white border-2 border-black font-bold px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                  style={{ textShadow: '1px 1px 0px #000000' }}
                >
                  <Upload className="w-4 h-4" />
                  <span>Выбрать файл</span>
                </label>
              </div>
              
              {previewUrl && (
                <div className="flex items-center space-x-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-black">
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <Button
                    onClick={handleUploadAvatar}
                    disabled={updateUserAvatar.isPending}
                    className="bg-green-500 hover:bg-green-600 text-white border-2 border-black font-bold"
                    style={{ textShadow: '1px 1px 0px #000000' }}
                  >
                    {updateUserAvatar.isPending ? 'Загрузка...' : 'Загрузить'}
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedFile(null)
                      setPreviewUrl(null)
                    }}
                    variant="outline"
                    className="border-2 border-black"
                  >
                    Отмена
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-2 border-black text-center">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-black text-red-500" style={{ textShadow: '2px 2px 0px #000000' }}>
              {userComments?.length || 0}
            </CardTitle>
            <CardDescription className="font-bold">Комментариев</CardDescription>
          </CardHeader>
          <CardContent>
            <MessageCircle className="w-8 h-8 text-red-500 mx-auto" />
          </CardContent>
        </Card>

        <Card className="border-2 border-black text-center">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-black text-red-500" style={{ textShadow: '2px 2px 0px #000000' }}>
              {userLikes?.length || 0}
            </CardTitle>
            <CardDescription className="font-bold">Лайков</CardDescription>
          </CardHeader>
          <CardContent>
            <Heart className="w-8 h-8 text-red-500 mx-auto" />
          </CardContent>
        </Card>

        <Card className="border-2 border-black text-center">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-black text-red-500" style={{ textShadow: '2px 2px 0px #000000' }}>
              {user?.videos?.length || 0}
            </CardTitle>
            <CardDescription className="font-bold">Видео</CardDescription>
          </CardHeader>
          <CardContent>
            <Play className="w-8 h-8 text-red-500 mx-auto" />
          </CardContent>
        </Card>
      </div>

      {/* Комментарии пользователя */}
      <Card className="border-2 border-black">
        <CardHeader className="bg-yellow-100 border-b-2 border-black">
          <CardTitle className="text-2xl font-black text-black" style={{ textShadow: '2px 2px 0px #ff0000' }}>
            Мои комментарии
          </CardTitle>
          <CardDescription className="font-bold">
            Все ваши комментарии к эпизодам
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {commentsLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="border-2 border-gray-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : !userComments || userComments.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl font-bold text-gray-600">
                У вас пока нет комментариев
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {userComments.map((comment) => (
                <div key={comment.id} className="border-2 border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <Avatar className="w-10 h-10 border-2 border-black">
                        <AvatarFallback className="bg-red-500 text-white font-bold">
                          {getInitials(comment.user.name ?? 'UN')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-bold text-lg text-black">{comment.user.name}</h4>
                          <span className="text-sm text-gray-500">{formatDateShort(comment.createdAt)}</span>
                        </div>
                        <p className="text-gray-800 mb-3">{comment.content}</p>
                        
                        {/* Информация об эпизоде */}
                        <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-3">
                          <div className="flex items-center space-x-3">
                            {comment.episode.image ? (
                              <div className="relative w-12 h-8 rounded overflow-hidden">
                                <Image
                                  src={comment.episode.image}
                                  alt={comment.episode.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center">
                                <Play className="w-4 h-4 text-gray-400" />
                              </div>
                            )}
                            <div className="flex-1">
                              <h5 className="font-bold text-sm text-black">
                                {comment.episode.season.title} - Эпизод {comment.episode.episodeNumber}
                              </h5>
                              <p className="text-xs text-gray-600 line-clamp-1">
                                {comment.episode.title}
                              </p>
                            </div>
                            <Button asChild size="sm" className="bg-red-500 hover:bg-red-600 text-white border-2 border-black font-bold text-xs">
                              <Link 
                                href={`/gallery/episode/${comment.episode.id}`}
                                data-analytics="watch_comment_button"
                                data-season={comment.episode.season.seasonNumber}
                                data-episode={comment.episode.episodeNumber}
                                data-episode-title={comment.episode.title}
                              >
                                <Play className="w-3 h-3 mr-1" />
                                Смотреть
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      variant="destructive"
                      size="sm"
                      className="bg-red-500 hover:bg-red-600 text-white border-2 border-black font-bold"
                      style={{ textShadow: '1px 1px 0px #000000' }}
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export const ProfileLoading = () => {
  return (
    <div className="space-y-8">
      {/* Информация о пользователе */}
      <Card className="border-2 border-black shadow-lg">
        <CardHeader className="bg-gradient-to-r from-yellow-400 to-orange-400">
          <div className="flex items-center space-x-4">
            <Skeleton className="w-20 h-20 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="border-2 border-black text-center">
            <CardHeader className="pb-2">
              <Skeleton className="h-8 w-16 mx-auto mb-2" />
              <Skeleton className="h-4 w-24 mx-auto" />
            </CardHeader>
            <CardContent>
              <Skeleton className="w-8 h-8 mx-auto" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Комментарии */}
      <Card className="border-2 border-black">
        <CardHeader className="bg-yellow-100 border-b-2 border-black">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="border-2 border-gray-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
