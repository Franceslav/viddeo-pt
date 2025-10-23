import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Star, Eye, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import Breadcrumbs from "@/components/breadcrumbs"

export const metadata: Metadata = {
  title: "Лучшие серии Южного парка | Топ эпизодов всех времен - смотреть онлайн",
  description: "Лучшие серии Южного парка всех времен: топ эпизодов, рейтинговые серии, популярные выпуски. Смотрите лучшие серии Южного парка онлайн бесплатно в хорошем качестве на русском языке.",
  keywords: "лучшие серии южного парка, топ серий южного парка, рейтинговые эпизоды, популярные серии, лучшие выпуски южного парка, топ эпизодов, южный парк лучшие серии смотреть онлайн",
  openGraph: {
    title: "Лучшие серии Южного парка | Топ эпизодов всех времен - смотреть онлайн",
    description: "Лучшие серии Южного парка всех времен: топ эпизодов, рейтинговые серии, популярные выпуски. Смотрите лучшие серии Южного парка онлайн бесплатно в хорошем качестве на русском языке.",
    type: "website",
    images: [{
      url: "/assets/hero.png",
      width: 1200,
      height: 630,
      alt: "Лучшие серии Южного парка"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Лучшие серии Южного парка | Топ эпизодов всех времен",
    description: "Лучшие серии Южного парка всех времен: топ эпизодов, рейтинговые серии, популярные выпуски.",
    images: ["/assets/hero.png"]
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://southpark-online.ru'}/luchshie-serii`
  }
}

const BestEpisodesPage = () => {
  const topEpisodes = [
    {
      title: "Скотт Тенорман должен умереть",
      season: 5,
      episode: 4,
      description: "Картман заставляет Скотта Тенормана съесть его собственных родителей.",
      rating: 9.8,
      views: "2.5M",
      year: 2001,
      image: "/assets/Chef.png"
    },
    {
      title: "Сделай любовь, а не Warcraft",
      season: 10,
      episode: 8,
      description: "Мальчики играют в World of Warcraft и становятся зависимыми от игры.",
      rating: 9.6,
      views: "2.1M",
      year: 2006,
      image: "/assets/Stan-marsh-0.webp"
    },
    {
      title: "Возвращение Шефа",
      season: 9,
      episode: 1,
      description: "Шеф возвращается в Южный парк после того, как покинул его.",
      rating: 9.5,
      views: "1.9M",
      year: 2005,
      image: "/assets/ChefNoApron.PNG.webp"
    },
    {
      title: "Они убили Кенни",
      season: 1,
      episode: 1,
      description: "Первый эпизод, где Кенни умирает и становится легендой.",
      rating: 9.4,
      views: "3.2M",
      year: 1997,
      image: "/assets/KennyMcCormick.webp"
    },
    {
      title: "Большой длинный необрезанный",
      season: 9,
      episode: 12,
      description: "Эпизод про обрезание и религиозные конфликты.",
      rating: 9.3,
      views: "1.8M",
      year: 2005,
      image: "/assets/Kyle-broflovski.webp"
    },
    {
      title: "Воскресенье, грязное воскресенье",
      season: 7,
      episode: 7,
      description: "Мальчики участвуют в собачьих боях.",
      rating: 9.2,
      views: "1.7M",
      year: 2003,
      image: "/assets/Eric-cartman.webp"
    }
  ]

  return (
    <div className="min-h-screen bg-black w-full">
      <div className="w-full px-4 md:px-8">
        <div className="space-y-6 pt-8">
          <Breadcrumbs items={[
            { name: "Главная", href: "/" },
            { name: "Лучшие серии", href: "/luchshie-serii" }
          ]} />
          
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-black text-white transform -rotate-1 hover:rotate-0 transition-transform duration-300 mb-4" style={{ textShadow: '3px 3px 0px #ff0000, 6px 6px 0px #000000' }}>
              ЛУЧШИЕ СЕРИИ ЮЖНОГО ПАРКА
            </h1>
            
            <div className="bg-yellow-300 border-4 border-black rounded-lg p-6 max-w-6xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-black text-black mb-4" style={{ textShadow: '2px 2px 0px #ffffff' }}>
                🏆 ТОП ЭПИЗОДОВ ВСЕХ ВРЕМЕН
              </h2>
              <p className="text-lg md:text-xl text-black font-bold mb-6">
                Самые популярные и рейтинговые серии Южного парка по версии зрителей!
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topEpisodes.map((episode, index) => (
                  <div key={index} className="bg-white border-2 border-black rounded-lg overflow-hidden">
                    <div className="relative h-48 bg-gray-200">
                      <Image
                        src={episode.image}
                        alt={episode.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold border border-black">
                        #{index + 1}
                      </div>
                      <div className="absolute top-2 right-2 bg-yellow-400 text-black px-2 py-1 rounded text-sm font-bold border border-black flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        {episode.rating}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-black text-black text-lg mb-2 line-clamp-2">
                        {episode.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Сезон {episode.season}, Серия {episode.episode}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {episode.views}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                        {episode.description}
                      </p>
                      <Button 
                        className="w-full bg-red-500 hover:bg-red-600 text-white border-2 border-black font-bold"
                        data-analytics="watch_best_episode_button"
                        data-season={episode.season}
                        data-episode={episode.episode}
                        data-episode-title={episode.title}
                      >
                        Смотреть онлайн
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 bg-red-500 border-2 border-black rounded-lg p-4">
                <h3 className="text-white font-bold text-xl mb-2">
                  🎬 Что делает серию лучшей?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
                  <div>
                    <h4 className="font-bold mb-2">Критерии оценки:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Рейтинг зрителей (IMDb)</li>
                      <li>• Количество просмотров</li>
                      <li>• Культурное влияние</li>
                      <li>• Мемы и цитаты</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold mb-2">Популярные темы:</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Смерть Кенни</li>
                      <li>• Приключения Картмана</li>
                      <li>• Социальная сатира</li>
                      <li>• Поп-культурные пародии</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                <Button asChild className="bg-red-500 hover:bg-red-600 text-white border-2 border-black font-bold text-lg px-8 py-3">
                  <Link href="/">
                    🏠 На главную страницу
                  </Link>
                </Button>
                <Button asChild className="bg-yellow-400 hover:bg-yellow-300 text-black border-2 border-black font-bold text-lg px-8 py-3">
                  <Link href="/characters">
                    👥 Все персонажи
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BestEpisodesPage
