'use client'

import { trpc } from "@/app/_trpc/client";
import { cn } from "@/lib/utils";
import { Pause, Play } from "lucide-react"
import { useParams } from "next/navigation";
import { FC, useEffect, useState } from "react";
import DecreaseVideoSpeed from "./decrease-video-speed";
import IncreaseVideoSpeed from "./increase-video-speed";
import FullScreenVideo from "./full-screen-video";

interface Props {
  videoRef: React.RefObject<HTMLVideoElement | null>
}

const VideoControls: FC<Props> = ({ videoRef }) => {

  const [isPlaying, setIsPlaying] = useState(false);

  const [viewCounted, setViewCounted] = useState(false);
  
  const [playbackRate, setPlaybackRate] = useState(1);

  const [controlsVisible, setControlsVisible] = useState(false);

  const videoId = useParams().id as string

  const { mutate: increaseViews } = trpc.video.increaseViews.useMutation();

  useEffect(() => {
    const video = videoRef.current;

    const handleEnded = () => {
      setIsPlaying(false);
      setControlsVisible(false);
    };

    video?.addEventListener('ended', handleEnded);

    return () => {
      video?.removeEventListener('ended', handleEnded);
    };
  }, [videoRef]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
        if (!viewCounted) {
          increaseViews({ id: videoId })
          setViewCounted(true)
        }

      }
      setIsPlaying(!isPlaying)
      setControlsVisible(true)
    }
  }

  return (
    <>
      <div className={cn(
        'absolute flex items-center justify-center gap-4 inset-0 place-self-end w-full bg-black/50 h-fit py-4',
        controlsVisible ? 'group-hover:z-10' : '-z-10'
      )}>
        <DecreaseVideoSpeed videoRef={videoRef} playbackRate={playbackRate} setPlaybackRate={setPlaybackRate} />

        <button onClick={togglePlay} className="text-white">
          {isPlaying ? <Pause /> : <Play />}
        </button>

        <IncreaseVideoSpeed videoRef={videoRef} playbackRate={playbackRate} setPlaybackRate={setPlaybackRate} />

        <FullScreenVideo videoRef={videoRef} />
      </div>

      {
        !isPlaying && !controlsVisible && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button onClick={togglePlay} className="bg-white bg-opacity-80 rounded-full p-4 text-gray-800 hover:bg-opacity-100 transition-opacity">
              <Play size={48} />
            </button>
          </div>
        )}
    </>
  )
}

export default VideoControls