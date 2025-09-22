'use client'

import { useEffect, useId, useRef } from 'react'

declare global {
  interface Window {
    Playerjs?: any
    PlayerjsAsync?: any
  }
}

interface Props {
  src: string
  poster?: string | null
  title?: string
}

export default function PlayerJS({ src, poster, title }: Props) {
  const containerId = useId().replace(/:/g, '')
  const initializedRef = useRef(false)
  const playerRef = useRef<any>(null)

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

    const init = async () => {
      if (initializedRef.current || cancelled) return
      
      try {
        console.log('Initializing PlayerJS with src:', src)
        
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
              file: src,
              poster: poster,
              title: title
            })
            
            try {
              // Create PlayerJS instance with correct API
              const playerConfig = {
                id: containerId,
                file: src,
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
              showFallbackPlayer()
            }
          } else {
            console.error('Container not found:', containerId)
            showFallbackPlayer()
          }
        } else {
          console.warn('PlayerJS not available, showing fallback video player')
          showFallbackPlayer()
        }
        
        // Fallback timeout - if PlayerJS doesn't work, show HTML5 player
        setTimeout(() => {
          if (!initializedRef.current) {
            console.log('PlayerJS timeout, forcing fallback')
            showFallbackPlayer()
          }
        }, 3000)
      } catch (error) {
        console.error('Failed to initialize PlayerJS:', error)
        showFallbackPlayer()
      }
    }

    init()

    return () => {
      cancelled = true
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        playerRef.current.destroy()
      }
    }
  }, [containerId, src, poster, title])

  const showFallbackPlayer = () => {
    const container = document.getElementById(containerId)
    if (container) {
      if (src) {
        console.log('Showing fallback player for:', src)
        
        // Try iframe PlayerJS first
        const iframeUrl = `https://playerjs.com/player.html?file=${encodeURIComponent(src)}${poster ? `&poster=${encodeURIComponent(poster)}` : ''}${title ? `&title=${encodeURIComponent(title)}` : ''}`
        
        container.innerHTML = `
          <iframe 
            src="${iframeUrl}"
            style="width: 100%; height: 100%; border: none;"
            frameborder="0"
            allowfullscreen
            allow="autoplay; fullscreen; picture-in-picture;"
            onerror="console.error('Iframe PlayerJS failed, showing HTML5'); this.parentElement.innerHTML='<video controls style=\\"width: 100%; height: 100%; object-fit: contain;\\" ${poster ? `poster=\\"${poster}\\"` : ''} ${title ? `title=\\"${title}\\"` : ''}><source src=\\"${src}\\" type=\\"video/mp4\\"><source src=\\"${src}\\" type=\\"video/webm\\"><source src=\\"${src}\\" type=\\"video/ogg\\">Ваш браузер не поддерживает видео тег.</video>'"
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

  return (
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
  )
}
