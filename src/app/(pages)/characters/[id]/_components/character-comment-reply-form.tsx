'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { trpc } from '@/app/_trpc/client'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

interface CharacterCommentReplyFormProps {
  parentId: string
  characterId: string
  onCancel: () => void
}

const CharacterCommentReplyForm = ({ parentId, characterId, onCancel }: CharacterCommentReplyFormProps) => {
  const { data: session } = useSession()
  const [content, setContent] = useState('')
  const utils = trpc.useUtils()

  const addComment = trpc.characterComment.addCharacterComment.useMutation({
    onSuccess: () => {
      utils.characterComment.getCharacterComments.invalidate({ characterId })
      setContent('')
      onCancel()
      toast.success('Ответ добавлен!')
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!session?.user?.id) {
      toast.error('Войдите в систему, чтобы оставить комментарий')
      return
    }

    if (!content.trim()) {
      toast.error('Введите текст комментария')
      return
    }

    await addComment.mutateAsync({
      characterId,
      content: content.trim(),
      userId: session.user.id,
      parentId
    })
  }

  if (!session) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500 text-sm">
          Войдите в систему, чтобы оставить ответ
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Напишите ответ..."
        className="min-h-[80px] resize-none"
        maxLength={1000}
      />
      
      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onCancel}
        >
          Отмена
        </Button>
        <Button
          type="submit"
          size="sm"
          disabled={addComment.isPending || !content.trim()}
          className="bg-yellow-400 text-black hover:bg-yellow-300 font-bold"
        >
          {addComment.isPending ? 'Отправка...' : 'Ответить'}
        </Button>
      </div>
    </form>
  )
}

export default CharacterCommentReplyForm
