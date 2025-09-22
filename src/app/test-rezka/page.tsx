'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import PlayerJS from '@/app/(pages)/gallery/video/_components/playerjs'

export default function TestRezkaPage() {
  const [searchQuery, setSearchQuery] = useState('южный парк')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [episodes, setEpisodes] = useState<any[]>([])
  const [selectedSeries, setSelectedSeries] = useState<any>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [isLoadingEpisodes, setIsLoadingEpisodes] = useState(false)

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    
    setIsSearching(true)
    try {
      const response = await fetch(`/api/search/rezka?q=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()
      
      if (data.success) {
        setSearchResults(data.results)
      } else {
        console.error('Search failed:', data.error)
      }
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleGetEpisodes = async (seriesUrl: string) => {
    setIsLoadingEpisodes(true)
    try {
      const response = await fetch('/api/rezka/episodes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: seriesUrl })
      })
      const data = await response.json()
      
      if (data.success) {
        setEpisodes(data.episodes)
        setSelectedSeries(data.series)
      } else {
        console.error('Episodes failed:', data.error)
      }
    } catch (error) {
      console.error('Episodes error:', error)
    } finally {
      setIsLoadingEpisodes(false)
    }
  }

  const handleGetVideo = async (episodeUrl: string) => {
    try {
      const response = await fetch(`/api/rezka/video?url=${encodeURIComponent(episodeUrl)}`)
      const data = await response.json()
      
      if (data.success) {
        console.log('Video data:', data)
        // Здесь можно показать видео в плеере
      } else {
        console.error('Video failed:', data.error)
      }
    } catch (error) {
      console.error('Video error:', error)
    }
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Тест HDRezka API</h1>
      
      {/* Поиск */}
      <div className="mb-8">
        <div className="flex gap-4 mb-4">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск сериала..."
            className="flex-1"
          />
          <Button onClick={handleSearch} disabled={isSearching}>
            {isSearching ? 'Поиск...' : 'Найти'}
          </Button>
        </div>
      </div>

      {/* Результаты поиска */}
      {searchResults.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Результаты поиска</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {searchResults.map((result, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{result.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {result.year} • {result.type}
                      </CardDescription>
                    </div>
                    {result.poster && (
                      <img 
                        src={result.poster} 
                        alt={result.title}
                        className="w-16 h-20 object-cover rounded"
                      />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                    {result.description}
                  </p>
                  <Button 
                    onClick={() => handleGetEpisodes(result.link)}
                    className="w-full"
                    disabled={isLoadingEpisodes}
                  >
                    {isLoadingEpisodes ? 'Загрузка...' : 'Получить эпизоды'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Информация о сериале */}
      {selectedSeries && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Информация о сериале</h2>
          <Card>
            <CardHeader>
              <div className="flex items-start gap-4">
                {selectedSeries.poster && (
                  <img 
                    src={selectedSeries.poster} 
                    alt={selectedSeries.title}
                    className="w-32 h-48 object-cover rounded"
                  />
                )}
                <div>
                  <CardTitle className="text-2xl">{selectedSeries.title}</CardTitle>
                  <CardDescription className="mt-2">
                    {selectedSeries.year}
                  </CardDescription>
                  <p className="mt-4 text-sm">{selectedSeries.description}</p>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
      )}

      {/* Эпизоды */}
      {episodes.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Эпизоды</h2>
          <div className="grid gap-2">
            {episodes.map((episode, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {episode.title}
                      </CardTitle>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline">
                          Сезон {episode.seasonNumber}
                        </Badge>
                        <Badge variant="secondary">
                          Эпизод {episode.episodeNumber}
                        </Badge>
                      </div>
                    </div>
                    <Button 
                      onClick={() => handleGetVideo(episode.url)}
                      size="sm"
                    >
                      Смотреть
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Тестовый плеер */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Тестовый плеер</h2>
        <PlayerJS 
          src="https://www.w3schools.com/html/mov_bbb.mp4"
          title="Тестовое видео"
          showPlayerSelector={true}
          sources={[
            {
              url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
              label: "Плеер 2",
              type: "mp4"
            }
          ]}
        />
      </div>
    </div>
  )
}
