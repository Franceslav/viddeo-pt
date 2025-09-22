'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { trpc } from '@/app/_trpc/client'
import { toast } from 'sonner'
import ImagePreview from './image-preview'
import FileUpload from './file-upload'

interface CharacterFormProps {
  character?: {
    id: string
    name: string
    description: string
    image: string | null
    isActive: boolean
  } | null
  onClose: () => void
}

const CharacterForm = ({ character, onClose }: CharacterFormProps) => {
  const [formData, setFormData] = useState({
    name: character?.name || '',
    description: character?.description || '',
    image: character?.image || '',
    isActive: character?.isActive ?? true
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(character?.image || null)

  const utils = trpc.useUtils()

  const createCharacter = trpc.character.createCharacter.useMutation({
    onSuccess: () => {
      utils.character.getCharacters.invalidate()
      toast.success('Персонаж создан!')
      onClose()
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const updateCharacter = trpc.character.updateCharacter.useMutation({
    onSuccess: () => {
      utils.character.getCharacters.invalidate()
      toast.success('Персонаж обновлен!')
      onClose()
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const handleFileSelect = (file: File | null) => {
    if (file) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim() || !formData.description.trim()) {
      toast.error('Заполните все обязательные поля')
      return
    }

    let imageUrl = formData.image

    // Если выбран новый файл, загружаем его
    if (selectedFile) {
      const formDataFile = new FormData()
      formDataFile.append('file', selectedFile)

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formDataFile
        })

        if (!response.ok) {
          throw new Error('Ошибка загрузки файла')
        }

        const data = await response.json()
        imageUrl = data.url
      } catch {
        toast.error('Ошибка загрузки изображения')
        return
      }
    }

    const submitData = {
      ...formData,
      image: imageUrl
    }

    if (character) {
      updateCharacter.mutate({ id: character.id, ...submitData })
    } else {
      createCharacter.mutate(submitData)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {character ? 'Редактировать персонажа' : 'Создать персонажа'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Имя персонажа *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Введите имя персонажа"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Описание *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Введите описание персонажа"
              className="min-h-[100px]"
              required
            />
          </div>

          <div>
            <Label>Изображение</Label>
            <FileUpload onFileSelect={handleFileSelect} />
            {previewUrl && (
              <ImagePreview
                imageUrl={previewUrl}
                alt="Preview"
                onRemove={() => {
                  setPreviewUrl(null)
                  setSelectedFile(null)
                  setFormData({ ...formData, image: '' })
                }}
              />
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked: boolean) => setFormData({ ...formData, isActive: checked })}
            />
            <Label htmlFor="isActive">Активен</Label>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Отмена
            </Button>
            <Button type="submit" disabled={createCharacter.isPending || updateCharacter.isPending}>
              {character ? 'Обновить' : 'Создать'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CharacterForm
