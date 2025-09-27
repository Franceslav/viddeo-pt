import { notFound } from 'next/navigation'
import { ErrorBoundary } from "react-error-boundary"
import { Suspense } from "react"
import { Metadata } from 'next'

import { SeasonDetails, SeasonDetailsLoading } from "./_components/season-details"
import { Button } from "@/components/ui/button"
import { HydrateClient } from "@/app/server/routers/_app"
import { trpc } from '@/app/server/routers/_app'
import Breadcrumbs from "@/components/breadcrumbs"

export async function generateMetadata({ params }: SeasonPageProps): Promise<Metadata> {
  const { id } = await params
  
  try {
    const season = await trpc.season.getSeason({ id })
    
    return {
      title: `${season.title} | Южный парк онлайн - Сезон ${season.seasonNumber}`,
      description: season.description || `Смотрите все эпизоды ${season.title} Южного парка онлайн бесплатно в хорошем качестве. Сезон ${season.seasonNumber} с ${season.episodes.length} эпизодами. Полная коллекция сезона с русской озвучкой.`,
      keywords: `южный парк, ${season.title}, сезон ${season.seasonNumber}, смотреть онлайн, эпизоды, бесплатно, hd качество, русская озвучка`,
      openGraph: {
        title: `${season.title} | Южный парк онлайн - Сезон ${season.seasonNumber}`,
        description: season.description || `Смотрите все эпизоды ${season.title} Южного парка онлайн бесплатно в хорошем качестве. Сезон ${season.seasonNumber} с ${season.episodes.length} эпизодами.`,
        type: "website",
        images: season.image ? [{
          url: season.image,
          width: 1200,
          height: 630,
          alt: `${season.title} - Сезон ${season.seasonNumber}`
        }] : [{
          url: "/assets/hero.png",
          width: 1200,
          height: 630,
          alt: `${season.title} - Сезон ${season.seasonNumber}`
        }],
      },
      twitter: {
        card: "summary_large_image",
        title: `${season.title} | Южный парк онлайн - Сезон ${season.seasonNumber}`,
        description: season.description || `Смотрите все эпизоды ${season.title} Южного парка онлайн бесплатно в хорошем качестве. Сезон ${season.seasonNumber} с ${season.episodes.length} эпизодами.`,
        images: season.image ? [season.image] : ["/assets/hero.png"],
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://viddeo-pt-sp.vercel.app'}/gallery/season/${id}`
      }
    }
  } catch {
    return {
      title: "Сезон не найден | Южный парк онлайн",
      description: "Запрашиваемый сезон Южного парка не найден."
    }
  }
}

interface SeasonPageProps {
  params: Promise<{ id: string }>
}

const SeasonPage = async ({ params }: SeasonPageProps) => {
  const { id } = await params
  
  // Проверяем, существует ли сезон
  let season
  try {
    season = await trpc.season.getSeason({ id })
  } catch {
    notFound()
  }

  if (!season) {
    notFound()
  }

  return (
    <HydrateClient>
      <div className="min-h-screen bg-black w-full">
        <div className="w-full px-4 md:px-8 py-8">
          <div className="space-y-6">
            <Breadcrumbs items={[
              { name: "Галерея", href: "/gallery" },
              { name: season.title, href: `/gallery/season/${id}` }
            ]} />
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" asChild className="bg-gray-800 border-yellow-400 text-white hover:bg-gray-700">
                <a href="/gallery">← Назад к галерее</a>
              </Button>
            </div>

            <ErrorBoundary fallback={<div className="text-white">Something went wrong</div>}>
              <Suspense fallback={<SeasonDetailsLoading />}>
                <SeasonDetails seasonId={id} />
              </Suspense>
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </HydrateClient>
  )
}

export default SeasonPage
