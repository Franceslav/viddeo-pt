import { Suspense } from "react"

import EpisodeContainer from "../_components/episode-container";
import EpisodeContainerLoading from "../_components/episode-container-loading";

type Params = Promise<{ id: string }>

const Page = async ({ params }: { params: Params }) => {
  const { id } = await params

  return (
    <div className="min-h-screen bg-black w-screen">
      <div className="w-full py-8 px-4">
        <Suspense fallback={<EpisodeContainerLoading />}>
          <EpisodeContainer id={id} />
        </Suspense>
      </div>
    </div>
  )
}

export default Page
