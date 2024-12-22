import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const Loading = () => {
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

export default Loading