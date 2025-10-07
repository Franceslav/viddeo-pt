'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

interface RutubePlayerProps {
  videoUrl: string
  width?: number | string
  height?: number | string
  autoplay?: boolean
  startTime?: number // в секундах
  endTime?: number // в секундах
  skinColor?: string // hex цвет без #
  showTitle?: boolean
  className?: string
  onError?: (message: string) => void
}

interface RutubeEmbedData {
  embedUrl: string
  title: string
  author: string
  duration?: number
}

export default function RutubePlayer({
  videoUrl,
  width = 720,
  height = 405,
  autoplay = false,
  startTime,
  endTime,
  skinColor,
  showTitle = true,
  className = '',
  onError
}: RutubePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [embedData, setEmbedData] = useState<RutubeEmbedData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const handleError = useCallback((errorMessage: string) => {
    onError?.(errorMessage)
  }, [onError])

  // Извлекаем ID видео из URL
  const extractVideoId = (url: string): string | null => {
    try {
      const urlObj = new URL(url)
      
      // Для embed URL: https://rutube.ru/play/embed/abc123 (приоритет)
      if (urlObj.hostname === 'rutube.ru' && urlObj.pathname.startsWith('/play/embed/')) {
        const match = urlObj.pathname.match(/\/play\/embed\/([^\/\?]+)/)
        return match ? match[1] : null
      }
      
      // Для обычных видео: https://rutube.ru/video/abc123/
      if (urlObj.hostname === 'rutube.ru' && urlObj.pathname.startsWith('/video/')) {
        const match = urlObj.pathname.match(/\/video\/([^\/]+)/)
        return match ? match[1] : null
      }
      
      // Для shorts: https://rutube.ru/shorts/abc123/ -> https://rutube.ru/video/abc123/
      if (urlObj.hostname === 'rutube.ru' && urlObj.pathname.startsWith('/shorts/')) {
        const match = urlObj.pathname.match(/\/shorts\/([^\/]+)/)
        return match ? match[1] : null
      }
      
      return null
    } catch {
      return null
    }
  }

  // Проверяем, является ли URL уже embed ссылкой
  const isEmbedUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url)
      return urlObj.hostname === 'rutube.ru' && urlObj.pathname.startsWith('/play/embed/')
    } catch {
      return false
    }
  }

  // Строим embed URL с параметрами
  const buildEmbedUrl = useCallback((videoId: string, existingUrl?: string): string => {
    // Если URL уже является embed ссылкой, используем его как основу
    if (existingUrl && isEmbedUrl(existingUrl)) {
      const baseUrl = existingUrl.split('?')[0] // Убираем существующие параметры
      const params = new URLSearchParams()
      
      if (autoplay) {
        params.append('autoplay', '1')
      }
      
      if (startTime && startTime > 0) {
        params.append('t', startTime.toString())
      }
      
      if (endTime && endTime > 0) {
        params.append('stopTime', endTime.toString())
      }
      
      if (skinColor) {
        params.append('skinColor', skinColor.replace('#', ''))
      }
      
      // Параметры для скрытия плашки RUTUBE
      params.append('showTitle', '0')
      
      const queryString = params.toString()
      return queryString ? `${baseUrl}?${queryString}` : baseUrl
    } else {
      // Создаем новый embed URL
      const baseUrl = `https://rutube.ru/play/embed/${videoId}`
      const params = new URLSearchParams()
      
      if (autoplay) {
        params.append('autoplay', '1')
      }
      
      if (startTime && startTime > 0) {
        params.append('t', startTime.toString())
      }
      
      if (endTime && endTime > 0) {
        params.append('stopTime', endTime.toString())
      }
      
      if (skinColor) {
        params.append('skinColor', skinColor.replace('#', ''))
      }
      
      // Параметры для скрытия плашки RUTUBE
      params.append('showTitle', '0')
      
      const queryString = params.toString()
      return queryString ? `${baseUrl}?${queryString}` : baseUrl
    }
  }, [autoplay, startTime, endTime, skinColor])

  // Получаем метаданные видео через API
  const fetchVideoMetadata = async (videoId: string) => {
    try {
      // Пытаемся получить метаданные через наш API
      const response = await fetch(`/api/rutube/metadata?videoId=${videoId}`)
      if (response.ok) {
        const data = await response.json()
        return data
      }
    } catch (error) {
      console.warn('Failed to fetch video metadata:', error)
    }
    
    // Fallback - возвращаем базовые данные
    return {
      title: 'Видео',
      author: 'Неизвестно',
      duration: null
    }
  }

  useEffect(() => {
    const initializePlayer = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        const videoId = extractVideoId(videoUrl)
        
        if (!videoId) {
          throw new Error('Не удалось извлечь ID видео из URL')
        }
        
            const metadata = await fetchVideoMetadata(videoId)
            const embedUrl = buildEmbedUrl(videoId, videoUrl)
        
        setEmbedData({
          embedUrl,
          title: metadata.title,
          author: metadata.author,
          duration: metadata.duration
        })
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки видео')
        try {
          handleError(err instanceof Error ? err.message : 'Ошибка загрузки видео')
        } catch {}
      } finally {
        setIsLoading(false)
      }
    }

    if (videoUrl) {
      initializePlayer()
    }
  }, [videoUrl, autoplay, startTime, endTime, skinColor, buildEmbedUrl, handleError])

  if (isLoading) {
    return (
      <div 
        ref={containerRef}
        className={`flex items-center justify-center bg-gray-900 ${className}`}
        style={{ width, height }}
      >
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
          <p>Загрузка видео...</p>
        </div>
      </div>
    )
  }

  if (error || !embedData) {
    return (
      <div 
        ref={containerRef}
        className={`flex items-center justify-center bg-gray-900 ${className}`}
        style={{ width, height }}
      >
        <div className="text-white text-center p-4">
          <p className="text-red-400 mb-2">Ошибка загрузки видео</p>
          <p className="text-sm text-gray-300 mb-4">{error || 'Неизвестная ошибка'}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Перезагрузить
          </button>
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className={`${className}`}>
        <iframe
          width={width}
          height={height}
          src={embedData.embedUrl}
          frameBorder="0"
          allow="clipboard-write; autoplay; fullscreen"
          allowFullScreen
          className="rounded-lg"
          title={embedData.title}
          style={{
            border: 'none',
            outline: 'none'
          }}
        />
      
      {showTitle && embedData.title && (
        <div className="mt-2 text-sm text-gray-600">
          <p className="font-medium">{embedData.title}</p>
          {embedData.author && (
            <p className="text-gray-500">от {embedData.author}</p>
          )}
        </div>
      )}
    </div>
  )
}
