import { Metadata } from 'next'
import { SeasonsList } from '@/app/(pages)/gallery/_components/seasons-list'
import Breadcrumbs from '@/components/breadcrumbs'
import { HydrateClient } from "@/app/server/routers/_app"
import Container from '@/components/container'

export const metadata: Metadata = {
  title: "Южный Парк - все сезоны онлайн бесплатно в HD качестве",
  description: "Смотрите все сезоны Южного Парка онлайн бесплатно в хорошем качестве на русском языке. Все серии от 1 до 27 сезона в HD качестве с русской озвучкой. Полная коллекция эпизодов без регистрации.",
  keywords: "южный парк смотреть онлайн бесплатно в хорошем качестве на русском языке, южный парк смотреть, южный парк онлайн, южный парк бесплатно, южный парк все серии, южный парк русская озвучка, южный парк hd качество, south park online",
  openGraph: {
    title: "Южный Парк - все сезоны онлайн бесплатно в HD качестве",
    description: "Смотрите все сезоны Южного Парка онлайн бесплатно в хорошем качестве на русском языке. Все серии от 1 до 27 сезона в HD качестве с русской озвучкой.",
    type: "website",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://southpark-online.ru",
    siteName: "Южный парк онлайн",
    images: [{
      url: "/assets/hero.png",
      width: 1200,
      height: 630,
      alt: "Южный парк онлайн - смотреть все серии"
    }]
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://southpark-online.ru'}/south-park`
  }
}

export default async function SouthParkPage() {
  return (
    <HydrateClient>
      <div className="min-h-screen bg-black">
        <Container>
          <div className="py-4">
            <Breadcrumbs
              items={[
                { name: 'South Park', href: '/south-park' },
              ]}
            />
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black text-white mb-4">
              Южный Парк - все сезоны онлайн
            </h1>
            <p className="text-lg text-white mb-6">
              Смотрите все сезоны Южного Парка онлайн бесплатно в HD качестве с русской озвучкой
            </p>
          </div>
          
          <SeasonsList />
        </Container>
      </div>
    </HydrateClient>
  )
}
