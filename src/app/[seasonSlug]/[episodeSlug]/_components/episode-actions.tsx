'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Heart, ThumbsDown } from "lucide-react"
import { toast } from "sonner"
import { trpc } from '@/app/_trpc/client'
import { useSession } from 'next-auth/react'

interface EpisodeActionsProps {
  episodeId: string
  initialLikes: number
  userLiked?: boolean
  userDisliked?: boolean
}

export default function EpisodeActions({ 
  episodeId, 
  initialLikes, 
  userLiked = false, 
  userDisliked = false 
}: EpisodeActionsProps) {
  const { data: session } = useSession()
  const [isLiked, setIsLiked] = useState(userLiked)
  const [isDisliked, setIsDisliked] = useState(userDisliked)
  const [likesCount, setLikesCount] = useState(initialLikes)

  const likeEpisodeMutation = trpc.likes.likeEpisode.useMutation({
    onSuccess: (data) => {
      setIsLiked(data.type === 'like')
      setIsDisliked(data.type === 'dislike')
      setLikesCount(data.likesCount)
    },
    onError: (error) => {
      console.error('Like error:', error)
      toast.error(error.message || 'Ошибка при оценке эпизода')
    }
  })

  const handleLike = () => {
    if (!session?.user?.id) {
      toast.error('Войдите, чтобы оценить эпизод')
      return
    }

    likeEpisodeMutation.mutate({
      episodeId,
      userId: session.user.id,
      type: 'like'
    })
  }

  const handleDislike = () => {
    if (!session?.user?.id) {
      toast.error('Войдите, чтобы оценить эпизод')
      return
    }

    likeEpisodeMutation.mutate({
      episodeId,
      userId: session.user.id,
      type: 'dislike'
    })
  }


  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleLike}
        disabled={likeEpisodeMutation.isPending}
        className={`flex items-center gap-2 rounded-full px-4 ${
          isLiked 
            ? 'bg-red-600 hover:bg-red-700 border-red-600 text-white' 
            : 'bg-gray-800 hover:bg-gray-700 border-gray-600 text-white hover:text-white'
        }`}
      >
        <Heart className={`w-4 h-4 ${isLiked ? 'text-white' : 'text-red-500'}`} />
        {likesCount}
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleDislike}
        disabled={likeEpisodeMutation.isPending}
        className={`flex items-center gap-2 rounded-full px-4 ${
          isDisliked 
            ? 'bg-gray-600 hover:bg-gray-700 border-gray-600 text-white' 
            : 'bg-gray-800 hover:bg-gray-700 border-gray-600 text-white hover:text-white'
        }`}
      >
        <ThumbsDown className={`w-4 h-4 ${isDisliked ? 'text-white' : 'text-gray-400'}`} />
        Дизлайк
      </Button>
      
    </div>
  )
}
