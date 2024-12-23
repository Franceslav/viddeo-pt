'use client'

import { ChevronsLeft } from "lucide-react"
import { FC } from "react"

interface Props {
  videoRef: React.RefObject<HTMLVideoElement | null>
  playbackRate: number
  setPlaybackRate: (rate: number) => void
}

const DecreaseVideoSpeed: FC<Props> = ({ videoRef, playbackRate, setPlaybackRate }) => {

  const decreaseSpeed = () => {
    if (videoRef.current) {
      const newRate = playbackRate <= 0.5 ? 2 : playbackRate - 0.5
      videoRef.current.playbackRate = newRate
      setPlaybackRate(newRate)
    }
  }

  return (
    <button onClick={decreaseSpeed} className="text-white">
      <ChevronsLeft />
    </button>
  )
}

export default DecreaseVideoSpeed