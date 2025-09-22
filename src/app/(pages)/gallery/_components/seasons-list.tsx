import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Play, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { trpc } from '@/app/server/routers/_app'

export const SeasonsList = async () => {
  const seasons = await trpc.season.getSeasons()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {seasons.map((season) => {
        return (
          <Card key={season.id} className="w-full overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative aspect-[4/3] bg-gray-100">
              {season.image ? (
                <Image
                  src={season.image}
                  alt={season.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-gray-400" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-100 md:opacity-0 md:hover:opacity-100 transition-opacity pointer-events-none md:pointer-events-auto">
                <Button size="sm" asChild className="pointer-events-auto">
                  <Link href={`/gallery/season/${season.id}`}>
                    <Play className="w-4 h-4 mr-2" />
                    Смотреть
                  </Link>
                </Button>
              </div>
            </div>
            
            <CardHeader className="p-3">
              <CardTitle className="text-lg line-clamp-1">
                {season.title}
              </CardTitle>
              <CardDescription>
                Сезон {season.seasonNumber} • {season.episodes.length} эпизодов
              </CardDescription>
            </CardHeader>
          </Card>
        )
      })}
    </div>
  )
}

export const SeasonsListLoading = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <Card key={index} className="w-full">
          <CardContent className="p-0">
            <Skeleton className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden" />
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="w-32 h-4" />
                <Skeleton className="w-16 h-4" />
              </div>
              <Skeleton className="w-24 h-4" />
              <Skeleton className="w-full h-3" />
              <Skeleton className="w-3/4 h-3" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
