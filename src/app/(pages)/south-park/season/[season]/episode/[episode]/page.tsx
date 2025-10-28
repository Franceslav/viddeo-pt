import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { trpc } from '@/app/server/routers/_app'
// import EpisodeContainer from '@/app/(pages)/gallery/episode/_components/episode-container'
import Breadcrumbs from '@/components/breadcrumbs'
import { HydrateClient } from "@/app/server/routers/_app"
import Container from '@/components/container'

interface EpisodePageProps {
  params: Promise<{ season: string; episode: string }>
}

// Генерируем статические страницы для всех эпизодов
export async function generateStaticParams() {
  try {
    const episodes = await trpc.episode.getEpisodes()
    return episodes.map((episode) => ({
      season: episode.season.seasonNumber.toString(),
      episode: episode.episodeNumber.toString(),
    }))
  } catch (error) {
    console.error('Error generating static params for episodes:', error)
    return []
  }
}

export async function generateMetadata({ params }: EpisodePageProps): Promise<Metadata> {
  const { season, episode } = await params
  const seasonNumber = parseInt(season)
  const episodeNumber = parseInt(episode)
  
  try {
    const episodes = await trpc.episode.getEpisodes()
    const episodeData = episodes.find(ep => 
      ep.season.seasonNumber === seasonNumber && ep.episodeNumber === episodeNumber
    )
    
    if (!episodeData) {
      return {
        title: `Южный Парк ${seasonNumber} сезон ${episodeNumber} серия смотреть онлайн`,
        description: `Смотрите ${seasonNumber} сезон ${episodeNumber} серия Южного Парка онлайн бесплатно в HD качестве с русской озвучкой.`,
      }
    }
    
    return {
      title: `Южный Парк ${seasonNumber} сезон ${episodeNumber} серия – ${episodeData.title} смотреть онлайн`,
      description: `Смотрите "${episodeData.title}" - ${seasonNumber} сезон ${episodeNumber} серия Южного Парка онлайн бесплатно в HD качестве. Полная серия с русской озвучкой.`,
      keywords: `южный парк, ${episodeData.title}, ${seasonNumber} сезон, ${episodeNumber} серия, смотреть онлайн, бесплатно, hd качество, русская озвучка`,
      openGraph: {
        title: `Южный Парк ${seasonNumber} сезон ${episodeNumber} серия – ${episodeData.title} смотреть онлайн`,
        description: `Смотрите "${episodeData.title}" - ${seasonNumber} сезон ${episodeNumber} серия Южного Парка онлайн бесплатно в HD качестве.`,
        type: "video.episode",
        images: episodeData.image ? [{
          url: episodeData.image,
          width: 1200,
          height: 630,
          alt: `${episodeData.title} - Южный Парк`
        }] : ["/assets/hero.png"]
      },
      twitter: {
        card: "summary_large_image",
        title: `Южный Парк ${seasonNumber} сезон ${episodeNumber} серия – ${episodeData.title} смотреть онлайн`,
        description: `Смотрите "${episodeData.title}" - ${seasonNumber} сезон ${episodeNumber} серия Южного Парка онлайн бесплатно в HD качестве.`,
        images: episodeData.image ? [episodeData.image] : ["/assets/hero.png"],
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://southpark-online.ru'}/south-park/season-${seasonNumber}/episode-${episodeNumber}`
      }
    }
  } catch {
    return {
      title: `Южный Парк ${seasonNumber} сезон ${episodeNumber} серия смотреть онлайн`,
      description: `Смотрите ${seasonNumber} сезон ${episodeNumber} серия Южного Парка онлайн бесплатно в HD качестве с русской озвучкой.`,
    }
  }
}

export default async function EpisodePage({ params }: EpisodePageProps) {
  const { season, episode } = await params
  const seasonNumber = parseInt(season)
  const episodeNumber = parseInt(episode)
  
  try {
    const episodes = await trpc.episode.getEpisodes()
    const episodeData = episodes.find(ep => 
      ep.season.seasonNumber === seasonNumber && ep.episodeNumber === episodeNumber
    )
    
    if (!episodeData) {
      notFound()
    }

    return (
      <HydrateClient>
        <div className="min-h-screen bg-black">
          <Container>
            <div className="py-4">
              <Breadcrumbs
                items={[
                  { name: 'South Park', href: '/south-park' },
                  { name: `Сезон ${seasonNumber}`, href: `/south-park/season-${seasonNumber}` },
                  { name: episodeData.title, href: `/south-park/season-${seasonNumber}/episode-${episodeNumber}` },
                ]}
              />
            </div>
            
            <div className="text-center py-20">
              <h1 className="text-4xl font-black text-white mb-4">
                {episodeData.title || `Эпизод ${episodeNumber}`}
              </h1>
              <p className="text-lg text-white mb-6">
                {episodeData.description || `Смотрите эпизод ${episodeNumber} сезона ${seasonNumber} Южного Парка онлайн бесплатно в HD качестве с русской озвучкой.`}
              </p>
              <Link 
                href="/south-park" 
                className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
              >
                Все сезоны
              </Link>
            </div>
          </Container>
        </div>
      </HydrateClient>
    )
  } catch (error) {
    console.error('Error loading episode:', error)
    notFound()
  }
}
