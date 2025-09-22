'use client'

import { useEffect, useId, useRef } from 'react'

declare global {
  interface Window {
    Playerjs?: any
    PlayerjsAsync?: any
  }
}

interface VideoSource {
  url: string
  label: string
  type?: 'mp4' | 'webm' | 'hls' | 'dash'
}

interface Props {
  src: string
  poster?: string | null
  title?: string
  sources?: VideoSource[]
  showPlayerSelector?: boolean
}

export default function PlayerJS({ src, poster, title, sources = [], showPlayerSelector = false }: Props) {
  const containerId = useId().replace(/:/g, '')
  const playerSelectorId = `${containerId}-selector`
  const initializedRef = useRef(false)
  const playerRef = useRef<any>(null)
  const currentSourceRef = useRef(src)

  useEffect(() => {
    let cancelled = false

    const ensureScript = async () => {
      if (window.Playerjs) return
      
      // Check if script already exists
      const existingScript = document.querySelector('script[src*="playerjs"]')
      if (existingScript) return
      
      // Load PlayerJS from CDN (synchronously as recommended)
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = 'https://playerjs.com/static/player.js'
      document.head.appendChild(script)
      
      await new Promise<void>((resolve) => {
        script.addEventListener('load', () => {
          console.log('PlayerJS script loaded')
          resolve()
        })
        script.addEventListener('error', () => {
          console.warn('Failed to load PlayerJS from CDN')
          resolve() // Don't reject, just continue
        })
        // fallback timeout
        setTimeout(() => resolve(), 3000)
      })
    }

    const createPlayer = async (videoSrc: string) => {
      if (cancelled) return
      
      try {
        console.log('Creating PlayerJS with src:', videoSrc)
        
        await ensureScript()
        if (cancelled) return
        
        // Wait for PlayerJS to be available
        let attempts = 0
        while (!window.Playerjs && attempts < 50) {
          await new Promise(resolve => setTimeout(resolve, 100))
          attempts++
        }
        
        console.log('PlayerJS available after', attempts, 'attempts:', !!window.Playerjs)
        
        if (window.Playerjs) {
          const container = document.getElementById(containerId)
          if (container && !cancelled) {
            // Clear container first
            container.innerHTML = ''
            
            console.log('Creating PlayerJS instance with:', {
              id: containerId,
              file: videoSrc,
              poster: poster,
              title: title
            })
            
            try {
              // Create PlayerJS instance with correct API
              const playerConfig = {
                id: containerId,
                file: videoSrc,
                poster: poster || undefined,
                title: title || undefined,
              }
              
              console.log('Creating PlayerJS with config:', playerConfig)
              
              playerRef.current = new window.Playerjs(playerConfig)
              
              // Mark as initialized immediately
              initializedRef.current = true
              console.log('PlayerJS instance created successfully')
              
            } catch (playerError) {
              console.error('PlayerJS creation failed:', playerError)
              showFallbackPlayer(videoSrc)
            }
          } else {
            console.error('Container not found:', containerId)
            showFallbackPlayer(videoSrc)
          }
        } else {
          console.warn('PlayerJS not available, showing fallback video player')
          showFallbackPlayer(videoSrc)
        }
      } catch (error) {
        console.error('Failed to initialize PlayerJS:', error)
        showFallbackPlayer(videoSrc)
      }
    }

    const init = async () => {
      if (initializedRef.current || cancelled) return
      
      // Fallback timeout - if PlayerJS doesn't work, show HTML5 player
      setTimeout(() => {
        if (!initializedRef.current) {
          console.log('PlayerJS timeout, forcing fallback')
          showFallbackPlayer(currentSourceRef.current)
        }
      }, 3000)
      
      await createPlayer(currentSourceRef.current)
    }

    init()

    return () => {
      cancelled = true
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        playerRef.current.destroy()
      }
    }
  }, [containerId, src, poster, title])

  const showFallbackPlayer = (videoSrc: string = currentSourceRef.current) => {
    const container = document.getElementById(containerId)
    if (container) {
      if (videoSrc) {
        console.log('Showing fallback player for:', videoSrc)
        
        // Try iframe PlayerJS first
        const iframeUrl = `https://playerjs.com/player.html?file=${encodeURIComponent(videoSrc)}${poster ? `&poster=${encodeURIComponent(poster)}` : ''}${title ? `&title=${encodeURIComponent(title)}` : ''}`
        
        container.innerHTML = `
          <iframe 
            src="${iframeUrl}"
            style="width: 100%; height: 100%; border: none;"
            frameborder="0"
            allowfullscreen
            allow="autoplay; fullscreen; picture-in-picture;"
            onerror="console.error('Iframe PlayerJS failed, showing HTML5'); this.parentElement.innerHTML='<video controls style=\\"width: 100%; height: 100%; object-fit: contain;\\" ${poster ? `poster=\\"${poster}\\"` : ''} ${title ? `title=\\"${title}\\"` : ''}><source src=\\"${videoSrc}\\" type=\\"video/mp4\\"><source src=\\"${videoSrc}\\" type=\\"video/webm\\"><source src=\\"${videoSrc}\\" type=\\"video/ogg\\">Ваш браузер не поддерживает видео тег.</video>'"
          ></iframe>
        `
      } else {
        container.innerHTML = `
          <div style="display: flex; align-items: center; justify-content: center; height: 100%; color: white; text-align: center;">
            <div>
              <p style="font-size: 18px; margin-bottom: 10px;">Нет видео для воспроизведения</p>
              <p style="font-size: 14px; color: #ccc;">URL видео не указан</p>
            </div>
          </div>
        `
      }
    }
  }

  const handlePlayerChange = async (newSrc: string) => {
    currentSourceRef.current = newSrc
    initializedRef.current = false
    
    // Destroy current player
    if (playerRef.current && typeof playerRef.current.destroy === 'function') {
      playerRef.current.destroy()
    }
    
    // Create new player
    await createPlayer(newSrc)
  }

  // Create all sources including the main src
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
        {!src && (
          <div className="absolute inset-0 flex items-center justify-center text-white">
            <div className="text-center">
              <p className="text-lg font-semibold mb-2">Нет видео для воспроизведения</p>
              <p className="text-sm text-gray-300">URL видео не указан</p>
            </div>
          </div>
        )}
        {src && src.includes('.m3u8') && (
          <div className="absolute top-2 right-2 bg-yellow-600 text-white px-2 py-1 rounded text-xs">
            HLS
          </div>
        )}
      </div>
    </div>
  )
}
