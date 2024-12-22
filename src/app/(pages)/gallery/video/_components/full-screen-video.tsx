import { Fullscreen } from 'lucide-react'
import React, { FC } from 'react'

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
    <div className='absolute top-2 left-2 text-primary'>
      <button onClick={toggleFullScreen}>
        <Fullscreen size={24} />
      </button>
    </div>
  )
}

export default FullScreenVideo