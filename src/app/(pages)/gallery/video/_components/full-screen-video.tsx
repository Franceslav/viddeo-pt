'use client'

import { Fullscreen } from 'lucide-react'
import { FC } from 'react'

interface Props {
  videoRef: React.RefObject<HTMLVideoElement | null>
}

const FullScreenVideo: FC<Props> = ({ videoRef }) => {

  const toggleFullScreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen()
      } else {
        videoRef.current.requestFullscreen()
      }
    }
  }

  return (
    <button onClick={toggleFullScreen} className="text-white">
      <Fullscreen />
    </button>
  )
}

export default FullScreenVideo