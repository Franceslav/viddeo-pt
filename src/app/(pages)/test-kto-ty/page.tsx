import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Breadcrumbs from "@/components/breadcrumbs"

export const metadata: Metadata = {
  title: "Кто ты из Южного парка? | Тест на персонажа - пройти онлайн бесплатно",
  description: "Узнай, кто ты из Южного парка! Пройди тест на персонажа онлайн бесплатно. Определи, на кого из героев Южного парка ты похож: Стэн, Кайл, Картман, Кенни или Баттерс?",
  keywords: "кто ты из южного парка, тест на персонажа, южный парк тест, пройти тест онлайн, определить персонажа, стэн марш, кайл брофловски, эрик картман, кенни маккормик, баттерс",
  openGraph: {
    title: "Кто ты из Южного парка? | Тест на персонажа - пройти онлайн бесплатно",
    description: "Узнай, кто ты из Южного парка! Пройди тест на персонажа онлайн бесплатно. Определи, на кого из героев Южного парка ты похож.",
    type: "website",
    images: [{
      url: "/assets/hero.png",
      width: 1200,
      height: 630,
      alt: "Тест Кто ты из Южного парка"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Кто ты из Южного парка? | Тест на персонажа",
    description: "Узнай, кто ты из Южного парка! Пройди тест на персонажа онлайн бесплатно.",
    images: ["/assets/hero.png"]
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://southpark-online.ru'}/test-kto-ty`
  }
}

const TestPage = () => {
  return (
    <div className="min-h-screen bg-black w-full">
      <div className="w-full px-4 md:px-8">
        <div className="space-y-6 pt-8">
          <Breadcrumbs items={[
            { name: "Главная", href: "/" },
            { name: "Тест", href: "/test-kto-ty" }
          ]} />
          
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-black text-white transform -rotate-1 hover:rotate-0 transition-transform duration-300 mb-4" style={{ textShadow: '3px 3px 0px #ff0000, 6px 6px 0px #000000' }}>
              КТО ТЫ ИЗ ЮЖНОГО ПАРКА?
            </h1>
            
            <div className="bg-yellow-300 border-4 border-black rounded-lg p-6 max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-black text-black mb-4" style={{ textShadow: '2px 2px 0px #ffffff' }}>
                🎭 ТЕСТ НА ПЕРСОНАЖА
              </h2>
              <p className="text-lg md:text-xl text-black font-bold mb-6">
                Пройди тест и узнай, на кого из героев Южного парка ты больше всего похож!
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div className="bg-white border-2 border-black rounded-lg p-4">
                  <h3 className="font-black text-black text-lg mb-2">Стэн Марш</h3>
                  <p className="text-sm text-gray-700">Лидер, честный, справедливый</p>
                </div>
                <div className="bg-white border-2 border-black rounded-lg p-4">
                  <h3 className="font-black text-black text-lg mb-2">Кайл Брофловски</h3>
                  <p className="text-sm text-gray-700">Умный, еврей, рассудительный</p>
                </div>
                <div className="bg-white border-2 border-black rounded-lg p-4">
                  <h3 className="font-black text-black text-lg mb-2">Эрик Картман</h3>
                  <p className="text-sm text-gray-700">Толстый, эгоистичный, хитрый</p>
                </div>
                <div className="bg-white border-2 border-black rounded-lg p-4">
                  <h3 className="font-black text-black text-lg mb-2">Кенни Маккормик</h3>
                  <p className="text-sm text-gray-700">Загадочный, бедный, молчаливый</p>
                </div>
                <div className="bg-white border-2 border-black rounded-lg p-4">
                  <h3 className="font-black text-black text-lg mb-2">Баттерс</h3>
                  <p className="text-sm text-gray-700">Наивный, добрый, невинный</p>
                </div>
                <div className="bg-white border-2 border-black rounded-lg p-4">
                  <h3 className="font-black text-black text-lg mb-2">Венди</h3>
                  <p className="text-sm text-gray-700">Умная, независимая, феминистка</p>
                </div>
              </div>
              
              <div className="bg-red-500 border-2 border-black rounded-lg p-4 mb-6">
                <p className="text-white font-bold text-lg">
                  🚧 ТЕСТ В РАЗРАБОТКЕ 🚧
                </p>
                <p className="text-white">
                  Скоро здесь появится интерактивный тест с вопросами и результатами!
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="bg-red-500 hover:bg-red-600 text-white border-2 border-black font-bold text-lg px-8 py-3">
                  <Link href="/characters">
                    👥 Посмотреть всех персонажей
                  </Link>
                </Button>
                <Button asChild className="bg-yellow-400 hover:bg-yellow-300 text-black border-2 border-black font-bold text-lg px-8 py-3">
                  <Link href="/">
                    🏠 На главную страницу
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">Популярные персонажи Южного парка:</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: "Стэн Марш", desc: "Главный герой" },
                  { name: "Кайл Брофловски", desc: "Умный друг" },
                  { name: "Эрик Картман", desc: "Толстый злодей" },
                  { name: "Кенни Маккормик", desc: "Умирает в сезонах" },
                  { name: "Баттерс", desc: "Невинный мальчик" },
                  { name: "Венди Тестабургер", desc: "Умная девочка" },
                  { name: "Крейг Такер", desc: "Лидер группы" },
                  { name: "Джимми Валмер", desc: "Инвалид-комик" }
                ].map((char, index) => (
                  <div key={index} className="bg-gray-800 border-2 border-yellow-400 rounded-lg p-3">
                    <h4 className="font-bold text-white text-sm">{char.name}</h4>
                    <p className="text-xs text-gray-300">{char.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestPage
