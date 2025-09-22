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

  useEffect(() => {
    let cancelled = false

    const ensureScript = async () => {
      if (window.Playerjs) return
      const script = document.createElement('script')
      script.defer = true
      script.src = process.env.NEXT_PUBLIC_PLAYERJS_SRC || '/playerjs.js'
      document.head.appendChild(script)
      await new Promise<void>((resolve) => {
        script.addEventListener('load', () => resolve())
        // fallback timeout
        setTimeout(() => resolve(), 2000)
      })
    }

    const init = async () => {
      if (initializedRef.current || cancelled) return
      await ensureScript()
      if (cancelled) return
      if (window.Playerjs) {
        // eslint-disable-next-line no-new
        new window.Playerjs({
          container: `#${containerId}`,
          file: src,
          poster: poster || undefined,
          title: title || undefined,
          width: '100%',
          height: '100%',
          controls: true,
        })
        initializedRef.current = true
      }
    }

    init()

    return () => {
      cancelled = true
    }
  }, [containerId, src, poster, title])

  return (
    <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
      <div id={containerId} className="w-full h-full" />
    </div>
  )
}
