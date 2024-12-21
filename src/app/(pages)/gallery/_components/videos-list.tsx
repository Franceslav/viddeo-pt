import { caller } from '@/app/server/routers/_app'
import { prisma } from '@/config/prisma'

const VideosList = async () => {
  const videos = await caller({ db: prisma }).video.getVideos()

  // console.log(videos)

  return (
    <div>VideosList</div>
  )
}

export default VideosList