import { ErrorBoundary } from "react-error-boundary"
import { Suspense } from "react"

import { CharactersList, CharactersListLoading } from "./_components/characters-list"
import { HydrateClient } from "@/app/server/routers/_app"

const CharactersPage = () => {

  return (
    <HydrateClient>
      <div className="min-h-screen bg-black w-full">
        <div className="w-full px-4 md:px-8">
          <div className="space-y-6 pt-8">
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-black text-white transform -rotate-1 hover:rotate-0 transition-transform duration-300 mb-4" style={{ textShadow: '3px 3px 0px #ff0000, 6px 6px 0px #000000' }}>
                ПЕРСОНАЖИ
              </h1>
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
