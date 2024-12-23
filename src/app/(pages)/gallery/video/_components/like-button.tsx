'use client'

import { ThumbsUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import React from 'react'
import { trpc } from '@/app/_trpc/client'
import { useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const LikeButton = ({ videoId }: { videoId: string }) => {

  const utils = trpc.useUtils()

  const [, { data }] = trpc.likes.getLikes.useSuspenseQuery({ id: videoId })

  const { mutate: likeVideo, isPending } = trpc.likes.likeVideo.useMutation({
    onSuccess: () => {
      utils.likes.getLikes.invalidate({ id: videoId })
    }
  })

  const session = useSession();

  const router = useRouter()

  const hasLiked = data.some(like => like.userId === session.data?.user?.id)


  const handleLike = () => {
    if (session.data?.user?.id) {
      likeVideo({ videoId, userId: session.data.user.id })
    } else {
      toast.error('You must be logged in to like a video')
      router.push('/auth')
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <Button disabled={isPending} variant="outline" size="sm" onClick={handleLike} className={hasLiked ? "bg-primary text-white" : ""}>
        <ThumbsUp className="mr-2 h-4 w-4" /> {data.length}
      </Button>
    </div>
  )
}

export default LikeButton