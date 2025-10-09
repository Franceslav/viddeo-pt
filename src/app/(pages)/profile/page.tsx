import { ErrorBoundary } from "react-error-boundary"
import { Suspense } from "react"
import { SessionProvider } from 'next-auth/react'
import { Metadata } from "next"

import { ProfileContent } from "./_components/profile-content"
import { HydrateClient } from "@/app/server/routers/_app"

export const metadata: Metadata = {
  title: "Профиль пользователя | Южный парк онлайн",
  description: "Управляйте своим профилем, просматривайте историю просмотров и статистику на сайте Южного парка онлайн.",
  keywords: "профиль пользователя, статистика просмотров, история, южный парк онлайн",
  openGraph: {
    title: "Профиль пользователя | Южный парк онлайн",
    description: "Управляйте своим профилем, просматривайте историю просмотров и статистику на сайте Южного парка онлайн.",
    type: "website",
    images: [{
      url: "/assets/hero.png",
      width: 1200,
      height: 630,
      alt: "Профиль пользователя Южного парка"
    }]
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://southpark-online.ru'}/profile`
  }
}

function ProfilePage() {
  return (
    <HydrateClient>
      <div className="min-h-screen bg-black w-full">
        <div className="w-full px-4 md:px-8">
          <div className="space-y-6 pt-8">
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-black text-white transform -rotate-1 hover:rotate-0 transition-transform duration-300 mb-4" style={{ textShadow: '3px 3px 0px #ff0000, 6px 6px 0px #000000' }}>
                ПРОФИЛЬ
              </h1>
              <p className="text-xl md:text-2xl font-bold text-black bg-yellow-300 p-4 rounded-lg border-2 border-black transform rotate-1 hover:rotate-0 transition-transform duration-300 inline-block" style={{ textShadow: '1px 1px 0px #000000' }}>
                &quot;RESPECT MY AUTHORITAH!&quot; - Управляй своим профилем!
              </p>
            </div>

            <SessionProvider>
              <ErrorBoundary fallback={
                <div className="text-center text-white p-4">
                  <h3 className="text-lg font-bold mb-2">Профиль пользователя</h3>
                  <p>Загружаем данные профиля...</p>
                  <div className="bg-gray-800 p-4 rounded-lg mt-4">
                    <p className="text-sm">Произошла ошибка при загрузке профиля</p>
                  </div>
                </div>
              }>
                <Suspense fallback={
                  <div className="space-y-4">
                    <div className="bg-gray-800 p-4 rounded-lg text-white">
                      <h3 className="font-bold mb-2">Профиль пользователя</h3>
                      <div className="space-y-2">
                        <div className="bg-gray-700 p-2 rounded text-sm">Загружаем информацию о пользователе...</div>
                        <div className="bg-gray-700 p-2 rounded text-sm">Загружаем статистику просмотров...</div>
                        <div className="bg-gray-700 p-2 rounded text-sm">Загружаем комментарии...</div>
                      </div>
                    </div>
                  </div>
                }>
                  <ProfileContent />
                </Suspense>
              </ErrorBoundary>
            </SessionProvider>
          </div>
        </div>
      </div>
    </HydrateClient>
  )
}

export default ProfilePage
