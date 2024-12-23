'use client'

import { ChevronsRight } from 'lucide-react'
import { FC } from 'react'

interface Props {
  videoRef: React.RefObject<HTMLVideoElement | null>
  playbackRate: number
  setPlaybackRate: (rate: number) => void
}

const IncreaseVideoSpeed: FC<Props> = ({ videoRef, playbackRate, setPlaybackRate }) => {

  const increaseSpeed = () => {
    if (videoRef.current) {
      const newRate = playbackRate >= 2 ? 0.5 : playbackRate + 0.5
      videoRef.current.playbackRate = newRate
      setPlaybackRate(newRate)
    }
  }

  return (
    <button onClick={increaseSpeed} className="text-white">
      <ChevronsRight />
    </button>
  )
}

export default IncreaseVideoSpeed