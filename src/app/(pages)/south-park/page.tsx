import { ErrorBoundary } from "react-error-boundary"
import { Suspense } from "react"
import { Metadata } from "next"

import { SeasonsList, SeasonsListLoading } from "../gallery/_components/seasons-list"
import { HydrateClient } from "@/app/server/routers/_app"
import SuggestedVideos from "../gallery/video/_components/suggested-videos"
import JsonLd from "@/components/seo/JsonLD"
import Breadcrumbs from "@/components/breadcrumbs"

export const metadata: Metadata = {
  title: "South Park | All Seasons and Episodes - Watch Online Free",
  description: "Watch all South Park seasons and episodes online free in HD quality. Complete collection with Russian dubbing and subtitles. No registration required.",
  keywords: "south park, watch online, free, hd quality, russian dubbing, seasons, episodes, complete collection",
  openGraph: {
    title: "South Park | All Seasons and Episodes - Watch Online Free",
    description: "Watch all South Park seasons and episodes online free in HD quality. Complete collection with Russian dubbing and subtitles.",
    type: "website",
    images: [{
      url: "/assets/hero.png",
      width: 1200,
      height: 630,
      alt: "South Park - All Seasons and Episodes"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "South Park | All Seasons and Episodes - Watch Online Free",
    description: "Watch all South Park seasons and episodes online free in HD quality. Complete collection with Russian dubbing and subtitles.",
    images: ["/assets/hero.png"]
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://viddeo-pt-sp.vercel.app'}/south-park`
  }
}

const SouthParkPage = () => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  const pageUrl = `${baseUrl}/south-park`

  // TVSeries schema
  const tvSeriesSchema = {
    "@context": "https://schema.org",
    "@type": "TVSeries",
    "name": "South Park",
    "alternateName": "Южный парк",
    "description": "South Park is an American animated sitcom created by Trey Parker and Matt Stone for Comedy Central. The series follows the exploits of four boys—Stan Marsh, Kyle Broflovski, Eric Cartman, and Kenny McCormick—and their adventures in and around the titular Colorado town.",
    "url": pageUrl,
    "image": `${baseUrl}/assets/hero.png`,
    "genre": ["Animation", "Comedy", "Satire"],
    "inLanguage": ["en", "ru"],
    "countryOfOrigin": "US",
    "creator": [
      {
        "@type": "Person",
        "name": "Trey Parker"
      },
      {
        "@type": "Person", 
        "name": "Matt Stone"
      }
    ],
    "publisher": {
      "@type": "Organization",
      "name": "Comedy Central"
    },
    "potentialAction": {
      "@type": "WatchAction",
      "target": pageUrl
    }
  }

  return (
    <HydrateClient>
      <div className="min-h-screen w-full bg-black">
        <div className="w-full px-4 py-8">
          <div className="space-y-8">
            <Breadcrumbs items={[
              { name: "South Park", href: "/south-park" }
            ]} />

            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-6xl font-black text-white" style={{ textShadow: '3px 3px 0px #ff0000, 6px 6px 0px #000000' }}>
                SOUTH PARK
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Watch all seasons and episodes of South Park online free in HD quality with Russian dubbing and subtitles.
              </p>
            </div>

            <ErrorBoundary fallback={<div className="text-white">Something went wrong loading seasons</div>}>
              <Suspense fallback={<SeasonsListLoading />}>
                <SeasonsList />
              </Suspense>
            </ErrorBoundary>

            <ErrorBoundary fallback={<div className="text-white">Something went wrong loading suggested videos</div>}>
              <Suspense fallback={<div className="text-white">Loading suggested videos...</div>}>
                <SuggestedVideos />
              </Suspense>
            </ErrorBoundary>
          </div>
        </div>

        <JsonLd data={tvSeriesSchema} />
      </div>
    </HydrateClient>
  )
}

export default SouthParkPage
