import { ErrorBoundary } from "react-error-boundary"
import { Suspense } from "react"
import { Metadata } from "next"

import { CharactersList, CharactersListLoading } from "./_components/characters-list"
import { HydrateClient } from "@/app/server/routers/_app"
import Breadcrumbs from "@/components/breadcrumbs"

export const metadata: Metadata = {
  title: "Персонажи Южного парка | Стэн, Кайл, Картман, Кенни и другие герои",
  description: "Знакомьтесь с персонажами Южного парка: Стэн Марш, Кайл Брофловски, Эрик Картман, Кенни Маккормик и другие герои анимационного сериала. Подробные описания, фото и биографии персонажей.",
  keywords: "персонажи южного парка, стэн марш, кайл брофловски, эрик картман, кенни маккормик, герои, биографии, описания персонажей",
  openGraph: {
    title: "Персонажи Южного парка | Стэн, Кайл, Картман, Кенни и другие герои",
    description: "Знакомьтесь с персонажами Южного парка: Стэн Марш, Кайл Брофловски, Эрик Картман, Кенни Маккормик и другие герои анимационного сериала.",
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

            <ErrorBoundary fallback={<div>Something went wrong loading characters</div>}>
              <Suspense fallback={<CharactersListLoading />}>
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
