'use client'

import { ThumbsUp, ThumbsDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { trpc } from '@/app/_trpc/client'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

interface CommentLikeButtonProps {
  commentId: string
  likes: number
  dislikes: number
  userLike?: 'like' | 'dislike' | null | undefined
}

const CommentLikeButton = ({ commentId, likes, dislikes, userLike }: CommentLikeButtonProps) => {
  const { data: session } = useSession()
  const utils = trpc.useUtils()

  const likeComment = trpc.comment.likeComment.useMutation({
    onSuccess: () => {
      utils.comment.getComments.invalidate()
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const handleLike = (type: 'like' | 'dislike') => {
    if (!session?.user?.id) {
      toast.error('Вы должны быть авторизованы, чтобы ставить лайки')
      return
    }

    likeComment.mutate({
      commentId,
      userId: session.user.id,
      type
    })
  }

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleLike('like')}
        disabled={likeComment.isPending}
        className={`flex items-center space-x-1 ${
          userLike === 'like' 
            ? 'text-green-600 bg-green-100' 
            : 'text-gray-600 hover:text-green-600'
        }`}
      >
        <ThumbsUp className="w-4 h-4" />
        <span>{likes}</span>
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleLike('dislike')}
        disabled={likeComment.isPending}
        className={`flex items-center space-x-1 ${
          userLike === 'dislike' 
            ? 'text-red-600 bg-red-100' 
            : 'text-gray-600 hover:text-red-600'
        }`}
      >
        <ThumbsDown className="w-4 h-4" />
        <span>{dislikes}</span>
      </Button>
    </div>
  )
}

export default CommentLikeButton
