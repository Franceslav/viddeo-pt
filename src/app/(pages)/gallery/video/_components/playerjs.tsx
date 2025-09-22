'use client'

import { useEffect, useId, useRef } from 'react'

declare global {
  interface Window {
    PlayerJS?: any
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
      if (window.PlayerJS) return
      
      // Check if script already exists
      const existingScript = document.querySelector('script[src*="playerjs.js"]')
      if (existingScript) return
      
      const script = document.createElement('script')
      script.defer = true
      script.src = process.env.NEXT_PUBLIC_PLAYERJS_SRC || '/playerjs.js'
      document.head.appendChild(script)
      
      await new Promise<void>((resolve, reject) => {
        script.addEventListener('load', () => resolve())
        script.addEventListener('error', () => reject(new Error('Failed to load PlayerJS')))
        // fallback timeout
        setTimeout(() => resolve(), 3000)
      })
    }

    const init = async () => {
      if (initializedRef.current || cancelled) return
      
      try {
        await ensureScript()
        if (cancelled) return
        
        // Wait a bit for the script to initialize
        await new Promise(resolve => setTimeout(resolve, 100))
        
        if (window.PlayerJS) {
          const container = document.getElementById(containerId)
          if (container && !cancelled) {
            // Clear container first
            container.innerHTML = ''
            
            // Create new player instance
            playerRef.current = new window.PlayerJS({
              container: container,
              file: src,
              poster: poster || undefined,
              title: title || undefined,
              width: '100%',
              height: '100%',
              controls: true,
            })
            initializedRef.current = true
            console.log('PlayerJS initialized successfully')
          }
        } else {
          console.error('PlayerJS not available on window object')
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

  return (
    <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
      <div id={containerId} className="w-full h-full" />
      {!src && (
        <div className="absolute inset-0 flex items-center justify-center text-white">
          <p>Нет видео для воспроизведения</p>
        </div>
      )}
    </div>
  )
}
