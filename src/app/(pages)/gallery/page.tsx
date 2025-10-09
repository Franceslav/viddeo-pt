import { ErrorBoundary } from "react-error-boundary"
import { Suspense } from "react"
import Image from "next/image"
import { Metadata } from "next"

import { SeasonsList } from "./_components/seasons-list"
import { HydrateClient } from "@/app/server/routers/_app"
import SuggestedVideos from "./video/_components/suggested-videos"
import JsonLd from "@/components/seo/JsonLD"
import Breadcrumbs from "@/components/breadcrumbs"


export const metadata: Metadata = {
  title: "Галерея Южного парка | Все сезоны и эпизоды онлайн",
  description: "Просматривайте все сезоны и эпизоды Южного парка в нашей галерее. Удобная навигация по сезонам, поиск любимых эпизодов. Смотрите онлайн бесплатно в хорошем качестве.",
  keywords: "галерея южного парка, сезоны, эпизоды, навигация, просмотр, смотреть онлайн, бесплатно, hd качество",
  openGraph: {
    title: "Галерея Южного парка | Все сезоны и эпизоды онлайн",
    description: "Просматривайте все сезоны и эпизоды Южного парка в нашей галерее. Удобная навигация по сезонам, поиск любимых эпизодов.",
    type: "website",
    images: [{
      url: "/assets/hero.png",
      width: 1200,
      height: 630,
      alt: "Галерея Южного парка - все сезоны и эпизоды"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Галерея Южного парка | Все сезоны и эпизоды онлайн",
    description: "Просматривайте все сезоны и эпизоды Южного парка в нашей галерее. Удобная навигация по сезонам, поиск любимых эпизодов.",
    images: ["/assets/hero.png"]
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://southpark-online.ru'}/gallery`
  }
}

const Gallery = () => {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://southpark-online.ru"
  const pageUrl = `${baseUrl}/gallery`

  // WebPage / CollectionPage — описываем страницу галереи
  const pageSchema = {
    "@context": "https://schema.org",
    "@type": ["WebPage", "CollectionPage"],
    "name": "Галерея Южного парка — все сезоны и эпизоды",
    "description": "Просматривайте все сезоны и эпизоды Южного парка в нашей галерее. Удобная навигация по сезонам, поиск любимых эпизодов.",
    "url": pageUrl,
    "isPartOf": {
      "@type": "WebSite",
      "name": "Южный парк онлайн",
      "url": baseUrl
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${baseUrl}/gallery?query={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  }

  // Хлебные крошки: Главная → Галерея
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Главная", "item": baseUrl },
      { "@type": "ListItem", "position": 2, "name": "Галерея", "item": pageUrl }
    ]
  }

  return (
      <HydrateClient>
        {/* JSON-LD */}
        <JsonLd data={pageSchema} />
        <JsonLd data={breadcrumbSchema} />

        <div className="w-full bg-black relative overflow-hidden">
          {/* Персонажи по периферии окружности */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Kyle - верхний левый */}
            <div className="absolute top-8 left-8 w-24 h-24 transform -rotate-12 hover:rotate-0 transition-transform duration-500">
              <Image
                  src="/assets/Kyle-broflovski.webp"
                  alt="Кайл Брофловски - персонаж Южного парка"
                  width={96}
                  height={96}
                  className="w-full h-full object-contain drop-shadow-lg"
                  loading="lazy"
                  priority={false}
              />
            </div>

            {/* Cartman - верхний правый */}
            <div className="absolute top-8 right-8 w-24 h-24 transform rotate-12 hover:rotate-0 transition-transform duration-500">
              <Image
                  src="/assets/Eric-cartman.webp"
                  alt="Эрик Картман - персонаж Южного парка"
                  width={96}
                  height={96}
                  className="w-full h-full object-contain drop-shadow-lg"
                  loading="lazy"
                  priority={false}
              />
            </div>

            {/* Stan - нижний левый */}
            <div className="absolute bottom-8 left-8 w-24 h-24 transform rotate-12 hover:rotate-0 transition-transform duration-500">
              <Image
                  src="/assets/Stan-marsh-0.webp"
                  alt="Стэн Марш - персонаж Южного парка"
                  width={96}
                  height={96}
                  className="w-full h-full object-contain drop-shadow-lg"
                  loading="lazy"
                  priority={false}
              />
            </div>

            {/* Kenny - нижний правый */}
            <div className="absolute bottom-8 right-8 w-24 h-24 transform -rotate-12 hover:rotate-0 transition-transform duration-500">
              <Image
                  src="/assets/KennyMcCormick.webp"
                  alt="Кенни Маккормик - персонаж Южного парка"
                  width={96}
                  height={96}
                  className="w-full h-full object-contain drop-shadow-lg"
                  loading="lazy"
                  priority={false}
              />
            </div>

            {/* Дополнительные персонажи по бокам */}
            <div className="absolute top-1/2 left-4 w-20 h-20 transform -translate-y-1/2 -rotate-90 hover:rotate-0 transition-transform duration-500">
              <Image
                  src="/assets/Chef.png"
                  alt="Шеф - персонаж Южного парка"
                  width={80}
                  height={80}
                  className="w-full h-full object-contain drop-shadow-lg opacity-70"
                  loading="lazy"
                  priority={false}
              />
            </div>

            <div className="absolute top-1/2 right-4 w-24 h-24 transform -translate-y-1/2 rotate-90 hover:rotate-0 transition-transform duration-500">
              <Image
                  src="/assets/Randy_transparent_cockmagic.webp"
                  alt="Рэнди Марш - персонаж Южного парка"
                  width={96}
                  height={96}
                  className="w-full h-full object-contain drop-shadow-lg opacity-70"
                  loading="lazy"
                  priority={false}
              />
            </div>

            {/* Персонажи в центре по бокам */}
            <div className="absolute top-1/4 left-1/4 w-16 h-16 transform -translate-x-1/2 -translate-y-1/2 -rotate-45 hover:rotate-0 transition-transform duration-500">
              <Image
                  src="/assets/ButtersStotch.webp"
                  alt="Баттерс Стотч - персонаж Южного парка"
                  width={64}
                  height={64}
                  className="w-full h-full object-contain drop-shadow-lg opacity-60"
                  loading="lazy"
                  priority={false}
              />
            </div>

            <div className="absolute top-1/4 right-1/4 w-16 h-16 transform translate-x-1/2 -translate-y-1/2 rotate-45 hover:rotate-0 transition-transform duration-500">
              <Image
                  src="/assets/Token_Black2.webp"
                  alt="Токен Блэк - персонаж Южного парка"
                  width={64}
                  height={64}
                  className="w-full h-full object-contain drop-shadow-lg opacity-60"
                  loading="lazy"
                  priority={false}
              />
            </div>

            <div className="absolute bottom-1/4 right-1/4 w-16 h-16 transform translate-x-1/2 translate-y-1/2 -rotate-45 hover:rotate-0 transition-transform duration-500">
              <Image
                  src="/assets/Chef.png"
                  alt="Шеф - персонаж Южного парка"
                  width={64}
                  height={64}
                  className="w-full h-full object-contain drop-shadow-lg opacity-60"
                  loading="lazy"
                  priority={false}
              />
            </div>
          </div>

          {/* Контент поверх персонажей */}
          <div className="relative z-10">
            <div className="w-full">
              <div className="space-y-6 pt-8 px-4 md:px-8">
                <Breadcrumbs items={[{ name: "Галерея", href: "/gallery" }]} />
                <div className="text-center">
                  <h1 className="text-5xl md:text-6xl font-black text-white transform -rotate-1 hover:rotate-0 transition-transform duration-300 mb-4" style={{ textShadow: '3px 3px 0px #ff0000, 6px 6px 0px #000000' }}>
                    ГАЛЕРЕЯ
                  </h1>
                  <h2 className="text-2xl md:text-3xl font-bold text-yellow-400 mb-4">
                    Все сезоны Южного парка
                  </h2>
                  <p className="text-xl md:text-2xl font-bold text-black bg-yellow-300 p-4 rounded-lg border-2 border-black transform rotate-1 hover:rotate-0 transition-transform duration-300 inline-block" style={{ textShadow: '1px 1px 0px #000000' }}>
                    &quot;OH MY GOD! THEY KILLED KENNY!&quot; - Смотри все сезоны!
                  </p>
                </div>
              </div>

              <div className="w-full">
                <div className="flex flex-col lg:flex-row gap-8 px-4 md:px-8">
                  <div className="lg:w-2/3">
            <ErrorBoundary fallback={
              <div className="text-center text-white p-4">
                <h3 className="text-lg font-bold mb-2">Доступные сезоны Южного парка</h3>
                <p>Загружаем список сезонов...</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-bold">Сезон 1</h4>
                    <p className="text-sm">13 эпизодов</p>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-bold">Сезон 2</h4>
                    <p className="text-sm">18 эпизодов</p>
                  </div>
                </div>
              </div>
            }>
              <Suspense fallback={
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-gray-800 p-4 rounded-lg text-white">
                    <h3 className="font-bold mb-2">Сезон 1</h3>
                    <p className="text-sm">13 эпизодов</p>
                    <p className="text-xs mt-2">Загружаем...</p>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg text-white">
                    <h3 className="font-bold mb-2">Сезон 2</h3>
                    <p className="text-sm">18 эпизодов</p>
                    <p className="text-xs mt-2">Загружаем...</p>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg text-white">
                    <h3 className="font-bold mb-2">Сезон 3</h3>
                    <p className="text-sm">17 эпизодов</p>
                    <p className="text-xs mt-2">Загружаем...</p>
                  </div>
                </div>
              }>
                <SeasonsList />
              </Suspense>
            </ErrorBoundary>
                  </div>

                  <div className="lg:w-1/3">
            <ErrorBoundary fallback={
              <div className="text-white p-4 bg-gray-800 rounded-lg">
                <h3 className="font-bold mb-2">Рекомендуемые эпизоды</h3>
                <p className="text-sm">Загружаем рекомендации...</p>
              </div>
            }>
              <Suspense fallback={
                <div className="space-y-4">
                  <div className="bg-gray-800 p-4 rounded-lg text-white">
                    <h3 className="font-bold mb-2">Рекомендуемые эпизоды</h3>
                    <div className="space-y-2">
                      <div className="bg-gray-700 p-2 rounded text-sm">Загружаем популярные эпизоды...</div>
                      <div className="bg-gray-700 p-2 rounded text-sm">Загружаем новые серии...</div>
                    </div>
                  </div>
                </div>
              }>
                <SuggestedVideos />
              </Suspense>
            </ErrorBoundary>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </HydrateClient>
  )
}

export default Gallery
