import { trpc } from "@/app/server/routers/_app"
import SuggestCard from "./suggest-card"

const SuggestedVideos = async () => {

  const videos = await trpc.video.getVideos()

  return (
    <div className="bg-yellow-300 p-4 rounded-lg border-4 border-yellow-400 shadow-lg">
      <h3 className="text-xl font-black mb-4 text-white transform -rotate-1" style={{ textShadow: '2px 2px 0px #000000' }}>
        РЕКОМЕНДУЕМЫЕ
      </h3>
      <div className="space-y-4">
        {videos.slice(0, 5).map((video) => (
          <SuggestCard 
            key={video.id} 
            id={video.id} 
            title={video.title} 
            views={video.views}
            type={video.type}
            image={video.image}
          />
        ))}
      </div>
    </div>
  )
}

export default SuggestedVideos