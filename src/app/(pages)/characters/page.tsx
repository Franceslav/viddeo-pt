import { ErrorBoundary } from "react-error-boundary"
import { Suspense } from "react"
import { Metadata } from "next"

import { CharactersList } from "./_components/characters-list"
import { HydrateClient } from "@/app/server/routers/_app"
import Breadcrumbs from "@/components/breadcrumbs"

export const metadata: Metadata = {
  title: "Персонажи Южного парка | Все герои мультсериала с описаниями и фото",
  description: "Полный список персонажей Южного парка: Стэн Марш, Кайл Брофловски, Эрик Картман, Кенни Маккормик, Баттерс и другие герои. Биографии, характеристики и интересные факты о каждом персонаже.",
  keywords: "персонажи южного парка, стэн марш, кайл брофловски, эрик картман, кенни маккормик, баттерс, герои южного парка, все персонажи, биографии персонажей, описания героев",
  openGraph: {
    title: "Персонажи Южного парка | Все герои мультсериала с описаниями и фото",
    description: "Полный список персонажей Южного парка: Стэн Марш, Кайл Брофловски, Эрик Картман, Кенни Маккормик, Баттерс и другие герои. Биографии, характеристики и интересные факты о каждом персонаже.",
    type: "website",
    images: [{
      url: "/assets/hero.png",
      width: 1200,
      height: 630,
      alt: "Персонажи Южного парка"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Персонажи Южного парка | Стэн, Кайл, Картман, Кенни и другие герои",
    description: "Знакомьтесь с персонажами Южного парка: Стэн Марш, Кайл Брофловски, Эрик Картман, Кенни Маккормик и другие герои анимационного сериала.",
    images: ["/assets/hero.png"]
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://southpark-online.ru'}/characters`
  }
}

const CharactersPage = () => {

  return (
    <HydrateClient>
      <div className="min-h-screen bg-black w-full">
        <div className="w-full px-4 md:px-8">
          <div className="space-y-6 pt-8">
            <Breadcrumbs items={[{ name: "Персонажи", href: "/characters" }]} />
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-black text-white transform -rotate-1 hover:rotate-0 transition-transform duration-300 mb-4" style={{ textShadow: '3px 3px 0px #ff0000, 6px 6px 0px #000000' }}>
                ПЕРСОНАЖИ
              </h1>
              <h2 className="text-2xl md:text-3xl font-bold text-yellow-400 mb-4">
                Герои Южного парка
              </h2>
              <p className="text-xl md:text-2xl font-bold text-black bg-yellow-300 p-4 rounded-lg border-2 border-black transform rotate-1 hover:rotate-0 transition-transform duration-300 inline-block" style={{ textShadow: '1px 1px 0px #000000' }}>
                &quot;OH MY GOD! THEY KILLED KENNY!&quot; - Знакомьтесь с героями Южного парка!
              </p>
            </div>

            <ErrorBoundary fallback={
              <div className="text-center text-white p-4">
                <h3 className="text-lg font-bold mb-2">Персонажи Южного парка</h3>
                <p>Загружаем список персонажей...</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-bold">Стэн Марш</h4>
                    <p className="text-sm">Лидер группы друзей</p>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h4 className="font-bold">Кайл Брофловски</h4>
                    <p className="text-sm">Умный и рассудительный</p>
                  </div>
                </div>
              </div>
            }>
              <Suspense fallback={
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  <div className="bg-gray-800 p-4 rounded-lg text-white">
                    <h3 className="font-bold mb-2">Стэн Марш</h3>
                    <p className="text-sm">Лидер группы друзей</p>
                    <p className="text-xs mt-2">Загружаем...</p>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg text-white">
                    <h3 className="font-bold mb-2">Кайл Брофловски</h3>
                    <p className="text-sm">Умный и рассудительный</p>
                    <p className="text-xs mt-2">Загружаем...</p>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg text-white">
                    <h3 className="font-bold mb-2">Эрик Картман</h3>
                    <p className="text-sm">Толстый и эгоистичный</p>
                    <p className="text-xs mt-2">Загружаем...</p>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg text-white">
                    <h3 className="font-bold mb-2">Кенни Маккормик</h3>
                    <p className="text-sm">Загадочный мальчик</p>
                    <p className="text-xs mt-2">Загружаем...</p>
                  </div>
                </div>
              }>
                <CharactersList />
              </Suspense>
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </HydrateClient>
  )
}

export default CharactersPage
