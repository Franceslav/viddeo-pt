'use client'

import { useEffect, useId, useRef } from 'react'

declare global {
  interface Window {
    Playerjs?: any
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
      
      // Load PlayerJS from CDN
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.async = true
      script.src = 'https://playerjs.com/static/player.js'
      document.head.appendChild(script)
      
      await new Promise<void>((resolve) => {
        script.addEventListener('load', () => resolve())
        script.addEventListener('error', () => {
          console.warn('Failed to load PlayerJS from CDN, trying fallback')
          resolve() // Don't reject, just continue
        })
        // fallback timeout
        setTimeout(() => resolve(), 5000)
      })
    }

    const init = async () => {
      if (initializedRef.current || cancelled) return
      
      try {
        await ensureScript()
        if (cancelled) return
        
        // Wait for PlayerJS to be available
        let attempts = 0
        while (!window.Playerjs && attempts < 50) {
          await new Promise(resolve => setTimeout(resolve, 100))
          attempts++
        }
        
        if (window.Playerjs) {
          const container = document.getElementById(containerId)
          if (container && !cancelled) {
            // Clear container first
            container.innerHTML = ''
            
            // Create PlayerJS instance with correct API
            playerRef.current = new window.Playerjs({
              id: containerId,
              file: src,
              poster: poster || undefined,
              title: title || undefined,
            })
            initializedRef.current = true
            console.log('PlayerJS initialized successfully with file:', src)
          }
        } else {
          console.warn('PlayerJS not available, showing fallback video player')
          showFallbackPlayer()
        }
      } catch (error) {
        console.error('Failed to initialize PlayerJS:', error)
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
    if (container && src) {
      container.innerHTML = `
        <video 
          controls 
          style="width: 100%; height: 100%; object-fit: contain;"
          ${poster ? `poster="${poster}"` : ''}
          ${title ? `title="${title}"` : ''}
        >
          <source src="${src}" type="video/mp4">
          <source src="${src}" type="video/webm">
          <source src="${src}" type="video/ogg">
          Ваш браузер не поддерживает видео тег.
        </video>
      `
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
