'use client'

import { FC, useRef } from 'react'
import { Video } from '@prisma/client';
import VideoControls from './video-controls';

interface Props {
  video: Video
}

const VideoPLayer: FC<Props> = ({ video }) => {

  const videoRef = useRef<HTMLVideoElement>(null);

  // TODO: Hide controls when video is full screen - not working with cld-video-player
  return (
    <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden group">
      <video
        className="w-full h-full object-cover cld-video-player cld-video-player-skin-dark cld-fluid"
        poster="/assets/placeholder-medium.webp"
        controls={false}
        ref={videoRef}
      >
        <source src={video.url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <VideoControls videoRef={videoRef} />
    </div>
  )
}

export default VideoPLayer