import { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { trpc } from '@/app/server/routers/_app'

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { seasonNumber, episodeNumber } = await params
  
  try {
    // Получаем сезон по номеру
    const seasons = await trpc.season.getSeasons()
    const season = seasons.find(s => s.seasonNumber === parseInt(seasonNumber))
    
    if (!season) {
      return {
        title: "Сезон не найден | Южный парк онлайн",
        description: "Запрашиваемый сезон Южного парка не найден."
      }
    }

    // Получаем эпизод по номеру в сезоне
    const episodes = await trpc.episode.getEpisodes()
    const episode = episodes.find(e => 
      e.season.seasonNumber === parseInt(seasonNumber) && 
      e.episodeNumber === parseInt(episodeNumber)
    )
    
    if (!episode) {
      return {
        title: "Эпизод не найден | Южный парк онлайн",
        description: "Запрашиваемый эпизод Южного парка не найден."
      }
    }
    
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
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://southpark-online.ru'}/yuzhnyy-park/sezon-${seasonNumber}/seria-${episodeNumber}`
      }
    }
  } catch {
    return {
      title: "Эпизод не найден | Южный парк онлайн",
      description: "Запрашиваемый эпизод Южного парка не найден."
    }
  }
}

type Params = Promise<{ seasonNumber: string; episodeNumber: string }>

const Page = async ({ params }: { params: Params }) => {
  const { seasonNumber, episodeNumber } = await params

  try {
    // Получаем сезон по номеру
    const seasons = await trpc.season.getSeasons()
    const season = seasons.find(s => s.seasonNumber === parseInt(seasonNumber))
    
    if (!season) {
      redirect('/south-park')
    }

    // Получаем эпизод по номеру в сезоне
    const episodes = await trpc.episode.getEpisodes()
    const episode = episodes.find(e => 
      e.season.seasonNumber === parseInt(seasonNumber) && 
      e.episodeNumber === parseInt(episodeNumber)
    )
    
    if (!episode) {
      redirect(`/south-park/season-${seasonNumber}`)
    }

    // Перенаправляем на оригинальный URL с ID
    redirect(`/gallery/episode/${episode.id}`)
  } catch {
    redirect('/south-park')
  }
}

export default Page
