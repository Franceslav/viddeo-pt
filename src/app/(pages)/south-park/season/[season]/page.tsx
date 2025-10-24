import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { trpc } from '@/app/server/routers/_app'
import { SeasonDetails } from '@/app/(pages)/gallery/season/[id]/_components/season-details'
import Breadcrumbs from '@/components/breadcrumbs'
import { HydrateClient } from "@/app/server/routers/_app"
import Container from '@/components/container'

interface SeasonPageProps {
  params: Promise<{ season: string }>
}

// Генерируем статические страницы для всех сезонов
export async function generateStaticParams() {
  try {
    const seasons = await trpc.season.getSeasons()
    return seasons.map((season) => ({
      season: season.seasonNumber.toString(),
    }))
  } catch (error) {
    console.error('Error generating static params for seasons:', error)
    return []
  }
}

export async function generateMetadata({ params }: SeasonPageProps): Promise<Metadata> {
  const { season } = await params
  const seasonNumber = parseInt(season)
  
  try {
    const seasons = await trpc.season.getSeasons()
    const seasonData = seasons.find(s => s.seasonNumber === seasonNumber)
    
    if (!seasonData) {
      return {
        title: `Сезон ${seasonNumber} - Южный Парк онлайн`,
        description: `Смотрите ${seasonNumber} сезон Южного Парка онлайн бесплатно в HD качестве с русской озвучкой. Все эпизоды сезона доступны на нашем сайте.`,
      }
    }
    
    return {
      title: `${seasonData.title} - Южный Парк онлайн`,
      description: `Смотрите ${seasonData.title} онлайн бесплатно в HD качестве с русской озвучкой. Все эпизоды ${seasonNumber} сезона Южного Парка доступны на нашем сайте.`,
      keywords: `южный парк, ${seasonNumber} сезон, ${seasonData.title}, смотреть онлайн, бесплатно, hd качество, русская озвучка`,
      openGraph: {
        title: `${seasonData.title} - Южный Парк онлайн`,
        description: `Смотрите ${seasonData.title} онлайн бесплатно в HD качестве с русской озвучкой.`,
        type: "website",
        images: seasonData.image ? [{
          url: seasonData.image,
          width: 1200,
          height: 630,
          alt: `${seasonData.title} - Южный Парк`
        }] : ["/assets/hero.png"]
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://southpark-online.ru'}/south-park/season-${seasonNumber}`
      }
    }
  } catch {
    return {
      title: `Сезон ${seasonNumber} - Южный Парк онлайн`,
      description: `Смотрите ${seasonNumber} сезон Южного Парка онлайн бесплатно в HD качестве с русской озвучкой.`,
    }
  }
}

export default async function SeasonPage({ params }: SeasonPageProps) {
  const { season } = await params
  const seasonNumber = parseInt(season)
  
  try {
    const seasons = await trpc.season.getSeasons()
    const seasonData = seasons.find(s => s.seasonNumber === seasonNumber)
    
    if (!seasonData) {
      notFound()
    }

    return (
      <HydrateClient>
        <div className="min-h-screen bg-black">
          <Container>
            <div className="py-4">
              <Breadcrumbs
                items={[
                  { name: 'South Park', href: '/gallery' },
                  { name: `Сезон ${seasonNumber}`, href: `/south-park/season-${seasonNumber}` },
                ]}
              />
            </div>
            
            <SeasonDetails seasonId={seasonData.id} />
          </Container>
        </div>
      </HydrateClient>
    )
  } catch (error) {
    console.error('Error loading season:', error)
    notFound()
  }
}
