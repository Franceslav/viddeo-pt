'use client'

import { RedoDot } from "lucide-react";
import { FC, useState } from "react";

interface Props {
  videoRef: React.RefObject<HTMLVideoElement | null>
}

const ChangeVideoSpeed: FC<Props> = ({ videoRef }) => {

  const [playbackRate, setPlaybackRate] = useState(1);


  const changeSpeed = () => {
    if (videoRef.current) {
      const newRate = playbackRate >= 2 ? 0.5 : playbackRate + 0.5
      videoRef.current.playbackRate = newRate
      setPlaybackRate(newRate)
    }
  }

  return (
    <div className='absolute top-2 right-2'>
      <button onClick={changeSpeed} className='text-primary'>
        <RedoDot size={24} />
      </button>
    </div>
  )
}

export default ChangeVideoSpeed