import { Suspense } from "react"

import VideoContainer from "../_components/video-container";
import VideoContainerLoading from "../_components/video-container-loading";

type Params = Promise<{ id: string }>

const Page = async ({ params }: { params: Params }) => {
  const { id } = await params

  return (
    <Suspense fallback={<VideoContainerLoading />}>
      <VideoContainer id={id} />
    </Suspense>
  )
}

export default Page