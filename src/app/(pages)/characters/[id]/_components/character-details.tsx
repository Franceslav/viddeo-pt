'use client'

import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { trpc } from '@/app/_trpc/client'
import { MessageCircle } from 'lucide-react'
import Image from 'next/image'
import CharacterCommentForm from './character-comment-form'
import CharacterComments from './character-comments'

interface CharacterDetailsProps {
  id: string
}

const CharacterDetails = ({ id }: CharacterDetailsProps) => {
  const { data: character, isLoading } = trpc.character.getCharacter.useQuery({ id })

  if (isLoading) {
    return <CharacterDetailsLoading />
  }

  if (!character) {
    return <div>Персонаж не найден</div>
  }

  return (
    <div className="space-y-6">
      {/* Информация о персонаже */}
      <div className="bg-white border-2 border-black rounded-lg p-6 shadow-lg">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <div className="relative w-48 h-48 bg-gray-100 rounded-lg overflow-hidden">
              {character.image ? (
                <Image
                  src={character.image}
                  alt={character.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-4xl">👤</div>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex-1">
            <div className="mb-4">
              <h1 className="text-3xl font-black text-black" style={{ textShadow: '2px 2px 0px #ff0000' }}>
                {character.name}
              </h1>
              <Badge variant="secondary" className="mt-2">
                {character.isActive ? 'Активен' : 'Неактивен'}
              </Badge>
            </div>
            
            <div className="space-y-3">
              <div>
                <h3 className="font-bold text-black mb-2">Описание:</h3>
                <p className="text-gray-700 leading-relaxed">
                  {character.description}
                </p>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>Комментарии</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Комментарии */}
      <div className="space-y-6">
        <div className="bg-yellow-300 border-2 border-yellow-400 rounded-lg p-4">
          <h2 className="text-2xl font-black text-black mb-4" style={{ textShadow: '2px 2px 0px #000000' }}>
            &quot;OH MY GOD! THEY KILLED KENNY!&quot; - ОБСУЖДЕНИЕ ПЕРСОНАЖА
          </h2>
          
          <CharacterCommentForm characterId={id} />
        </div>
        
        <CharacterComments characterId={id} />
      </div>
    </div>
  )
}

const CharacterDetailsLoading = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white border-2 border-black rounded-lg p-6 shadow-lg">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <Skeleton className="w-48 h-48 bg-gray-100 rounded-lg" />
          </div>
          <div className="flex-1 space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <Skeleton className="h-6 w-48" />
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-20 w-full" />
        ))}
      </div>
    </div>
  )
}

export { CharacterDetails, CharacterDetailsLoading }
export default CharacterDetails
