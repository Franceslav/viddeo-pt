import Container from "@/components/container"
import VideoPLayer from "../_components/video-player"
import { HydrateClient, trpc } from "@/app/server/routers/_app"
import { Suspense } from "react"

type Params = Promise<{ id: string }>

const Page = async ({ params }: { params: Params }) => {
  const { id } = await params

  void trpc.video.getVideo.prefetch({ id })

  return (
    <HydrateClient>
      <Container>
        <Suspense fallback={<div>Loading...</div>}>
          <VideoPLayer id={id as string} />
        </Suspense>
      </Container>
    </HydrateClient>
  )
}

export default Page