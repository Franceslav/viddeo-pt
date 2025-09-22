import { Skeleton } from '@/components/ui/skeleton'

const EpisodeContainerLoading = () => {
  return (
    <>
      <div className="mb-4">
        <Skeleton className="w-32 h-8" />
      </div>

      <Skeleton className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden mb-4" />
      
      <div className="">
        <div className="flex items-center gap-2 mb-2">
          <Skeleton className="w-20 h-6" />
          <Skeleton className="w-24 h-6" />
        </div>
        
        <Skeleton className="w-3/4 h-8 mb-4" />
        
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-4">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div>
              <Skeleton className="w-24 h-4 mb-1" />
              <Skeleton className="w-32 h-3" />
            </div>
          </div>
          <Skeleton className="w-20 h-8" />
        </div>
        
        <div className="flex items-center gap-4 mt-4">
          <Skeleton className="w-24 h-4" />
          <Skeleton className="w-20 h-4" />
          <Skeleton className="w-28 h-4" />
        </div>
      </div>
      
      <div className="bg-gray-100 p-4 rounded-lg">
        <Skeleton className="w-full h-4 mb-2" />
        <Skeleton className="w-3/4 h-4 mb-2" />
        <Skeleton className="w-1/2 h-4" />
      </div>
    </>
  )
}

export default EpisodeContainerLoading
