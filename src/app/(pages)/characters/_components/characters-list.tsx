import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Image as ImageIcon, MessageCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { trpc } from '@/app/server/routers/_app'

export const CharactersList = async () => {
  const characters = await trpc.character.getCharacters()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {characters.map((character) => {
        return (
          <Card key={character.id} className="w-full overflow-hidden hover:shadow-2xl transition-all duration-300 bg-white border-4 border-black shadow-lg hover:scale-105 hover:-rotate-1 group">
            <div className="relative aspect-square bg-gradient-to-br from-yellow-200 to-orange-200 border-b-4 border-black">
              {character.image ? (
                <Image
                  src={character.image}
                  alt={character.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-16 h-16 text-gray-600" />
                </div>
              )}
              {/* Декоративная рамка */}
              <div className="absolute inset-0 border-4 border-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            <CardHeader className="p-4 bg-gradient-to-r from-yellow-300 to-orange-300 border-b-2 border-black">
              <CardTitle className="text-xl font-black line-clamp-1 text-black transform group-hover:scale-105 transition-transform duration-300" style={{ textShadow: '2px 2px 0px #ff0000' }}>
                {character.name}
              </CardTitle>
              <CardDescription className="line-clamp-2 text-gray-800 font-semibold text-sm">
                {character.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-4 bg-gradient-to-r from-yellow-100 to-orange-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-gray-700 font-bold">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                  <span>{character.characterComments.length} комментариев</span>
                </div>
                <Button 
                  size="sm" 
                  asChild
                  className="bg-yellow-400 text-black hover:bg-yellow-300 border-2 border-black font-bold transform group-hover:scale-110 transition-all duration-300 shadow-lg"
                >
                  <Link href={`/characters/${character.id}`}>
                    Подробнее
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

export const CharactersListLoading = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <Card key={index} className="w-full overflow-hidden bg-white border-4 border-black shadow-lg">
          <Skeleton className="relative aspect-square bg-gradient-to-br from-yellow-200 to-orange-200 border-b-4 border-black" />
          <div className="p-4 bg-gradient-to-r from-yellow-300 to-orange-300 border-b-2 border-black space-y-2">
            <Skeleton className="w-32 h-6 bg-yellow-400" />
            <Skeleton className="w-full h-4 bg-yellow-200" />
            <Skeleton className="w-3/4 h-4 bg-yellow-200" />
          </div>
          <div className="p-4 bg-gradient-to-r from-yellow-100 to-orange-100">
            <div className="flex items-center justify-between">
              <Skeleton className="w-24 h-4 bg-yellow-200" />
              <Skeleton className="w-20 h-8 bg-yellow-400" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
