import { notFound } from 'next/navigation'
import { ErrorBoundary } from "react-error-boundary"
import { Suspense } from "react"

import { SeasonDetails, SeasonDetailsLoading } from "./_components/season-details"
import { Button } from "@/components/ui/button"
import { HydrateClient } from "@/app/server/routers/_app"
import { trpc } from '@/app/server/routers/_app'

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
