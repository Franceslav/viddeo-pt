'use client'

import { FC, useRef } from 'react'
import FullScreenVideo from './full-screen-video';
import PlayVideo from './play-video';
import ChangeVideoSpeed from './change-video-speed';

interface Props {
  videoUrl: string
}

const VideoPLayer: FC<Props> = ({ videoUrl }) => {

  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
      <video
        className="w-full h-full object-cover cld-video-player cld-video-player-skin-dark cld-fluid"
        poster="/assets/placeholder-medium.webp"
        ref={videoRef}
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <PlayVideo videoRef={videoRef} />
      <ChangeVideoSpeed videoRef={videoRef} />
      <FullScreenVideo videoRef={videoRef} />
    </div>
  )
}

export default VideoPLayer