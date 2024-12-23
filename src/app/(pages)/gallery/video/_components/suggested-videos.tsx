import { trpc } from "@/app/server/routers/_app"
import SuggestCard from "./suggest-card"

const SuggestedVideos = async () => {

  const videos = await trpc.video.getVideos()

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Up next</h3>
      <div className="space-y-4">
        {videos.map((video) => (
          <SuggestCard key={video.id} id={video.id} title={video.title} views={video.views} />
        ))}
      </div>
    </div>
  )
}

export default SuggestedVideos