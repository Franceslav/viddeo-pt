'use client'

import Container from "@/components/container"
import { useParams } from "next/navigation"
import VideoPLayer from "../_components/video-player"

const VideoPage = () => {
  const { id } = useParams()

  // const { data: video, isLoading } = trpc.video.getVideo.useQuery({ id: id as string })

  return (
    <Container>
      {isLoading && !video ? (
        <div>
          Loading...
        </div>
      ) : (
        <VideoPLayer videoUrl={video?.url} />
      )}
    </Container>
  )
}

export default VideoPage