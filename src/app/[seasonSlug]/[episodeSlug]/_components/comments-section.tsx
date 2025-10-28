'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThumbsUp, ThumbsDown, ChevronDown, ChevronUp } from "lucide-react"
import { toast } from "sonner"
import { trpc } from '@/app/_trpc/client'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

interface Comment {
  id: string
  content: string
  createdAt: string
  user: {
    id: string
    name: string | null
    email: string
    image: string | null
  }
  commentLikes: {
    id: string
    type: 'like' | 'dislike'
    userId: string
  }[]
  replies?: Comment[]
  _count?: {
    replies: number
  }
}

interface CommentsSectionProps {
  episodeId: string
  isAuthenticated: boolean
}


export default function CommentsSection({ episodeId, isAuthenticated }: CommentsSectionProps) {
  const { data: session } = useSession()
  const [newComment, setNewComment] = useState('')
  const [replyText, setReplyText] = useState<Record<string, string>>({})
  const [showReplies, setShowReplies] = useState<Record<string, boolean>>({})
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [allComments, setAllComments] = useState<Comment[]>([])
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined)
  const [hasMore, setHasMore] = useState(true)

  // TRPC queries and mutations
  const { data: commentsData, isLoading, refetch } = trpc.comment.getEpisodeComments.useQuery({
    episodeId,
    sortBy: 'top',
    limit: 20,
    cursor: nextCursor
  })

  // Обновляем комментарии при изменении данных
  useEffect(() => {
    if (commentsData) {
      if (nextCursor && nextCursor !== commentsData.nextCursor) {
        // Загружаем больше комментариев
        setAllComments(prev => [...prev, ...(commentsData.comments as unknown as Comment[])])
      } else {
        // Первая загрузка или смена сортировки
        setAllComments(commentsData.comments as unknown as Comment[])
      }
      setNextCursor(commentsData.nextCursor)
      setHasMore(!!commentsData.nextCursor)
    }
  }, [commentsData, nextCursor])


  const addCommentMutation = trpc.comment.addComment.useMutation({
    onSuccess: () => {
      setNewComment('')
      setAllComments([])
      setNextCursor(undefined)
      setHasMore(true)
      refetch()
      toast.success('Комментарий добавлен!')
    },
    onError: (error) => {
      console.error('Comment error:', error)
      if (error.message.includes('User not found')) {
        toast.error('Ошибка авторизации. Пожалуйста, войдите заново.')
      } else {
        toast.error(error.message || 'Ошибка при добавлении комментария')
      }
    }
  })

  const addReplyMutation = trpc.comment.addComment.useMutation({
    onSuccess: () => {
      setReplyText({})
      setReplyingTo(null)
      setAllComments([])
      setNextCursor(undefined)
      setHasMore(true)
      refetch()
      toast.success('Ответ добавлен!')
    },
    onError: (error) => {
      console.error('Reply error:', error)
      if (error.message.includes('User not found')) {
        toast.error('Ошибка авторизации. Пожалуйста, войдите заново.')
      } else {
        toast.error(error.message || 'Ошибка при добавлении ответа')
      }
    }
  })

  const likeCommentMutation = trpc.comment.likeComment.useMutation({
    onSuccess: () => {
      // Сбрасываем локальное состояние и перезагружаем данные
      setAllComments([])
      setNextCursor(undefined)
      setHasMore(true)
      refetch()
    },
    onError: (error) => {
      console.error('Like error:', error)
      if (error.message.includes('User not found')) {
        toast.error('Ошибка авторизации. Пожалуйста, войдите заново.')
      } else {
        toast.error(error.message || 'Ошибка при оценке комментария')
      }
    }
  })

  const deleteCommentMutation = trpc.comment.deleteComment.useMutation({
    onSuccess: () => {
      setAllComments([])
      setNextCursor(undefined)
      setHasMore(true)
      refetch()
      toast.success('Комментарий удален!')
    },
    onError: (error) => {
      console.error('Delete error:', error)
      if (error.message.includes('User not found')) {
        toast.error('Ошибка авторизации. Пожалуйста, войдите заново.')
      } else {
        toast.error(error.message || 'Ошибка при удалении комментария')
      }
    }
  })

  const loadMoreComments = () => {
    if (hasMore && !isLoading && nextCursor) {
      // Триггерим новую загрузку с текущим курсором
      refetch()
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newComment.trim()) {
      toast.error('Введите текст комментария')
      return
    }

    if (!session?.user?.id) {
      toast.error('Войдите в систему, чтобы оставить комментарий')
      return
    }

    addCommentMutation.mutate({
      episodeId,
      content: newComment.trim(),
      userId: session.user.id,
      userName: session.user.name || undefined,
      userEmail: session.user.email || undefined,
      userImage: session.user.image || undefined
    })
  }

  const handleReply = (parentId: string) => {
    if (!session?.user?.id) return
    
    const text = replyText[parentId]?.trim()
    if (!text) return

    addReplyMutation.mutate({
      episodeId,
      content: text,
      userId: session.user.id,
      userName: session.user.name || undefined,
      userEmail: session.user.email || undefined,
      userImage: session.user.image || undefined,
      parentId
    })
  }

  const handleLike = (commentId: string, type: 'like' | 'dislike') => {
    if (!session?.user?.id) {
      toast.error('Войдите, чтобы оценить комментарий')
      return
    }

    likeCommentMutation.mutate({
      commentId,
      userId: session.user.id,
      type
    })
  }

  const handleDeleteComment = (commentId: string) => {
    if (!session?.user?.id) {
      toast.error('Войдите, чтобы удалить комментарий')
      return
    }

    if (window.confirm('Вы уверены, что хотите удалить этот комментарий?')) {
      deleteCommentMutation.mutate({
        id: commentId,
        userId: session.user.id
      })
    }
  }

  const handleReplyToggle = (commentId: string) => {
    if (!session?.user?.id) {
      toast.error('Войдите, чтобы ответить на комментарий')
      return
    }

    if (replyingTo === commentId) {
      setReplyingTo(null)
      setReplyText(prev => ({ ...prev, [commentId]: '' }))
    } else {
      setReplyingTo(commentId)
      setReplyText(prev => ({ ...prev, [commentId]: '' }))
    }
  }


  const toggleReplies = (commentId: string) => {
    setShowReplies(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }))
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'только что'
    if (diffInHours < 24) return `${diffInHours} ч назад`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays} дн назад`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} нед назад`
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} мес назад`
    
    return `${Math.floor(diffInDays / 365)} г назад`
  }

  const getLikesCount = (comment: Comment) => {
    return comment.commentLikes.filter(like => like.type === 'like').length
  }

  const getDislikesCount = (comment: Comment) => {
    return comment.commentLikes.filter(like => like.type === 'dislike').length
  }

  const getUserInitial = (name: string | null, email: string) => {
    if (name) return name.charAt(0).toUpperCase()
    return email.charAt(0).toUpperCase()
  }

  const totalComments = allComments?.reduce((total, comment) => {
    return total + 1 + (comment._count?.replies || 0)
  }, 0) || 0

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      {/* Заголовок с сортировкой */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">
          Комментарии {totalComments > 0 && `(${totalComments})`}
        </h3>
      </div>
      
      {/* Форма добавления комментария */}
      <div className="mb-8">
        {isAuthenticated ? (
          <form onSubmit={handleSubmitComment} className="flex gap-4">
            <Avatar className="w-10 h-10">
              <AvatarImage src={session?.user?.image || undefined} />
              <AvatarFallback className="bg-blue-500 text-white">
                {getUserInitial(session?.user?.name || null, session?.user?.email || '')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Добавить комментарий..."
                className="w-full bg-gray-700 text-white border-gray-600 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                disabled={addCommentMutation.isPending}
              />
              <div className="flex justify-end mt-3">
                <Button 
                  type="submit"
                  size="sm" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                  disabled={addCommentMutation.isPending || !newComment.trim()}
                >
                  {addCommentMutation.isPending ? 'Отправка...' : 'Комментировать'}
                </Button>
              </div>
            </div>
          </form>
        ) : (
          <div className="text-center py-8 bg-gray-700 rounded-lg">
            <p className="text-gray-300 mb-4">Войдите, чтобы оставить комментарий</p>
            <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
              <Link href="/auth">Войти</Link>
            </Button>
          </div>
        )}
      </div>

      {/* Список комментариев */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center py-8 text-gray-400">
            <p>Загрузка комментариев...</p>
          </div>
        ) : !allComments || allComments.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p>Пока нет комментариев. Будьте первым!</p>
          </div>
        ) : (
          allComments.map((comment) => (
            <div key={comment.id} id={`comment-${comment.id}`} className="flex gap-4">
              <Avatar className="w-10 h-10 flex-shrink-0">
                <AvatarImage src={comment.user.image || undefined} />
                <AvatarFallback className="bg-blue-500 text-white">
                  {getUserInitial(comment.user.name, comment.user.email)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                {/* Информация о пользователе и время */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white text-sm">
                      {comment.user.name || 'Анонимный пользователь'}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatDate(comment.createdAt)}
                    </span>
                  </div>
                  
                  {/* Кнопка удаления для автора */}
                  {session?.user?.id === comment.user?.id && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      disabled={deleteCommentMutation.isPending}
                      className="text-red-400 hover:text-red-300 text-xs px-2 py-1 rounded hover:bg-red-900/20 transition-colors disabled:opacity-50"
                      title="Удалить комментарий"
                    >
                      {deleteCommentMutation.isPending ? 'Удаление...' : 'Удалить'}
                    </button>
                  )}
                </div>
                
                {/* Содержимое комментария */}
                <p className="text-gray-300 text-sm mb-3 leading-relaxed">
                  {comment.content}
                </p>
                
                {/* Действия с комментарием */}
                <div className="flex items-center gap-4 mb-4">
                  <button 
                    onClick={() => handleLike(comment.id, 'like')}
                    className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
                    disabled={likeCommentMutation.isPending}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span className="text-xs">{getLikesCount(comment)}</span>
                  </button>
                  
                  <button 
                    onClick={() => handleLike(comment.id, 'dislike')}
                    className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
                    disabled={likeCommentMutation.isPending}
                  >
                    <ThumbsDown className="w-4 h-4" />
                    <span className="text-xs">{getDislikesCount(comment)}</span>
                  </button>
                  
                  <button 
                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    Ответить
                  </button>
                  
                </div>

                {/* Форма ответа */}
                {replyingTo === comment.id && (
                  <div className="mb-4">
                    {isAuthenticated ? (
                      <div className="flex gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={session?.user?.image || undefined} />
                          <AvatarFallback className="bg-green-500 text-white text-xs">
                            {getUserInitial(session?.user?.name || null, session?.user?.email || '')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <Textarea
                            value={replyText[comment.id] || ''}
                            onChange={(e) => setReplyText(prev => ({ ...prev, [comment.id]: e.target.value }))}
                            placeholder={`Ответить ${comment.user.name || 'пользователю'}...`}
                            className="w-full bg-gray-700 text-white border-gray-600 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[60px]"
                            disabled={addReplyMutation.isPending}
                          />
                          <div className="flex justify-end gap-2 mt-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setReplyingTo(null)}
                              className="text-gray-400 hover:text-white"
                            >
                              Отмена
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleReply(comment.id)}
                              disabled={addReplyMutation.isPending || !replyText[comment.id]?.trim()}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              {addReplyMutation.isPending ? 'Отправка...' : 'Ответить'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4 bg-gray-700 rounded-lg">
                        <p className="text-gray-300 text-sm mb-2">Войдите, чтобы ответить</p>
                        <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                          <Link href="/auth">Войти</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {/* Ответы на комментарии */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="ml-4">
                    <button
                      onClick={() => toggleReplies(comment.id)}
                      className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm mb-3 transition-colors"
                    >
                      {showReplies[comment.id] ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                      {showReplies[comment.id] ? 'Скрыть' : 'Показать'} {comment.replies.length} ответов
                    </button>
                    
                    {showReplies[comment.id] && (
                      <div className="space-y-4">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={reply.user.image || undefined} />
                              <AvatarFallback className="bg-green-500 text-white text-xs">
                                {getUserInitial(reply.user.name, reply.user.email)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-white text-sm">
                                    {reply.user.name || 'Анонимный пользователь'}
                                  </span>
                                  <span className="text-xs text-gray-400">
                                    {formatDate(reply.createdAt)}
                                  </span>
                                </div>
                                
                                {/* Кнопка удаления для автора ответа */}
                                {session?.user?.id === reply.user?.id && (
                                  <button
                                    onClick={() => handleDeleteComment(reply.id)}
                                    disabled={deleteCommentMutation.isPending}
                                    className="text-red-400 hover:text-red-300 text-xs px-1 py-0.5 rounded hover:bg-red-900/20 transition-colors disabled:opacity-50"
                                    title="Удалить ответ"
                                  >
                                    {deleteCommentMutation.isPending ? '...' : '×'}
                                  </button>
                                )}
                              </div>
                              <p className="text-gray-300 text-sm mb-2 leading-relaxed">
                                {reply.content}
                              </p>
                              <div className="flex items-center gap-4">
                                <button 
                                  onClick={() => handleLike(reply.id, 'like')}
                                  className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
                                  disabled={likeCommentMutation.isPending}
                                >
                                  <ThumbsUp className="w-3 h-3" />
                                  <span className="text-xs">{getLikesCount(reply)}</span>
                                </button>
                                <button 
                                  onClick={() => handleLike(reply.id, 'dislike')}
                                  className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
                                  disabled={likeCommentMutation.isPending}
                                >
                                  <ThumbsDown className="w-3 h-3" />
                                  <span className="text-xs">{getDislikesCount(reply)}</span>
                                </button>
                                <button 
                                  onClick={() => handleReplyToggle(`reply-${comment.id}`)}
                                  className="text-gray-400 hover:text-white text-xs transition-colors"
                                >
                                  Ответить
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Форма ответа на ответ */}
                    {replyingTo && replyingTo.startsWith('reply-') && replyingTo === `reply-${comment.id}` && (
                      <div className="mt-4 ml-11 bg-gray-800 rounded-lg p-4">
                        <div className="flex gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={session?.user?.image || undefined} />
                            <AvatarFallback className="bg-blue-500 text-white text-xs">
                              {getUserInitial(session?.user?.name || null, session?.user?.email || '')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <Textarea
                              value={replyText[comment.id] || ''}
                              onChange={(e) => setReplyText(prev => ({ ...prev, [comment.id]: e.target.value }))}
                              placeholder={`Ответить на ответ...`}
                              className="w-full bg-gray-700 text-white border-gray-600 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[60px]"
                              disabled={addReplyMutation.isPending}
                            />
                            <div className="flex justify-end gap-2 mt-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setReplyingTo(null)
                                  setReplyText(prev => ({ ...prev, [comment.id]: '' }))
                                }}
                                className="text-gray-400 border-gray-600 hover:bg-gray-700"
                              >
                                Отмена
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleReply(comment.id)}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                disabled={addReplyMutation.isPending || !replyText[comment.id]?.trim()}
                              >
                                {addReplyMutation.isPending ? 'Отправка...' : 'Ответить'}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {/* Кнопка загрузки дополнительных комментариев */}
        {hasMore && allComments.length > 0 && (
          <div className="text-center py-4">
            <Button
              onClick={loadMoreComments}
              disabled={isLoading}
              variant="outline"
              className="bg-gray-700 hover:bg-gray-600 border-gray-600 text-white"
            >
              {isLoading ? 'Загрузка...' : 'Загрузить еще'}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}