import Link from "next/link"
import Image from "next/image"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { Metadata } from "next"

import { buttonVariants } from "@/components/ui/button"

import { cn } from "@/lib/utils"
import Container from "@/components/container"
import { SeasonsList, SeasonsListLoading } from "./(pages)/gallery/_components/seasons-list"
import { HydrateClient } from "@/app/server/routers/_app"
import FAQSection from "@/components/faq-section"

export const metadata: Metadata = {
  title: "Южный парк онлайн | Смотреть все серии бесплатно в хорошем качестве",
  description: "Смотрите все серии Южного парка онлайн бесплатно в хорошем качестве. Все сезоны от 1 до последнего. Приключения Стэна, Кайла, Картмана и Кенни в вымышленном городе Южный парк. Полная коллекция эпизодов с русской озвучкой.",
  keywords: "южный парк, south park, смотреть онлайн, все серии, бесплатно, хорошее качество, анимация, комедия, стэн марш, кайл брофловски, эрик картман, кенни маккормик, русская озвучка, hd качество",
  openGraph: {
    title: "Южный парк онлайн | Смотреть все серии бесплатно",
    description: "Смотрите все серии Южного парка онлайн бесплатно в хорошем качестве. Все сезоны от 1 до последнего. Приключения Стэна, Кайла, Картмана и Кенни в вымышленном городе Южный парк.",
    type: "website",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    siteName: "Южный парк онлайн",
    images: [{
      url: "/assets/hero.png",
      width: 1200,
      height: 630,
      alt: "Южный парк онлайн - смотреть все серии"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Южный парк онлайн | Смотреть все серии бесплатно",
    description: "Смотрите все серии Южного парка онлайн бесплатно в хорошем качестве. Все сезоны от 1 до последнего.",
    images: ["/assets/hero.png"]
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  }
}


const Home = () => {
  // Структурированные данные для SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TVSeries",
    "name": "Южный парк",
    "alternateName": "South Park",
    "description": "Культовый американский анимационный сериал о приключениях четырех друзей в вымышленном городе Южный парк",
    "genre": ["Анимация", "Комедия", "Сатира"],
    "inLanguage": "ru",
    "creator": [
      {
        "@type": "Person",
        "name": "Трей Паркер"
      },
      {
        "@type": "Person", 
        "name": "Мэтт Стоун"
      }
    ],
    "actor": [
      {
        "@type": "Person",
        "name": "Стэн Марш",
        "characterName": "Стэн Марш"
      },
      {
        "@type": "Person",
        "name": "Кайл Брофловски", 
        "characterName": "Кайл Брофловски"
      },
      {
        "@type": "Person",
        "name": "Эрик Картман",
        "characterName": "Эрик Картман"
      },
      {
        "@type": "Person",
        "name": "Кенни Маккормик",
        "characterName": "Кенни Маккормик"
      }
    ],
    "publisher": {
      "@type": "Organization",
      "name": "Comedy Central"
    },
    "dateCreated": "1997-08-13",
    "url": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    "image": "/assets/hero.png",
    "sameAs": [
      "https://www.southpark.com/",
      "https://www.comedycentral.com/shows/south-park"
    ]
  }

  return (
    <HydrateClient>
      {/* Структурированные данные */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="flex-1 min-h-screen bg-black relative overflow-hidden">
        {/* Персонажи по периферии окружности - скрыты на мобильных */}
        <div className="absolute inset-0 pointer-events-none hidden sm:block">
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

        {/* Мобильные персонажи - только основные */}
        <div className="absolute inset-0 pointer-events-none sm:hidden">
          {/* Kyle - верхний левый */}
          <div className="absolute top-4 left-4 w-16 h-16 transform -rotate-12">
            <Image 
              src="/assets/Kyle-broflovski.webp" 
              alt="Кайл Брофловски" 
              width={64}
              height={64}
              className="w-full h-full object-contain drop-shadow-lg"
              loading="lazy"
              priority={false}
            />
          </div>
          
          {/* Cartman - верхний правый */}
          <div className="absolute top-4 right-4 w-16 h-16 transform rotate-12">
            <Image 
              src="/assets/Eric-cartman.webp"
              alt="Эрик Картман" 
              width={64}
              height={64}
              className="w-full h-full object-contain drop-shadow-lg"
              loading="lazy"
              priority={false}
            />
          </div>
          
          {/* Stan - нижний левый */}
          <div className="absolute bottom-4 left-4 w-16 h-16 transform rotate-12">
            <Image 
              src="/assets/Stan-marsh-0.webp"
              alt="Стэн Марш" 
              width={64}
              height={64}
              className="w-full h-full object-contain drop-shadow-lg"
              loading="lazy"
              priority={false}
            />
          </div>
          
          {/* Kenny - нижний правый */}
          <div className="absolute bottom-4 right-4 w-16 h-16 transform -rotate-12">
            <Image 
              src="/assets/KennyMcCormick.webp"
              alt="Кенни Маккормик" 
              width={64}
              height={64}
              className="w-full h-full object-contain drop-shadow-lg"
              loading="lazy"
              priority={false}
            />
          </div>
        </div>
        {/* Контент поверх персонажей */}
        <div className="relative z-10">
        <Container>
          <main className="flex flex-col items-center px-4 py-8 sm:py-16">
            <div className="w-full flex items-center justify-center">
              <div className="max-w-sm sm:max-w-md md:max-w-xl flex flex-col items-center gap-4 sm:gap-6">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-center text-white transform -rotate-1 hover:rotate-0 transition-transform duration-300 leading-tight" style={{ textShadow: '2px 2px 0px #ff0000, 4px 4px 0px #000000, 6px 6px 0px rgba(0,0,0,0.8)' }}>
                  WATCH AND <span className="text-yellow-400" style={{ textShadow: '2px 2px 0px #ff0000, 4px 4px 0px #000000, 6px 6px 0px rgba(0,0,0,0.8)' }}>SCREAM</span> LIKE CARTMAN!
                </h1>
                         <Link href='/south-park' className={cn("w-full max-w-44 sm:max-w-48 font-black text-base sm:text-lg py-3 sm:py-4 px-6 sm:px-8 bg-red-500 hover:bg-red-600 text-white border-3 sm:border-4 border-black rounded-lg transform hover:scale-105 transition-all duration-300 shadow-lg", buttonVariants({ variant: "default" }))} style={{ textShadow: '1px 1px 0px #000000' }}>
                           <span>СМОТРЕТЬ ЮЖНЫЙ ПАРК!</span>
                         </Link>
              </div>
            </div>
          </main>
          
          <div className="mt-8 sm:mt-12 space-y-4 sm:space-y-6">
            {/* Описание сайта - теперь первое */}
            
            {/* Список сезонов - теперь второе */}
            <div className="text-center px-2">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-3 sm:mb-4 text-white transform -rotate-1" style={{ textShadow: '2px 2px 0px #ff0000, 4px 4px 0px #000000, 6px 6px 0px rgba(0,0,0,0.8)' }}>
                ЛУЧШИЕ СЕЗОНЫ ЮЖНОГО ПАРКА!
              </h2>
              <p className="text-lg sm:text-xl font-bold text-white bg-yellow-400 bg-opacity-90 p-2 sm:p-3 rounded-lg border-2 border-black inline-block transform rotate-1 hover:rotate-0 transition-transform duration-300" style={{ textShadow: '1px 1px 0px #000000' }}>
                &quot;OH MY GOD! THEY KILLED KENNY!&quot; - Смотри все сезоны!
              </p>
            </div>
            
            <ErrorBoundary fallback={<div>Something went wrong loading seasons</div>}>
              <Suspense fallback={<SeasonsListLoading />}>
                <SeasonsList />
              </Suspense>
            </ErrorBoundary>
          </div>
        </Container>
        </div>

        <div className="text-center mt-8 sm:mt-12 px-4">
              <div className="max-w-2xl mx-auto">
                <div className="bg-gray-900 bg-opacity-80 p-4 sm:p-6 rounded-lg border-2 border-yellow-400 text-left">
                  <h3 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-3 sm:mb-4">О Южном парке</h3>
                  <p className="text-white text-base sm:text-lg leading-relaxed mb-3 sm:mb-4">
                    <strong>Южный парк</strong> — культовый американский анимационный сериал, созданный Треем Паркером и Мэттом Стоуном. 
                    История рассказывает о приключениях четырех друзей: <strong>Стэна Марша</strong>, <strong>Кайла Брофловски</strong>, 
                    <strong>Эрика Картмана</strong> и <strong>Кенни Маккормика</strong> в вымышленном городе Южный парк, штат Колорадо.
                  </p>
                  <p className="text-white text-base sm:text-lg leading-relaxed mb-3 sm:mb-4">
                    Сериал известен своей сатирой, черным юмором и критикой социальных проблем. Каждый эпизод — это уникальная история, 
                    которая заставляет задуматься и одновременно смеяться. От политических тем до поп-культуры — 
                    <strong>Южный парк</strong> не оставляет равнодушным никого.
                  </p>
                  <p className="text-white text-base sm:text-lg leading-relaxed">
                    На нашем сайте вы можете <strong>смотреть все серии Южного парка онлайн бесплатно</strong> в хорошем качестве. 
                    Полная коллекция всех сезонов с русской озвучкой и субтитрами. Присоединяйтесь к приключениям наших любимых героев!
                  </p>
                </div>
              </div>
            </div>
        
        {/* FAQ Section */}
        <FAQSection 
          faqs={[
            {
              question: "Можно ли смотреть Южный парк бесплатно?",
              answer: "Да, на нашем сайте вы можете смотреть все серии Южного парка абсолютно бесплатно в хорошем качестве. Никаких подписок или регистрации не требуется."
            },
            {
              question: "Есть ли русская озвучка?",
              answer: "Да, все эпизоды доступны с русской озвучкой и субтитрами. Вы можете выбрать удобный для вас вариант просмотра."
            },
            {
              question: "Сколько сезонов Южного парка доступно?",
              answer: "На нашем сайте доступны все сезоны Южного парка от первого до последнего. Мы регулярно обновляем коллекцию новыми эпизодами."
            },
            {
              question: "В каком качестве доступны серии?",
              answer: "Все серии доступны в HD качестве. Мы заботимся о том, чтобы наши зрители получали лучший опыт просмотра."
            },
            {
              question: "Можно ли скачать серии?",
              answer: "Наш сайт предназначен для онлайн-просмотра. Скачивание контента не предусмотрено, но вы можете смотреть серии в любое время на нашем сайте."
            }
          ]}
        />
      </div>
    </HydrateClient>
  )
}

export default Home