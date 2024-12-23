import { Skeleton } from "@/components/ui/skeleton"

const VideoContainerLoading = () => {
  return (
    <div className='flex flex-col gap-2'>
      <Skeleton className='aspect-video w-full h-full rounded-lg' />
      <Skeleton className='w-1/2 h-8 rounded-lg mb-2' />
      <Skeleton className='w-full h-40 rounded-lg' />
    </div>
  )
}

export default VideoContainerLoading