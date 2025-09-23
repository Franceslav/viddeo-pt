'use client'

import { useState } from 'react'
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
  showPlayerSelector?: boolean
  showLightToggle?: boolean
  showFullscreen?: boolean
}

export default function PlayerJS({ 
  src, 
  poster, 
  title,
  sources = [], 
  showPlayerSelector = false,
  showLightToggle = true,
  showFullscreen = true
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

  // Обработка смены плеера
  const handlePlayerChange = (newSrc: string) => {
    setCurrentSource(newSrc)
  }

  // Создаем список всех источников (включая основной src)
  const allSources = [
    {
      url: src, 
      label: 'Основной плеер', 
      type: 'rutube' as const 
    },
    ...sources.filter(source => source.url !== src)
  ]

  // Если это не RUTUBE URL, показываем сообщение
  if (!isRutubeUrl(currentSource)) {
    return (
      <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center">
        <div className="text-center text-white p-8">
          <div className="text-6xl mb-4">🎬</div>
          <h3 className="text-xl font-semibold mb-2">Поддерживаются только RUTUBE видео</h3>
          <p className="text-gray-300 mb-4">
            URL должен быть с домена rutube.ru
          </p>
          <div className="text-sm text-gray-400">
            <p>Поддерживаемые форматы:</p>
            <ul className="mt-2 space-y-1">
              <li>• https://rutube.ru/video/...</li>
              <li>• https://rutube.ru/shorts/...</li>
              <li>• https://rutube.ru/play/embed/...</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Player Selector */}
      {showPlayerSelector && allSources.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {allSources.map((source, index) => (
            <button
              key={index}
              onClick={() => handlePlayerChange(source.url)}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                currentSource === source.url
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {source.label}
              <span className="ml-1 text-xs opacity-75">
                (RUTUBE)
              </span>
            </button>
          ))}
        </div>
      )}
      
      {/* RUTUBE Player */}
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
        <RutubePlayer
          videoUrl={currentSource}
          width="100%"
          height="100%"
          className="w-full h-full"
        />
      </div>
    </div>
  )
}