import { ErrorBoundary } from "react-error-boundary"
import { Suspense } from "react"
import { Metadata } from "next"

import { SeasonsList } from "../gallery/_components/seasons-list"
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
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://southpark-online.ru'}/south-park`
  }
}

const SouthParkPage = () => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://southpark-online.ru"
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

            <ErrorBoundary fallback={
              <div className="text-center text-white p-4">
                <h3 className="text-lg font-bold mb-2">South Park Seasons Available</h3>
                <p>Loading seasons list...</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-bold">Season 1</h4>
                    <p className="text-sm">13 episodes</p>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-bold">Season 2</h4>
                    <p className="text-sm">18 episodes</p>
                  </div>
                </div>
              </div>
            }>
              <Suspense fallback={
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-gray-800 p-4 rounded-lg text-white">
                    <h3 className="font-bold mb-2">Season 1</h3>
                    <p className="text-sm">13 episodes</p>
                    <p className="text-xs mt-2">Loading...</p>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg text-white">
                    <h3 className="font-bold mb-2">Season 2</h3>
                    <p className="text-sm">18 episodes</p>
                    <p className="text-xs mt-2">Loading...</p>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg text-white">
                    <h3 className="font-bold mb-2">Season 3</h3>
                    <p className="text-sm">17 episodes</p>
                    <p className="text-xs mt-2">Loading...</p>
                  </div>
                </div>
              }>
                <SeasonsList />
              </Suspense>
            </ErrorBoundary>

            <ErrorBoundary fallback={
              <div className="text-white p-4 bg-gray-800 rounded-lg">
                <h3 className="font-bold mb-2">Suggested Episodes</h3>
                <p className="text-sm">Loading recommendations...</p>
              </div>
            }>
              <Suspense fallback={
                <div className="space-y-4">
                  <div className="bg-gray-800 p-4 rounded-lg text-white">
                    <h3 className="font-bold mb-2">Popular Episodes</h3>
                    <div className="space-y-2">
                      <div className="bg-gray-700 p-2 rounded text-sm">Loading popular episodes...</div>
                      <div className="bg-gray-700 p-2 rounded text-sm">Loading new episodes...</div>
                    </div>
                  </div>
                </div>
              }>
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
