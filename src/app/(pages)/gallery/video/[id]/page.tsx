import { Suspense } from "react"
import { ErrorBoundary } from 'react-error-boundary';

import Container from "@/components/container"
import VideoPLayer from "../_components/video-player"
import { HydrateClient, trpc } from "@/app/server/routers/_app"

type Params = Promise<{ id: string }>

const Page = async ({ params }: { params: Params }) => {
  const { id } = await params

  void trpc.video.getVideo.prefetch({ id })

  return (
    <HydrateClient>
      <Container>
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
          <Suspense fallback={<div>Loading...</div>}>
            <VideoPLayer id={id as string} />
          </Suspense>
        </ErrorBoundary>
      </Container>
    </HydrateClient>
  )
}

export default Page