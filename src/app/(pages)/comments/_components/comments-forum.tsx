'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { trpc } from '@/app/_trpc/client'
import { formatDateShort, getInitials } from '@/lib/utils'
import { MessageCircle, Play, Calendar, Eye, Heart, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'

export const CommentsForum = () => {
  const { data: comments, isLoading } = trpc.comment.getAllComments.useQuery()
  const { data: session } = useSession()
  const utils = trpc.useUtils()

  const deleteComment = trpc.comment.deleteComment.useMutation({
    onSuccess: () => {
      toast.success('Комментарий удален!')
      utils.comment.getAllComments.invalidate()
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const handleDelete = (commentId: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этот комментарий?')) {
      deleteComment.mutate({ id: commentId })
    }
  }

  if (isLoading) {
    return <CommentsForumLoading />
  }

  if (!comments || comments.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-8">
          <MessageCircle className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
          <h3 className="text-2xl font-black text-yellow-800 mb-2" style={{ textShadow: '2px 2px 0px #000000' }}>
            &quot;OH MY GOD! THEY KILLED KENNY!&quot;
          </h3>
          <p className="text-yellow-700 font-bold text-lg">
            Пока нет комментариев! Будьте первым, кто оставит комментарий!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-4">
        <h2 className="text-2xl font-black text-black mb-2" style={{ textShadow: '2px 2px 0px #ff0000' }}>
          Всего комментариев: {comments.length}
        </h2>
        <p className="text-yellow-800 font-bold">
          Обсуждаем все эпизоды Южного парка!
        </p>
      </div>

      <div className="space-y-4">
        {comments.map((comment) => (
          <Card key={comment.id} className="overflow-hidden hover:shadow-lg transition-shadow border-2 border-black">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10 border-2 border-black">
                    {comment.user.image ? (
                      <Image
                        src={comment.user.image}
                        alt={comment.user.name || 'Avatar'}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <AvatarFallback className="bg-red-500 text-white font-bold">
                        {getInitials(comment.user.name ?? 'UN')}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg text-black font-black" style={{ textShadow: '1px 1px 0px #000000' }}>
                      {comment.user.name}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {formatDateShort(comment.createdAt)}
                    </CardDescription>
                  </div>
                </div>
                {session?.user?.id === comment.userId && (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="bg-red-500 hover:bg-red-600 text-white border-2 border-black font-bold"
                    style={{ textShadow: '1px 1px 0px #000000' }}
                    onClick={() => handleDelete(comment.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" /> Удалить
                  </Button>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                <p className="text-gray-800 leading-relaxed">{comment.content}</p>
              </div>
              
              {/* Информация об эпизоде */}
              <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {comment.episode.image ? (
                      <div className="relative w-16 h-12 rounded-lg overflow-hidden">
                        <Image
                          src={comment.episode.image}
                          alt={comment.episode.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Play className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-black">
                        {comment.episode.season.title} - Эпизод {comment.episode.episodeNumber}
                      </h4>
                      <p className="text-sm text-gray-600 line-clamp-1">
                        {comment.episode.title}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {comment.episode.views}
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {comment.episode.likes.length}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDateShort(comment.episode.createdAt)}
                    </div>
                  </div>
                </div>
                
                <div className="mt-3">
                  <Button asChild size="sm" className="bg-red-500 hover:bg-red-600 text-white border-2 border-black font-bold" style={{ textShadow: '1px 1px 0px #000000' }}>
                    <Link href={`/gallery/episode/${comment.episode.id}`}>
                      <Play className="w-4 h-4 mr-2" />
                      Смотреть эпизод
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export const CommentsForumLoading = () => {
  return (
    <div className="space-y-6">
      <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-4">
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-6 w-96" />
      </div>

      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <Card key={index} className="overflow-hidden border-2 border-black">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <Skeleton className="h-8 w-20" />
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              
              <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="w-16 h-12 rounded-lg" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
                <div className="mt-3">
                  <Skeleton className="h-8 w-32" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
