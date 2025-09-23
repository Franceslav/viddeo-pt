'use client'

import { useMemo, useState } from 'react'
import RutubePlayer from './rutube-player'

interface PlayerJSProps {
  src: string
  poster?: string | null
  title?: string
  sources?: Array<{
    url: string
    label: string
    type?: 'rutube'
  }>
  fallbackSources?: Array<{
    url: string
    label: string
    type?: 'mp4' | 'hls'
  }>
  vastUrl?: string
  showPlayerSelector?: boolean
  showLightToggle?: boolean
  showFullscreen?: boolean
}

export default function PlayerJS({ 
  src, 
  poster,
  sources = [], 
  fallbackSources = [],
  vastUrl,
  showPlayerSelector = false
}: PlayerJSProps) {
  const [currentSource, setCurrentSource] = useState(src)
  const [mode, setMode] = useState<'rutube' | 'html5'>('rutube')

  // Проверяем, является ли URL RUTUBE видео
  const isRutubeUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url)
      return urlObj.hostname === 'rutube.ru' && 
             (urlObj.pathname.startsWith('/video/') || 
              urlObj.pathname.startsWith('/shorts/') ||
              urlObj.pathname.startsWith('/play/embed/'))
    } catch {
      return false
    }
  }

  // Обработка смены плеера
  const handlePlayerChange = (newSrc: string) => {
    setCurrentSource(newSrc)
  }

  // Создаем список всех источников (включая основной src) + фолбэки
  const allSources = useMemo(() => ([
    {
      url: src,
      label: 'RUTUBE',
      type: 'rutube' as const
    },
    ...sources.filter(source => source.url !== src),
    ...fallbackSources
  ]), [src, sources, fallbackSources])

  // Если это не RUTUBE URL, показываем сообщение
  const handleError = () => {
    if (fallbackSources.length > 0) {
      setMode('html5')
      setCurrentSource(fallbackSources[0].url)
    }
  }

  return (
    <div className="space-y-4">
      {/* Player Selector */}
      {showPlayerSelector && allSources.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {allSources.map((source, index) => (
            <button
              key={index}
              onClick={() => {
                handlePlayerChange(source.url)
                setMode(source.type === 'rutube' ? 'rutube' : 'html5')
              }}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                currentSource === source.url
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {source.label}
              <span className="ml-1 text-xs opacity-75">({source.type ?? 'mp4'})</span>
            </button>
          ))}
        </div>
      )}
      
      {/* Player */}
      {mode === 'rutube' ? (
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
          <RutubePlayer
            videoUrl={currentSource}
            width="100%"
            height="100%"
            className="w-full h-full"
            onError={handleError}
          />
        </div>
      ) : (
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
          <video
            className="w-full h-full"
            controls
            playsInline
            poster={poster ?? undefined}
            src={currentSource}
            data-vast-url={vastUrl}
          >
            <source src={currentSource} />
            Ваш браузер не поддерживает воспроизведение видео.
          </video>
        </div>
      )}
    </div>
  )
}