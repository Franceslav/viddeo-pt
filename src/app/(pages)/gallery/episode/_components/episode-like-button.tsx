'use client'

import { ThumbsUp, ThumbsDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { trpc } from '@/app/_trpc/client'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

interface EpisodeLikeButtonProps {
  episodeId: string
  likes: number
  dislikes: number
  userLike?: 'like' | 'dislike' | null
}

const EpisodeLikeButton = ({ episodeId, likes, dislikes, userLike }: EpisodeLikeButtonProps) => {
  const { data: session } = useSession()
  const utils = trpc.useUtils()

  const likeEpisode = trpc.likes.likeEpisode.useMutation({
    onSuccess: () => {
      utils.likes.getLikes.invalidate({ id: episodeId })
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

    likeEpisode.mutate({
      episodeId,
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
        disabled={likeEpisode.isPending}
        className={`flex items-center space-x-1 ${
          userLike === 'like' 
            ? 'text-green-400 bg-green-900 border border-green-400' 
            : 'text-white hover:text-green-400 hover:bg-gray-800'
        }`}
      >
        <ThumbsUp className="w-4 h-4" />
        <span>{likes}</span>
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleLike('dislike')}
        disabled={likeEpisode.isPending}
        className={`flex items-center space-x-1 ${
          userLike === 'dislike' 
            ? 'text-red-400 bg-red-900 border border-red-400' 
            : 'text-white hover:text-red-400 hover:bg-gray-800'
        }`}
      >
        <ThumbsDown className="w-4 h-4" />
        <span>{dislikes}</span>
      </Button>
    </div>
  )
}

export default EpisodeLikeButton
