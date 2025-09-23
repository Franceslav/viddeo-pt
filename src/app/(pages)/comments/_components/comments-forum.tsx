'use client'

import { MessageCircle, Reply, ThumbsUp, ThumbsDown } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { trpc } from '@/app/_trpc/client'
import Link from 'next/link'
import Image from 'next/image'
import { useSession } from 'next-auth/react'

const CommentsForum = () => {
  const { data: comments, isLoading, refetch } = trpc.comment.getAllComments.useQuery()
  const { data: session } = useSession()
  
  const likeCommentMutation = trpc.comment.likeComment.useMutation({
    onSuccess: () => refetch()
  })
  
  const likeCharacterCommentMutation = trpc.comment.likeCharacterComment.useMutation({
    onSuccess: () => refetch()
  })

  const handleLike = (commentId: string, type: 'like' | 'dislike', commentType: 'episode' | 'character') => {
    if (!session?.user?.id) return
    
    if (commentType === 'episode') {
      likeCommentMutation.mutate({ commentId, userId: session.user.id, type })
    } else {
      likeCharacterCommentMutation.mutate({ commentId, userId: session.user.id, type })
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Все комментарии ({comments?.length || 0})
        </h2>

        {comments && comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((comment) => (
              <Card key={comment.id}>
                <CardContent className="pt-6">
                  <div className="flex gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={comment.user.image || undefined} alt={comment.user.name || 'Пользователь'} />
                      <AvatarFallback>
                        {comment.user.name ? comment.user.name[0].toUpperCase() : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {comment.user.name || 'Аноним'}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {new Date(comment.createdAt).toLocaleDateString('ru-RU')}
                        </Badge>
                        {comment.type === 'episode' && comment.episode && (
                          <Link href={`/gallery/video/${comment.episode.id}`}>
                            <div className="cursor-pointer hover:bg-blue-50 p-2 rounded-lg transition-colors inline-block">
                              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                📺 {comment.episode.title}
                              </Badge>
                            </div>
                          </Link>
                        )}
                        {comment.type === 'character' && comment.character && (
                          <Link href={`/characters/${comment.character.id}`}>
                            <div className="flex items-center gap-2 cursor-pointer hover:bg-green-50 p-2 rounded-lg transition-colors">
                              {comment.character.image && (
                                <div className="w-8 h-8 rounded-full overflow-hidden">
                                  <Image
                                    src={comment.character.image}
                                    alt={comment.character.name}
                                    width={32}
                                    height={32}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                👤 {comment.character.name}
                              </Badge>
                            </div>
                          </Link>
                        )}
                      </div>
                      <p className="text-gray-700">{comment.content}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleLike(comment.id, 'like', comment.type)}
                            className="flex items-center gap-1 hover:text-green-500 transition-colors"
                            disabled={!session?.user?.id}
                          >
                            <ThumbsUp className="w-4 h-4" />
                            {comment.commentLikes.filter(like => like.type === 'like').length}
                          </button>
                          <button 
                            onClick={() => handleLike(comment.id, 'dislike', comment.type)}
                            className="flex items-center gap-1 hover:text-red-500 transition-colors"
                            disabled={!session?.user?.id}
                          >
                            <ThumbsDown className="w-4 h-4" />
                            {comment.commentLikes.filter(like => like.type === 'dislike').length}
                          </button>
                        </div>
                        <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                          <Reply className="w-4 h-4" />
                          {comment.replies.length}
                        </button>
                      </div>
                      
                      {/* Ответы на комментарий */}
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-4 pl-4 border-l-2 border-gray-200 space-y-3">
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="flex gap-2">
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={reply.user.image || undefined} alt={reply.user.name || 'Пользователь'} />
                                <AvatarFallback className="text-xs">
                                  {reply.user.name ? reply.user.name[0].toUpperCase() : 'U'}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium">
                                    {reply.user.name || 'Аноним'}
                                  </span>
                                  <Badge variant="secondary" className="text-xs">
                                    {new Date(reply.createdAt).toLocaleDateString('ru-RU')}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600">{reply.content}</p>
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                  <div className="flex items-center gap-2">
                                    <button 
                                      onClick={() => handleLike(reply.id, 'like', comment.type)}
                                      className="flex items-center gap-1 hover:text-green-500 transition-colors"
                                      disabled={!session?.user?.id}
                                    >
                                      <ThumbsUp className="w-3 h-3" />
                                      {reply.commentLikes.filter(like => like.type === 'like').length}
                                    </button>
                                    <button 
                                      onClick={() => handleLike(reply.id, 'dislike', comment.type)}
                                      className="flex items-center gap-1 hover:text-red-500 transition-colors"
                                      disabled={!session?.user?.id}
                                    >
                                      <ThumbsDown className="w-3 h-3" />
                                      {reply.commentLikes.filter(like => like.type === 'dislike').length}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-gray-500">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Пока нет комментариев. Будьте первым!</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export { CommentsForum }
