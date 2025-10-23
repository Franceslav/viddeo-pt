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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 px-2 sm:px-0">
      {seasons.map((season) => {
        return (
                <Card key={season.id} className="w-full overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                  <Link href={`/gallery/season/${season.id}`} className="block">
              <div className="relative aspect-video bg-gray-100">
                {season.image ? (
                  <Image
                    src={season.image}
                    alt={season.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" />
                  </div>
                )}
                {/* Кнопка видна только на десктопе */}
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 md:group-hover:opacity-100 transition-opacity">
                  <Button 
                    size="sm" 
                    className="pointer-events-auto bg-yellow-400 text-black hover:bg-yellow-300 border-2 border-black font-bold"
                    data-analytics="watch_season_button"
                    data-season={season.seasonNumber}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Смотреть
                  </Button>
                </div>
                {/* Мобильная кнопка - всегда видна */}
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center md:hidden">
                  <Button 
                    size="sm" 
                    className="pointer-events-auto bg-yellow-400 text-black hover:bg-yellow-300 border-2 border-black font-bold"
                    data-analytics="watch_season_mobile_button"
                    data-season={season.seasonNumber}
                  >
                    <Play className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="text-xs sm:text-sm">Смотреть</span>
                  </Button>
                </div>
              </div>
            </Link>
            
                  <Link href={`/gallery/season/${season.id}`} className="block">
              <CardHeader className="p-3 sm:p-4">
                <CardTitle className="text-base sm:text-lg line-clamp-2 sm:line-clamp-1 group-hover:text-yellow-600 transition-colors">
                  {season.title} 
                </CardTitle>
                <CardDescription className="text-sm">
                {season.episodes.length} эпизодов
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>
        )
      })}
    </div>
  )
}

export const SeasonsListLoading = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 px-2 sm:px-0">
      {Array.from({ length: 8 }).map((_, index) => (
        <Card key={index} className="w-full">
          <CardContent className="p-0">
            <Skeleton className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden" />
            <div className="p-3 sm:p-4 space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="w-24 sm:w-32 h-3 sm:h-4" />
                <Skeleton className="w-12 sm:w-16 h-3 sm:h-4" />
              </div>
              <Skeleton className="w-20 sm:w-24 h-3 sm:h-4" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
