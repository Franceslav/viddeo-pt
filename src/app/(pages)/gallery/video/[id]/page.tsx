'use client'

import { useParams } from "next/navigation"

const VideoPage = () => {
  const { id } = useParams()

  return (
    <div>
      Hello {id}
    </div>
  )
}

export default VideoPage