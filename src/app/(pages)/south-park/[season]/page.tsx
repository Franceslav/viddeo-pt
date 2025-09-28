import { notFound } from 'next/navigation'
import { ErrorBoundary } from "react-error-boundary"
import { Suspense } from "react"
import { Metadata } from 'next'

import { SeasonDetails, SeasonDetailsLoading } from "../../gallery/season/[id]/_components/season-details"
import { HydrateClient } from "@/app/server/routers/_app"
import { trpc } from '@/app/server/routers/_app'
import Breadcrumbs from "@/components/breadcrumbs"

export async function generateMetadata({ params }: SeasonPageProps): Promise<Metadata> {
  const { season } = await params
  const seasonNumber = parseInt(season.replace('season-', ''))
  
  try {
    const seasonData = await trpc.season.getSeasonByNumber({ seasonNumber })
    
    return {
      title: `South Park Season ${seasonData.seasonNumber} | ${seasonData.title} - Watch Online Free`,
      description: `Watch all episodes of South Park Season ${seasonData.seasonNumber} online free in HD quality. ${seasonData.episodes.length} episodes available with Russian dubbing and subtitles.`,
      keywords: `south park, season ${seasonData.seasonNumber}, ${seasonData.title}, watch online, free, hd quality, russian dubbing, episodes`,
      openGraph: {
        title: `South Park Season ${seasonData.seasonNumber} | ${seasonData.title} - Watch Online Free`,
        description: `Watch all episodes of South Park Season ${seasonData.seasonNumber} online free in HD quality. ${seasonData.episodes.length} episodes available.`,
        type: "website",
        images: seasonData.image ? [{
          url: seasonData.image,
          width: 1200,
          height: 630,
          alt: `South Park Season ${seasonData.seasonNumber} - ${seasonData.title}`
        }] : [{
          url: "/assets/hero.png",
          width: 1200,
          height: 630,
          alt: `South Park Season ${seasonData.seasonNumber}`
        }],
      },
      twitter: {
        card: "summary_large_image",
        title: `South Park Season ${seasonData.seasonNumber} | ${seasonData.title} - Watch Online Free`,
        description: `Watch all episodes of South Park Season ${seasonData.seasonNumber} online free in HD quality. ${seasonData.episodes.length} episodes available.`,
        images: seasonData.image ? [seasonData.image] : ["/assets/hero.png"],
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://viddeo-pt-sp.vercel.app'}/south-park/${season}`
      }
    }
  } catch {
    return {
      title: "South Park Season Not Found | Watch Online Free",
      description: "The requested South Park season was not found."
    }
  }
}

interface SeasonPageProps {
  params: Promise<{ season: string }>
}

const SeasonPage = async ({ params }: SeasonPageProps) => {
  const { season } = await params
  const seasonNumber = parseInt(season.replace('season-', ''))
  
  // Находим сезон по номеру
  let seasonData
  try {
    seasonData = await trpc.season.getSeasonByNumber({ seasonNumber })
  } catch (error) {
    console.error('Error fetching season:', error)
    notFound()
  }

  return (
    <HydrateClient>
      <div className="min-h-screen w-full bg-black">
        <div className="w-full px-3 sm:px-4 py-4 sm:py-6 lg:py-8">
          <Breadcrumbs
            items={[
              { name: "South Park", href: "/south-park" },
              { name: `Season ${seasonData.seasonNumber}`, href: `/south-park/${season}` }
            ]}
          />
          <ErrorBoundary fallback={<div className="text-white text-center p-4">Ошибка загрузки деталей сезона</div>}>
            <Suspense fallback={<SeasonDetailsLoading />}>
              <SeasonDetails seasonId={seasonData.id} />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </HydrateClient>
  )
}

export default SeasonPage
