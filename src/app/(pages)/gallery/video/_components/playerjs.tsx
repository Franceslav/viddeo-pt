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

  // Проверяем, является ли URL Google Drive видео
  const isGoogleDriveUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url)
      return urlObj.hostname === 'drive.google.com' && 
             (urlObj.pathname.includes('/file/d/') || 
              urlObj.searchParams.has('id'))
    } catch {
      return false
    }
  }

  // Преобразуем Google Drive URL в прямую ссылку
  const convertGoogleDriveUrl = (url: string): string => {
    try {
      const urlObj = new URL(url)
      if (urlObj.hostname === 'drive.google.com') {
        // Извлекаем ID файла
        let fileId = ''
        
        // Для ссылок вида /file/d/ID/view
        const match = urlObj.pathname.match(/\/file\/d\/([^\/]+)/)
        if (match) {
          fileId = match[1]
        }
        
        // Для ссылок с параметром id
        if (!fileId && urlObj.searchParams.has('id')) {
          fileId = urlObj.searchParams.get('id') || ''
        }
        
        if (fileId) {
          // Возвращаем прямую ссылку для скачивания
          return `https://drive.google.com/uc?export=download&id=${fileId}`
        }
      }
      return url
    } catch {
      return url
    }
  }

  // Определяем режим плеера на основе URL
  const getInitialMode = (url: string): 'rutube' | 'html5' => {
    if (isRutubeUrl(url)) return 'rutube'
    if (isGoogleDriveUrl(url)) return 'html5'
    return 'html5'
  }

  const initialMode = getInitialMode(src)
  const [mode, setMode] = useState<'rutube' | 'html5'>(initialMode)

  // Обработка смены плеера
  const handlePlayerChange = (newSrc: string) => {
    setCurrentSource(newSrc)
    setMode(getInitialMode(newSrc))
  }

  // Получаем URL для воспроизведения
  const getPlaybackUrl = (url: string): string => {
    if (isGoogleDriveUrl(url)) {
      return convertGoogleDriveUrl(url)
    }
    return url
  }

  // Создаем список всех источников (включая основной src) + фолбэки
  const allSources = useMemo(() => ([
    {
      url: src,
      label: isRutubeUrl(src) ? 'RUTUBE' : 
             isGoogleDriveUrl(src) ? 'Google Drive' : 'Прямая ссылка',
      type: isRutubeUrl(src) ? 'rutube' as const : 'mp4' as const
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
            src={getPlaybackUrl(currentSource)}
            data-vast-url={vastUrl}
          >
            <source src={getPlaybackUrl(currentSource)} />
            Ваш браузер не поддерживает воспроизведение видео.
          </video>
        </div>
      )}
    </div>
  )
}