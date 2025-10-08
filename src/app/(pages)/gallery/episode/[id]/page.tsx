import { Suspense } from "react"
import { Metadata } from 'next'

import EpisodeContainer from "../_components/episode-container";
import EpisodeContainerLoading from "../_components/episode-container-loading";
import { trpc } from '@/app/server/routers/_app'

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params
  
  try {
    const episode = await trpc.episode.getEpisode({ id })
    
    return {
      title: `${episode.title} | Южный парк онлайн - Сезон ${episode.season.seasonNumber}, Эпизод ${episode.episodeNumber}`,
      description: episode.description || `Смотрите эпизод "${episode.title}" Южного парка онлайн бесплатно в хорошем качестве. Сезон ${episode.season.seasonNumber}, эпизод ${episode.episodeNumber}. Полная серия с русской озвучкой и субтитрами.`,
      keywords: `южный парк, ${episode.title}, сезон ${episode.season.seasonNumber}, эпизод ${episode.episodeNumber}, смотреть онлайн, бесплатно, hd качество, русская озвучка`,
      openGraph: {
        title: `${episode.title} | Южный парк онлайн - Сезон ${episode.season.seasonNumber}, Эпизод ${episode.episodeNumber}`,
        description: episode.description || `Смотрите эпизод "${episode.title}" Южного парка онлайн бесплатно в хорошем качестве. Сезон ${episode.season.seasonNumber}, эпизод ${episode.episodeNumber}.`,
        type: "video.episode",
        images: episode.image ? [{
          url: episode.image,
          width: 1200,
          height: 630,
          alt: `${episode.title} - Сезон ${episode.season.seasonNumber}, Эпизод ${episode.episodeNumber}`
        }] : [{
          url: "/assets/hero.png",
          width: 1200,
          height: 630,
          alt: `${episode.title} - Сезон ${episode.season.seasonNumber}, Эпизод ${episode.episodeNumber}`
        }],
      },
      twitter: {
        card: "summary_large_image",
        title: `${episode.title} | Южный парк онлайн - Сезон ${episode.season.seasonNumber}, Эпизод ${episode.episodeNumber}`,
        description: episode.description || `Смотрите эпизод "${episode.title}" Южного парка онлайн бесплатно в хорошем качестве. Сезон ${episode.season.seasonNumber}, эпизод ${episode.episodeNumber}.`,
        images: episode.image ? [episode.image] : ["/assets/hero.png"],
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://southpark-online.ru'}/gallery/episode/${id}`
      }
    }
  } catch {
    return {
      title: "Эпизод не найден | Южный парк онлайн",
      description: "Запрашиваемый эпизод Южного парка не найден."
    }
  }
}

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
