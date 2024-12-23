'use client'

import { trpc } from "@/app/_trpc/client";
import { cn } from "@/lib/utils";
import { Play } from "lucide-react"
import { useParams } from "next/navigation";
import { FC, useState } from "react"

interface Props {
  videoRef: React.RefObject<HTMLVideoElement | null>
}

const PlayVideo: FC<Props> = ({ videoRef }) => {

  const [isPlaying, setIsPlaying] = useState(false);
  const [viewCounted, setViewCounted] = useState(false);

  const videoId = useParams().id as string

  const { mutate: increaseViews } = trpc.video.increaseViews.useMutation();

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
        if(!viewCounted){
          increaseViews({ id: videoId })
          setViewCounted(true)
        }
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <div className={cn("inset-0 flex items-center justify-center", isPlaying ? "hidden" : "absolute")}>
      <button onClick={togglePlay} className="bg-white bg-opacity-80 rounded-full p-4 text-gray-800 hover:bg-opacity-100 transition-opacity">
        <Play size={48} />
      </button>
    </div>
  )
}

export default PlayVideo