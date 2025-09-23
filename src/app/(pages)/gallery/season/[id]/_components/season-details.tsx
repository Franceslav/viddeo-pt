import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Play, Image as ImageIcon, Calendar, Eye, Heart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { trpc } from '@/app/server/routers/_app'
import { formatDateShort } from '@/lib/utils'
import SeasonDescription from './season-description'

interface SeasonDetailsProps {
  seasonId: string
}

export const SeasonDetails = async ({ seasonId }: SeasonDetailsProps) => {
  const season = await trpc.season.getSeason({ id: seasonId })

  if (!season) {
    return <div className="text-white">Сезон не найден</div>
  }

  return (
    <div className="space-y-8">
      {/* Заголовок сезона */}
      <div className="space-y-4">
        <div className="flex items-start gap-6">
                  {season.image ? (
                    <div className="relative w-48 h-32 rounded-lg overflow-hidden flex-shrink-0 border-2 border-yellow-400">
                      <Image
                        src={season.image}
                        alt={season.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-48 h-32 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0 border-2 border-yellow-400">
                      <ImageIcon className="w-12 h-12 text-gray-300" />
                    </div>
                  )}
                  
                  <div className="flex-1 space-y-2">
                    <h1 className="text-3xl font-bold text-white">{season.title}</h1>
                    <p className="text-white">
                      Сезон {season.seasonNumber} • {season.episodes.length} эпизодов
                    </p>
                    {season.description && (
                      <SeasonDescription description={season.description} />
                    )}
                    <div className="flex items-center gap-4 text-sm text-white">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Создан {formatDateShort(season.createdAt)}
                      </div>
                    </div>
                  </div>
        </div>
      </div>

      {/* Эпизоды */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Эпизоды</h2>
        
        {season.episodes.length === 0 ? (
          <Card className="bg-gray-800 border-2 border-yellow-400">
            <CardContent className="p-8 text-center">
              <p className="text-white">В этом сезоне пока нет эпизодов</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {season.episodes.map((episode) => (
              <Card key={episode.id} className="overflow-hidden hover:shadow-lg transition-shadow bg-gray-800 border-2 border-yellow-400 cursor-pointer group">
                <Link href={`/gallery/episode/${episode.id}`} className="block">
                  <div className="flex h-32">
                    {episode.image ? (
                      <div className="relative w-48 h-full overflow-hidden flex-shrink-0 border-2 border-yellow-400">
                        <Image
                          src={episode.image}
                          alt={episode.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-48 h-full bg-gray-700 flex items-center justify-center flex-shrink-0 border-2 border-yellow-400">
                        <ImageIcon className="w-12 h-12 text-gray-300" />
                      </div>
                    )}
                    
                    <div className="flex-1 p-4 flex flex-col justify-between">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1 mr-4">
                          <CardTitle className="text-lg text-white group-hover:text-yellow-300 transition-colors">
                            {episode.title}
                          </CardTitle>
                          <CardDescription className="text-white">
                            Эпизод {episode.episodeNumber}
                          </CardDescription>
                          <p className="text-sm text-white line-clamp-2">
                            {episode.description}
                          </p>
                        </div>
                        
                        {/* Кнопка видна только на десктопе */}
                        <Button className="bg-yellow-400 text-black hover:bg-yellow-300 border-2 border-black font-bold hidden md:flex items-center">
                          <Play className="w-4 h-4 mr-2" />
                          Смотреть
                        </Button>
                      </div>
                      
                      <div className="flex items-center gap-4 mt-3 text-sm text-white">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {episode.views} просмотров
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          {episode.likes.length} лайков
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDateShort(episode.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export const SeasonDetailsLoading = () => {
  return (
    <div className="space-y-8">
      {/* Заголовок сезона */}
      <div className="space-y-4">
        <div className="flex items-start gap-6">
          <Skeleton className="w-48 h-32 rounded-lg bg-gray-800 border-2 border-yellow-400" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
              <Skeleton className="w-64 h-8 bg-gray-800" />
              <Skeleton className="w-20 h-6 bg-gray-800" />
            </div>
            <Skeleton className="w-48 h-4 bg-gray-800" />
            <Skeleton className="w-full h-4 bg-gray-800" />
            <Skeleton className="w-3/4 h-4 bg-gray-800" />
            <Skeleton className="w-32 h-4 bg-gray-800" />
          </div>
        </div>
      </div>

      {/* Эпизоды */}
      <div className="space-y-4">
        <Skeleton className="w-32 h-8 bg-gray-800" />
        
                <div className="grid gap-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <Card key={index} className="bg-gray-800 border-2 border-yellow-400">
                      <div className="flex h-32">
                        <Skeleton className="w-48 h-full bg-gray-700 border-2 border-yellow-400" />
                        <div className="flex-1 p-4 flex flex-col justify-between">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <Skeleton className="w-48 h-6 bg-gray-700" />
                              <Skeleton className="w-24 h-4 bg-gray-700" />
                              <Skeleton className="w-full h-4 bg-gray-700" />
                              <Skeleton className="w-3/4 h-4 bg-gray-700" />
                            </div>
                            <Skeleton className="w-24 h-8 bg-yellow-400" />
                          </div>
                          <div className="flex items-center gap-4 mt-3">
                            <Skeleton className="w-20 h-4 bg-gray-700" />
                            <Skeleton className="w-16 h-4 bg-gray-700" />
                            <Skeleton className="w-24 h-4 bg-gray-700" />
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
      </div>
    </div>
  )
}
