import Link from "next/link"
import Image from "next/image"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"

import { buttonVariants } from "@/components/ui/button"

import { cn } from "@/lib/utils"
import Container from "@/components/container"
import { SeasonsList, SeasonsListLoading } from "./(pages)/gallery/_components/seasons-list"
import { HydrateClient } from "@/app/server/routers/_app"


const Home = () => {

  return (
    <HydrateClient>
      <div className="flex-1 min-h-screen bg-black relative overflow-hidden">
        {/* Персонажи по периферии окружности */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Kyle - верхний левый */}
          <div className="absolute top-8 left-8 w-24 h-24 transform -rotate-12 hover:rotate-0 transition-transform duration-500">
            <img 
              src="/assets/Kyle-broflovski.webp" 
              alt="Kyle" 
              className="w-full h-full object-contain drop-shadow-lg"
            />
          </div>
          
          {/* Cartman - верхний правый */}
          <div className="absolute top-8 right-8 w-24 h-24 transform rotate-12 hover:rotate-0 transition-transform duration-500">
            <img 
              src="/assets/Eric-cartman.webp"
              alt="Cartman" 
              className="w-full h-full object-contain drop-shadow-lg"
            />
          </div>
          
          {/* Stan - нижний левый */}
          <div className="absolute bottom-8 left-8 w-24 h-24 transform rotate-12 hover:rotate-0 transition-transform duration-500">
            <img 
              src="/assets/Stan-marsh-0.webp"
              alt="Stan" 
              className="w-full h-full object-contain drop-shadow-lg"
            />
          </div>
          
          {/* Kenny - нижний правый */}
          <div className="absolute bottom-8 right-8 w-24 h-24 transform -rotate-12 hover:rotate-0 transition-transform duration-500">
            <img 
              src="/assets/KennyMcCormick.webp"
              alt="Kenny" 
              className="w-full h-full object-contain drop-shadow-lg"
            />
          </div>
          
          {/* Дополнительные персонажи по бокам */}
          <div className="absolute top-1/2 left-4 w-20 h-20 transform -translate-y-1/2 -rotate-90 hover:rotate-0 transition-transform duration-500">
            <img 
              src="/assets/Chef.png"
              alt="Kyle" 
              className="w-full h-full object-contain drop-shadow-lg opacity-70"
            />
          </div>
          
          <div className="absolute top-1/2 right-4 w-24 h-24 transform -translate-y-1/2 rotate-90 hover:rotate-0 transition-transform duration-500">
            <img 
              src="/assets/Randy_transparent_cockmagic.webp"
              alt="Cartman" 
              className="w-full h-full object-contain drop-shadow-lg opacity-70"
            />
          </div>
          
          {/* Персонажи в центре по бокам */}
          <div className="absolute top-1/4 left-1/4 w-16 h-16 transform -translate-x-1/2 -translate-y-1/2 -rotate-45 hover:rotate-0 transition-transform duration-500">
            <img 
              src="/assets/ButtersStotch.webp"
              alt="Stan" 
              className="w-full h-full object-contain drop-shadow-lg opacity-60"
            />
          </div>
          
          <div className="absolute top-1/4 right-1/4 w-16 h-16 transform translate-x-1/2 -translate-y-1/2 rotate-45 hover:rotate-0 transition-transform duration-500">
            <img
              src="/assets/Token_Black2.webp"
              alt="Kenny"
              className="w-full h-full object-contain drop-shadow-lg opacity-60"
            />
          </div>

          <div className="absolute bottom-1/4 right-1/4 w-16 h-16 transform translate-x-1/2 translate-y-1/2 -rotate-45 hover:rotate-0 transition-transform duration-500">
            <Image
              src="/assets/Chef.png"
              alt="Chef"
              width={64}
              height={64}
              className="w-full h-full object-contain drop-shadow-lg opacity-60"
            />
          </div>
        </div>
        {/* Контент поверх персонажей */}
        <div className="relative z-10">
        <Container>
          <main className="flex flex-col items-center px-4 py-16">
            <div className="w-full flex items-center justify-center">
              <div className="max-w-md md:max-w-xl flex flex-col items-center gap-6">
                <h1 className="text-5xl md:text-6xl font-black text-center text-white transform -rotate-1 hover:rotate-0 transition-transform duration-300" style={{ textShadow: '3px 3px 0px #ff0000, 6px 6px 0px #000000, 8px 8px 0px rgba(0,0,0,0.8)' }}>
                  WATCH AND <span className="text-yellow-400" style={{ textShadow: '3px 3px 0px #ff0000, 6px 6px 0px #000000, 8px 8px 0px rgba(0,0,0,0.8)' }}>SCREAM</span> LIKE CARTMAN!
                </h1>
                <Link href='/gallery' className={cn("w-full max-w-48 font-black text-lg py-4 px-8 bg-red-500 hover:bg-red-600 text-white border-4 border-black rounded-lg transform hover:scale-105 transition-all duration-300 shadow-lg", buttonVariants({ variant: "default" }))} style={{ textShadow: '2px 2px 0px #000000' }}>
                  <span>НАЧНИ СМОТРЕТЬ!</span>
                </Link>
              </div>
            </div>
          </main>
          
          <div className="mt-12 space-y-6">
            <div className="text-center">
              <h2 className="text-4xl font-black mb-4 text-white transform -rotate-1" style={{ textShadow: '3px 3px 0px #ff0000, 6px 6px 0px #000000, 8px 8px 0px rgba(0,0,0,0.8)' }}>
                ЛУЧШИЕ СЕЗОНЫ ЮЖНОГО ПАРКА!
              </h2>
              <p className="text-xl font-bold text-white bg-yellow-400 bg-opacity-90 p-3 rounded-lg border-2 border-black inline-block transform rotate-1 hover:rotate-0 transition-transform duration-300" style={{ textShadow: '2px 2px 0px #000000' }}>
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
      </div>
    </HydrateClient>
  )
}

export default Home