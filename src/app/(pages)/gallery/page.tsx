import Container from "@/components/container"
import VideosList from "./_components/videos-list"
import { HydrateClient } from "@/app/server/routers/_app"

const Gallery = () => {

  return (
    <Container>
      <HydrateClient>
        <VideosList />
      </HydrateClient>
    </Container>
  )
}

export default Gallery