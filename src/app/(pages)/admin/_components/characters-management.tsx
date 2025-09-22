'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { trpc } from '@/app/_trpc/client'
import { toast } from 'sonner'
import { Edit, Trash2, Plus, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'
import CharacterForm from './character-form'

const CharactersManagement = () => {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingCharacter, setEditingCharacter] = useState<{
    id: string
    name: string
    description: string
    image: string | null
    isActive: boolean
  } | null>(null)

  const { data: characters, isLoading } = trpc.character.getCharacters.useQuery()
  const utils = trpc.useUtils()

  const deleteCharacter = trpc.character.deleteCharacter.useMutation({
    onSuccess: () => {
      utils.character.getCharacters.invalidate()
      toast.success('Персонаж удален!')
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const handleEdit = (character: {
    id: string
    name: string
    description: string
    image: string | null
    isActive: boolean
  }) => {
    setEditingCharacter(character)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Удалить персонажа?')) {
      await deleteCharacter.mutateAsync({ id })
    }
  }

  const handleFormClose = () => {
    setIsFormOpen(false)
    setEditingCharacter(null)
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="w-full">
            <CardContent className="p-0">
              <div className="aspect-square bg-gray-100 rounded-t-lg"></div>
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Управление персонажами</h2>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Добавить персонажа
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {characters?.map((character) => (
          <Card key={character.id} className="w-full overflow-hidden">
            <div className="relative aspect-square bg-gray-100">
              {character.image ? (
                <Image
                  src={character.image}
                  alt={character.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>
            
            <CardHeader className="p-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg line-clamp-1">
                  {character.name}
                </CardTitle>
                <Badge variant={character.isActive ? "default" : "secondary"}>
                  {character.isActive ? "Активен" : "Неактивен"}
                </Badge>
              </div>
              <CardDescription className="line-clamp-2">
                {character.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-4 pt-0">
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(character)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Редактировать
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(character.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Удалить
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {isFormOpen && (
        <CharacterForm
          character={editingCharacter}
          onClose={handleFormClose}
        />
      )}
    </div>
  )
}

export default CharactersManagement
