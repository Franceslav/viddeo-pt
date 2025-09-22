'use client'

import { useEffect, useId, useRef, useState } from 'react'

interface PlayerJSInstance {
  destroy: () => void
  play: () => void
  pause: () => void
  seek: (time: number) => void
  setVolume: (volume: number) => void
  getDuration: () => number
}

declare global {
  interface Window {
    Playerjs?: new (config: {
      id: string
      file: string
      poster?: string
      title?: string
    }) => PlayerJSInstance
    PlayerjsAsync?: unknown
  }
}

interface VideoSource {
  url: string
  label: string
  type?: 'mp4' | 'webm' | 'hls' | 'dash'
}

interface PlayerJSProps {
  src: string
  poster?: string | null
  title?: string
  sources?: VideoSource[]
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
  const containerId = useId().replace(/:/g, '')
  const initializedRef = useRef(false)
  const playerRef = useRef<PlayerJSInstance | null>(null)
  const currentSourceRef = useRef(src)
  const [isLightOff, setIsLightOff] = useState(false)


  const showFallbackPlayer = (videoSrc: string = currentSourceRef.current) => {
    const container = document.getElementById(containerId)
    if (container) {
      if (videoSrc) {
        console.log('Showing HTML5 fallback player for:', videoSrc)
        
        // Создаем HTML5 видео плеер с контролами
        const videoElement = document.createElement('video')
        videoElement.controls = true
        videoElement.style.width = '100%'
        videoElement.style.height = '100%'
        videoElement.style.objectFit = 'contain'
        
        if (poster) {
          videoElement.poster = poster
        }
        
        if (title) {
          videoElement.title = title
        }
        
        // Добавляем источники видео
        const source = document.createElement('source')
        source.src = videoSrc
        
        // Определяем тип видео по расширению
        if (videoSrc.includes('.m3u8')) {
          source.type = 'application/x-mpegURL'
          // Для HLS добавляем специальные атрибуты
          videoElement.setAttribute('data-hls', 'true')
        } else if (videoSrc.includes('.webm')) {
          source.type = 'video/webm'
        } else if (videoSrc.includes('.ogg')) {
          source.type = 'video/ogg'
        } else {
          source.type = 'video/mp4'
        }
        
        videoElement.appendChild(source)
        
        // Для HTML страниц показываем специальное сообщение
        if (videoSrc.includes('.html') || videoSrc.includes('rezka.ag')) {
          container.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: white; text-align: center; background: #1a1a1a;">
              <div>
                <p style="font-size: 18px; margin-bottom: 10px;">Это HTML страница, а не видео файл</p>
                <p style="font-size: 14px; color: #ccc; margin-bottom: 15px;">URL: ${videoSrc}</p>
                <p style="font-size: 12px; color: #888; margin-bottom: 20px;">Для воспроизведения нужна прямая ссылка на видео файл (.mp4, .m3u8, .webm)</p>
                <div style="display: flex; gap: 10px; justify-content: center;">
                  <button onclick="window.open('${videoSrc}', '_blank')" style="padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    Открыть страницу
                  </button>
                  <button onclick="location.reload()" style="padding: 8px 16px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    Перезагрузить
                  </button>
                </div>
              </div>
            </div>
          `
          return
        }

        // Для HLS файлов добавляем сообщение о том, что нужен HLS плеер
        if (videoSrc.includes('.m3u8')) {
          videoElement.addEventListener('error', (e) => {
            console.log('HLS video error, showing HLS info:', e)
            container.innerHTML = `
              <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: white; text-align: center; background: #1a1a1a;">
                <div>
                  <p style="font-size: 18px; margin-bottom: 10px;">HLS видео требует специальный плеер</p>
                  <p style="font-size: 14px; color: #ccc; margin-bottom: 15px;">URL: ${videoSrc}</p>
                  <p style="font-size: 12px; color: #888;">Попробуйте открыть в другом браузере или используйте HLS плеер</p>
                  <button onclick="window.open('${videoSrc}', '_blank')" style="margin-top: 10px; padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    Открыть в новом окне
                  </button>
                </div>
              </div>
            `
          })
        }
        
        // Добавляем сообщение об ошибке
        videoElement.addEventListener('error', (e) => {
          console.error('Video load error:', e)
          container.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: white; text-align: center; background: #1a1a1a;">
              <div>
                <p style="font-size: 18px; margin-bottom: 10px;">Ошибка загрузки видео</p>
                <p style="font-size: 14px; color: #ccc;">URL: ${videoSrc}</p>
                <button onclick="location.reload()" style="margin-top: 10px; padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
                  Перезагрузить
                </button>
              </div>
            </div>
          `
        })
        
        // Очищаем контейнер и добавляем видео
        container.innerHTML = ''
        container.appendChild(videoElement)
        
        // Пытаемся загрузить видео
        videoElement.load()
        
      } else {
        container.innerHTML = `
          <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: white; text-align: center; background: #1a1a1a;">
            <div>
              <p style="font-size: 18px; margin-bottom: 10px;">Нет видео для воспроизведения</p>
              <p style="font-size: 14px; color: #ccc;">URL видео не указан</p>
            </div>
          </div>
        `
      }
    }
  }

  const createPlayer = async (videoSrc: string) => {
    try {
      console.log('Creating HTML5 player with src:', videoSrc)
      
      // Если это HTML страница (не видео файл), пытаемся извлечь прямую ссылку на видео
      let actualVideoUrl = videoSrc
      
      if (videoSrc.includes('.html') || videoSrc.includes('rezka.ag')) {
        console.log('Detected HTML page, extracting video URL...')
        try {
          const response = await fetch('/api/rezka/video-url', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: videoSrc })
          })
          
          if (response.ok) {
            const data = await response.json()
            if (data.videoUrl) {
              actualVideoUrl = data.videoUrl
              console.log('Extracted video URL:', actualVideoUrl)
            } else {
              console.warn('No video URL found, using original URL')
            }
          } else {
            console.warn('Failed to extract video URL, using original URL')
          }
        } catch (error) {
          console.warn('Error extracting video URL:', error)
        }
      }
      
      // Показываем HTML5 плеер с правильным URL
      showFallbackPlayer(actualVideoUrl)
      
      // Mark as initialized
      initializedRef.current = true
      console.log('HTML5 player created successfully')
      
    } catch (error) {
      console.error('Failed to create HTML5 player:', error)
      showFallbackPlayer(videoSrc)
    }
  }

  useEffect(() => {
    let cancelled = false

    const init = async () => {
      if (initializedRef.current || cancelled) return
      
      await createPlayer(currentSourceRef.current)
    }

    init()

    return () => {
      cancelled = true
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        playerRef.current.destroy()
      }
    }
  }, [containerId, src, poster, title, createPlayer, showFallbackPlayer])

  const handlePlayerChange = async (newSrc: string) => {
    currentSourceRef.current = newSrc
    initializedRef.current = false
    
    // Destroy current player
    if (playerRef.current && typeof playerRef.current.destroy === 'function') {
      playerRef.current.destroy()
    }
    
    // Создать новый плеер
    await createPlayer(newSrc)
  }

  // Создать все источники, включая основной src
  const allSources = [
    { url: src, label: 'Плеер 1', type: src.includes('.m3u8') ? 'hls' : 'mp4' as const },
    ...sources
  ]

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
                currentSourceRef.current === source.url
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {source.label}
              {source.type && (
                <span className="ml-1 text-xs opacity-75">
                  ({source.type.toUpperCase()})
                </span>
              )}
            </button>
          ))}
        </div>
      )}
      
      {/* Player Container */}
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
        <div id={containerId} className="w-full h-full" />
        
        {/* Light Toggle Button */}
        {showLightToggle && (
          <button
            onClick={() => setIsLightOff(!isLightOff)}
            className="absolute top-2 left-2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white px-3 py-1 rounded text-sm transition-all"
          >
            {isLightOff ? 'Включить свет' : 'Выключить свет'}
          </button>
        )}
        
        {/* Fullscreen Button */}
        {showFullscreen && (
          <button
            onClick={() => {
              const container = document.getElementById(containerId)
              if (container?.requestFullscreen) {
                container.requestFullscreen()
              }
            }}
            className="absolute top-2 right-2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white px-3 py-1 rounded text-sm transition-all"
          >
            Полный экран
          </button>
        )}
        
        {!src && (
          <div className="absolute inset-0 flex items-center justify-center text-white">
            <div className="text-center">
              <p className="text-lg font-semibold mb-2">Нет видео для воспроизведения</p>
              <p className="text-sm text-gray-300">URL видео не указан</p>
            </div>
          </div>
        )}
        {src && src.includes('.m3u8') && (
          <div className="absolute bottom-2 right-2 bg-yellow-600 text-white px-2 py-1 rounded text-xs">
            HLS
          </div>
        )}
      </div>
      
      {/* Light Overlay */}
      {isLightOff && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 pointer-events-none" />
      )}
    </div>
  )
}
