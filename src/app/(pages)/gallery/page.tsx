import { ErrorBoundary } from "react-error-boundary"
import { Suspense } from "react"

import Container from "@/components/container"
import { VideosList, VideosListLoading } from "./_components/videos-list"
import { HydrateClient } from "@/app/server/routers/_app"

const Gallery = () => {

  return (
    <HydrateClient>
      <Container>
        <ErrorBoundary fallback={<div>Something went wrong</div>}>
          <Suspense fallback={<VideosListLoading />}>
            <VideosList />
          </Suspense>
        </ErrorBoundary>
      </Container>
    </HydrateClient>
  )
}

export default Gallery