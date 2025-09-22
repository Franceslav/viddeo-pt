'use client'

import { ThumbsUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import React from 'react'
import { trpc } from '@/app/_trpc/client'
import { useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const LikeButton = ({ videoId, episodeId, type = 'video' }: { videoId?: string, episodeId?: string, type?: 'video' | 'episode' }) => {
  const id = type === 'episode' ? episodeId : videoId
  const session = useSession();
  const router = useRouter()
  
  if (!id) return null

  const utils = trpc.useUtils()

  const [, { data }] = trpc.likes.getLikes.useSuspenseQuery({ id })

  const { mutate: likeVideo, isPending: isPendingVideo } = trpc.likes.likeVideo.useMutation({
    onSuccess: () => {
      utils.likes.getLikes.invalidate({ id })
    }
  })

  const { mutate: likeEpisode, isPending: isPendingEpisode } = trpc.likes.likeEpisode.useMutation({
    onSuccess: () => {
      utils.likes.getLikes.invalidate({ id })
    }
  })

  const hasLiked = data?.allLikes?.some(like => like.userId === session.data?.user?.id) || false
  const isPending = isPendingVideo || isPendingEpisode

  const handleLike = () => {
    if (session.data?.user?.id) {
      if (type === 'episode' && episodeId) {
        likeEpisode({ episodeId, userId: session.data.user.id, type: 'like' })
      } else if (type === 'video' && videoId) {
        likeVideo({ videoId, userId: session.data.user.id, type: 'like' })
      }
    } else {
      toast.error('You must be logged in to like a video')
      router.push('/auth')
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <Button disabled={isPending} variant="outline" size="sm" onClick={handleLike} className={hasLiked ? "bg-primary text-white" : ""}>
        <ThumbsUp className="mr-2 h-4 w-4" /> {data?.likes || 0}
      </Button>
    </div>
  )
}

export default LikeButton