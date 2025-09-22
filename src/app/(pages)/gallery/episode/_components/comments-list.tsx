'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { trpc } from '@/app/_trpc/client'
import { useSession } from 'next-auth/react'
import { formatDateShort, getInitials } from '@/lib/utils'
import { Trash2, Reply } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'
import { useState } from 'react'
import CommentLikeButton from './comment-like-button'
import CommentReplyForm from './comment-reply-form'
import CommentReplies from './comment-replies'

interface CommentsListProps {
  episodeId: string
}

const CommentsList = ({ episodeId }: CommentsListProps) => {
  const { data: session } = useSession()
  const utils = trpc.useUtils()
  const [replyingTo, setReplyingTo] = useState<string | null>(null)

  const { data: comments, isLoading, error } = trpc.comment.getComments.useQuery({ episodeId })

  const deleteComment = trpc.comment.deleteComment.useMutation({
    onSuccess: () => {
      utils.comment.getComments.invalidate({ episodeId })
      toast.success('Комментарий удален!')
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const handleDelete = async (commentId: string) => {
    if (!session?.user?.id) return
    
    if (confirm('Удалить комментарий?')) {
      await deleteComment.mutateAsync({
        id: commentId
      })
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="bg-gray-100 rounded-lg p-4 animate-pulse">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                <div className="h-3 bg-gray-300 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-black text-black" style={{ textShadow: '2px 2px 0px #ff0000' }}>
          КОММЕНТАРИИ
        </h3>
        <div className="bg-red-100 border-2 border-red-400 rounded-lg p-4 text-center">
          <p className="text-red-800 font-bold">Ошибка загрузки комментариев:</p>
          <p className="text-red-600 text-sm mt-1">{error.message}</p>
        </div>
      </div>
    )
  }

  if (!comments || comments.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-6">
          <p className="text-yellow-800 font-bold text-lg">
            &quot;OH MY GOD! THEY KILLED KENNY!&quot; - Пока нет комментариев!
          </p>
          <p className="text-yellow-700 mt-2">
            Будьте первым, кто оставит комментарий к этому эпизоду!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black text-black" style={{ textShadow: '2px 2px 0px #ff0000' }}>
          КОММЕНТАРИИ ({comments.length})
        </h3>
      </div>
      
      {comments.map((comment) => {
        const likes = comment.commentLikes?.filter(like => like.type === 'like').length || 0
        const dislikes = comment.commentLikes?.filter(like => like.type === 'dislike').length || 0
        const userLike = comment.commentLikes?.find(like => like.userId === session?.user?.id)?.type as 'like' | 'dislike' | null || null

        return (
          <div key={comment.id} className="space-y-3">
            {/* Основной комментарий */}
            <div className="bg-white border-2 border-black rounded-lg p-4 shadow-lg">
              <div className="flex items-start space-x-3">
                <Avatar className="w-10 h-10 border-2 border-black">
                  {comment.user.image ? (
                    <Image
                      src={comment.user.image}
                      alt={comment.user.name || 'Avatar'}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <AvatarFallback className="bg-yellow-400 text-black font-bold">
                      {getInitials(comment.user.name ?? 'U')}
                    </AvatarFallback>
                  )}
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-black text-sm">
                        {comment.user.name || 'Анонимный пользователь'}
                      </h4>
                      <Badge variant="secondary" className="text-xs">
                        {formatDateShort(comment.createdAt)}
                      </Badge>
                    </div>
                    
                    {session?.user?.id === comment.userId && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(comment.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-100 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  
                  <p className="text-gray-800 text-sm leading-relaxed mb-3">
                    {comment.content}
                  </p>

                  <div className="flex items-center justify-between">
                    <CommentLikeButton
                      commentId={comment.id}
                      likes={likes}
                      dislikes={dislikes}
                      userLike={userLike}
                    />
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                    >
                      <Reply className="w-4 h-4 mr-1" />
                      Ответить
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Форма ответа */}
            {replyingTo === comment.id && (
              <div className="ml-6 bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
                <CommentReplyForm
                  parentId={comment.id}
                  episodeId={episodeId}
                  onCancel={() => setReplyingTo(null)}
                />
              </div>
            )}

            {/* Ответы на комментарий */}
            {comment.replies && comment.replies.length > 0 && (
              <CommentReplies
                replies={comment.replies}
                episodeId={episodeId}
                session={session}
                onDelete={handleDelete}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default CommentsList
