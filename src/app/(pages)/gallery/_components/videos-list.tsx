import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

import { trpc } from '@/app/server/routers/_app'
import { VideoCard } from './video-card'
import { formatDateShort } from '@/lib/utils'

export const VideosList = async () => {
  const videos = await trpc.video.getVideos()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {videos.map((video) => {
        return (
          <VideoCard 
            key={video.id} 
            id={video.id} 
            title={video.title} 
            views={video.views} 
            uploadedAt={formatDateShort(video.createdAt)}
            type={video.type}
            image={video.image}
          />
        )
      })}
    </div>
  )
}
// TODO: Create separate component for loading state if needed
export const VideosListLoading = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 12 }).map((_, index) => (
        <Card key={index} className="w-full">
          <CardContent className="p-0">
            <Skeleton className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden" />
            <div className="p-4 space-y-2">
              <Skeleton className="w-48 h-4" />
              <Skeleton className="w-24 h-4" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
