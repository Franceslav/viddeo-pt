'use client'

import { useState } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDateShort, getInitials } from '@/lib/utils'
import { Trash2, Reply } from 'lucide-react'
import Image from 'next/image'
import CharacterCommentLikeButton from './character-comment-like-button'
import CharacterCommentReplyForm from './character-comment-reply-form'

interface CharacterCommentReply {
  id: string
  content: string
  userId: string
  createdAt: Date
  user: {
    name: string | null
    email: string | null
    image: string | null
  }
  characterCommentLikes: Array<{
    id: string
    userId: string
    type: string
  }>
  replies?: CharacterCommentReply[]
}

interface CharacterCommentRepliesProps {
  replies: CharacterCommentReply[]
  characterId: string
  session: {
    user?: {
      id?: string
    }
  } | null
  onDelete: (commentId: string) => void
  depth?: number
}

const CharacterCommentReplies = ({ replies, characterId, session, onDelete, depth = 0 }: CharacterCommentRepliesProps) => {
  const [replyingTo, setReplyingTo] = useState<string | null>(null)

  if (!replies || replies.length === 0) return null

  return (
    <div className={`space-y-3 ${depth > 0 ? 'ml-4' : 'ml-6'}`}>
      {replies.map((reply) => {
        const likes = reply.characterCommentLikes?.filter((like) => like.type === 'like').length || 0
        const dislikes = reply.characterCommentLikes?.filter((like) => like.type === 'dislike').length || 0
        const userLike = reply.characterCommentLikes?.find((like) => like.userId === session?.user?.id)?.type as 'like' | 'dislike' | null || null

        return (
          <div key={reply.id} className="space-y-2">
            {/* Ответ */}
            <div className={`bg-gray-50 border-2 border-gray-200 rounded-lg p-4 ${depth > 0 ? 'bg-gray-100' : ''}`}>
              <div className="flex items-start space-x-3">
                <Avatar className={`border-2 ${depth > 0 ? 'w-8 h-8 border-gray-300' : 'w-10 h-10 border-black'}`}>
                  {reply.user.image ? (
                    <Image
                      src={reply.user.image}
                      alt={reply.user.name || 'Avatar'}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <AvatarFallback className={`font-bold ${depth > 0 ? 'bg-blue-400 text-white text-xs' : 'bg-yellow-400 text-black'}`}>
                      {getInitials(reply.user.name ?? 'U')}
                    </AvatarFallback>
                  )}
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <h5 className={`font-bold text-black ${depth > 0 ? 'text-xs' : 'text-sm'}`}>
                        {reply.user.name || 'Анонимный пользователь'}
                      </h5>
                      <Badge variant="outline" className="text-xs">
                        {formatDateShort(reply.createdAt)}
                      </Badge>
                    </div>

                    {session?.user?.id === reply.userId && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(reply.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-100 p-1"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>

                  <p className={`text-gray-700 leading-relaxed mb-2 ${depth > 0 ? 'text-xs' : 'text-sm'}`}>
                    {reply.content}
                  </p>

                  <div className="flex items-center justify-between">
                    <CharacterCommentLikeButton
                      characterCommentId={reply.id}
                      likes={likes}
                      dislikes={dislikes}
                      userLike={userLike}
                    />

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setReplyingTo(replyingTo === reply.id ? null : reply.id)}
                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                    >
                      <Reply className="w-3 h-3 mr-1" />
                      Ответить
                    </Button>
                  </div>
                </div>
              </div>

              {/* Форма ответа на ответ */}
              {replyingTo === reply.id && (
                <div className={`mt-2 ${depth > 0 ? 'ml-4' : 'ml-6'} bg-gray-100 border-2 border-gray-300 rounded-lg p-3`}>
                  <CharacterCommentReplyForm
                    parentId={reply.id}
                    characterId={characterId}
                    onCancel={() => setReplyingTo(null)}
                  />
                </div>
              )}
            </div>

            {/* Рекурсивное отображение дальнейших ответов */}
            {reply.replies && reply.replies.length > 0 && (
              <CharacterCommentReplies
                replies={reply.replies}
                characterId={characterId}
                session={session}
                onDelete={onDelete}
                depth={depth + 1}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default CharacterCommentReplies
