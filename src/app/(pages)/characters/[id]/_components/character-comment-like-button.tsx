'use client'

import { Button } from '@/components/ui/button'
import { trpc } from '@/app/_trpc/client'
import { useSession } from 'next-auth/react'
import { ThumbsUp, ThumbsDown } from 'lucide-react'
import { toast } from 'sonner'

interface CharacterCommentLikeButtonProps {
  characterCommentId: string
  likes: number
  dislikes: number
  userLike: 'like' | 'dislike' | null
}

const CharacterCommentLikeButton = ({ 
  characterCommentId, 
  likes, 
  dislikes, 
  userLike 
}: CharacterCommentLikeButtonProps) => {
  const { data: session } = useSession()
  const utils = trpc.useUtils()

  const likeComment = trpc.characterComment.likeCharacterComment.useMutation({
    onSuccess: () => {
      utils.characterComment.getCharacterComments.invalidate()
      utils.characterComment.getAllCharacterComments.invalidate()
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const handleLike = async (type: 'like' | 'dislike') => {
    if (!session?.user?.id) {
      toast.error('Войдите в систему, чтобы ставить лайки')
      return
    }

    await likeComment.mutateAsync({
      characterCommentId,
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
        className={`flex items-center space-x-1 ${
          userLike === 'like' 
            ? 'text-green-600 hover:text-green-700' 
            : 'text-gray-500 hover:text-green-600'
        }`}
      >
        <ThumbsUp className="w-4 h-4" />
        <span className="text-xs">{likes}</span>
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleLike('dislike')}
        className={`flex items-center space-x-1 ${
          userLike === 'dislike' 
            ? 'text-red-600 hover:text-red-700' 
            : 'text-gray-500 hover:text-red-600'
        }`}
      >
        <ThumbsDown className="w-4 h-4" />
        <span className="text-xs">{dislikes}</span>
      </Button>
    </div>
  )
}

export default CharacterCommentLikeButton
