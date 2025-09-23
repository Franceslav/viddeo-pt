import { ErrorBoundary } from "react-error-boundary"
import { Suspense } from "react"
import Image from "next/image"

import { SeasonsList, SeasonsListLoading } from "./_components/seasons-list"
import { HydrateClient } from "@/app/server/routers/_app"
import SuggestedVideos from "./video/_components/suggested-videos"

const Gallery = () => {

  return (
    <HydrateClient>
      <div className="w-full bg-black relative overflow-hidden">
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
              alt="Chef" 
              className="w-full h-full object-contain drop-shadow-lg opacity-70"
            />
          </div>
          
          <div className="absolute top-1/2 right-4 w-24 h-24 transform -translate-y-1/2 rotate-90 hover:rotate-0 transition-transform duration-500">
            <img 
              src="/assets/Randy_transparent_cockmagic.webp"
              alt="Randy" 
              className="w-full h-full object-contain drop-shadow-lg opacity-70"
            />
          </div>
          
          {/* Персонажи в центре по бокам */}
          <div className="absolute top-1/4 left-1/4 w-16 h-16 transform -translate-x-1/2 -translate-y-1/2 -rotate-45 hover:rotate-0 transition-transform duration-500">
            <img 
              src="/assets/ButtersStotch.webp"
              alt="Butters" 
              className="w-full h-full object-contain drop-shadow-lg opacity-60"
            />
          </div>
          
          <div className="absolute top-1/4 right-1/4 w-16 h-16 transform translate-x-1/2 -translate-y-1/2 rotate-45 hover:rotate-0 transition-transform duration-500">
            <img
              src="/assets/Token_Black2.webp"
              alt="Token"
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
          <div className="w-full">
            <div className="space-y-6 pt-8 px-4 md:px-8">
              <div className="text-center">
                <h1 className="text-5xl md:text-6xl font-black text-white transform -rotate-1 hover:rotate-0 transition-transform duration-300 mb-4" style={{ textShadow: '3px 3px 0px #ff0000, 6px 6px 0px #000000' }}>
                  ГАЛЕРЕЯ
                </h1>
                <p className="text-xl md:text-2xl font-bold text-black bg-yellow-300 p-4 rounded-lg border-2 border-black transform rotate-1 hover:rotate-0 transition-transform duration-300 inline-block" style={{ textShadow: '1px 1px 0px #000000' }}>
                  &quot;OH MY GOD! THEY KILLED KENNY!&quot; - Смотри все сезоны!
                </p>
              </div>
            </div>

            <div className="w-full">
              <div className="flex flex-col lg:flex-row gap-8 px-4 md:px-8">
                <div className="lg:w-2/3">
                  <ErrorBoundary fallback={<div>Something went wrong</div>}>
                    <Suspense fallback={<SeasonsListLoading />}>
                      <SeasonsList />
                    </Suspense>
                  </ErrorBoundary>
                </div>
                
                <div className="lg:w-1/3">
                  <ErrorBoundary fallback={<div>Something went wrong with suggested videos</div>}>
                    <Suspense fallback={<div>Loading suggested videos...</div>}>
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