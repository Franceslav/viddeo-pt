import { notFound } from 'next/navigation'
import { ErrorBoundary } from "react-error-boundary"
import { Suspense } from "react"
import { SessionProvider } from 'next-auth/react'
import { Metadata } from 'next'

import { CharacterDetails, CharacterDetailsLoading } from "./_components/character-details"
import { Button } from "@/components/ui/button"
import { HydrateClient } from "@/app/server/routers/_app"
import { trpc } from '@/app/server/routers/_app'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

// Генерируем статические страницы для всех персонажей
export async function generateStaticParams() {
  try {
    const characters = await trpc.character.getCharacters()
    return characters.map((character) => ({
      id: character.id,
    }))
  } catch (error) {
    console.error('Error generating static params for characters:', error)
    return []
  }
}

export async function generateMetadata({ params }: CharacterPageProps): Promise<Metadata> {
  const { id } = await params
  
  try {
    const character = await trpc.character.getCharacter({ id })
    
    return {
      title: `${character.name} | Персонажи Южного парка`,
      description: character.description || `Узнайте больше о персонаже ${character.name} из Южного парка. Биография, интересные факты и комментарии.`,
      keywords: `южный парк, ${character.name}, персонаж, биография, интересные факты`,
      openGraph: {
        title: `${character.name} | Персонажи Южного парка`,
        description: character.description || `Узнайте больше о персонаже ${character.name} из Южного парка.`,
        type: "profile",
        images: character.image ? [{
          url: character.image,
          width: 1200,
          height: 630,
          alt: character.name
        }] : [],
      },
      twitter: {
        card: "summary_large_image",
        title: `${character.name} | Персонажи Южного парка`,
        description: character.description || `Узнайте больше о персонаже ${character.name} из Южного парка.`,
        images: character.image ? [character.image] : [],
      }
    }
  } catch {
    return {
      title: "Персонаж не найден | Южный парк онлайн",
      description: "Запрашиваемый персонаж Южного парка не найден."
    }
  }
}

interface CharacterPageProps {
  params: Promise<{ id: string }>
}

const CharacterPage = async ({ params }: CharacterPageProps) => {
  const { id } = await params

  // Проверяем, существует ли персонаж
  let character
  try {
    character = await trpc.character.getCharacter({ id })
  } catch {
    notFound()
  }

  if (!character) {
    notFound()
  }

  return (
    <HydrateClient>
      <div className="min-h-screen bg-black w-full">
        <div className="w-full px-4 md:px-8 py-8">
          <div className="space-y-6">
            <Button asChild variant="outline" className="w-fit bg-gray-800 border-yellow-400 text-white hover:bg-gray-700">
              <Link href="/characters">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Назад к персонажам
              </Link>
            </Button>
            <SessionProvider>
              <ErrorBoundary fallback={<div>Something went wrong</div>}>
                <Suspense fallback={<CharacterDetailsLoading />}>
                  <CharacterDetails id={id} />
                </Suspense>
              </ErrorBoundary>
            </SessionProvider>
          </div>
        </div>
      </div>
    </HydrateClient>
  )
}

export default CharacterPage
