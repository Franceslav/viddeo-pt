import { caller } from '@/app/server/routers/_app'
import { prisma } from '@/config/prisma'
import { VideoCard } from './video-card'
import { formatDateShort } from '@/lib/utils'

const VideosList = async () => {
  const videos = await caller({ db: prisma }).video.getVideos()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {videos.map((video) => {
        return (
          <VideoCard key={video.id} id={video.id} title={video.title} views={video.views} uploadedAt={formatDateShort(video.createdAt)} />
        )
      })}
    </div>
  )
}

export default VideosList