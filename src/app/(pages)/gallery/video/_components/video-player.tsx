'use client'

import { FC, useEffect, useRef } from 'react'
import { Video } from '@prisma/client';
import VideoControls from './video-controls';
import Hls from 'hls.js'

interface Props {
  video: Video & { image?: string | null }
}

const VideoPLayer: FC<Props> = ({ video }) => {

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current
    if (!v) return

    let h: Hls | null = null
    const src = video.url

    if (src?.includes('.m3u8') && Hls.isSupported()) {
      h = new Hls({
        fragLoadPolicy: { maxTimeToFirstByteMs: 10000, maxLoadTimeMs: 20000 },
        manifestLoadPolicy: { maxTimeToFirstByteMs: 8000, maxLoadTimeMs: 15000 }
      })
      h.loadSource(src)
      h.attachMedia(v)
    } else if (src) {
      v.src = src
    }

    return () => {
      h?.destroy()
    }
  }, [video.url])

  // TODO: Hide controls when video is full screen - not working with cld-video-player
  return (
    <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden group">
      <video
        className="w-full h-full object-cover cld-video-player cld-video-player-skin-dark cld-fluid"
        poster={video.image || "/assets/placeholder-medium.webp"}
        controls={false}
        ref={videoRef}
      >
        {/* Источник задаётся в useEffect для HLS; для Safari фоллбек на прямой src */}
        <source src={video.url} />
        Your browser does not support the video tag.
      </video>
      <VideoControls videoRef={videoRef} />
    </div>
  )
}

export default VideoPLayer