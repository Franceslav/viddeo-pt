'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { trpc } from '@/app/_trpc/client'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

interface CharacterCommentFormProps {
  characterId: string
}

const CharacterCommentForm = ({ characterId }: CharacterCommentFormProps) => {
  const { data: session } = useSession()
  const [content, setContent] = useState('')
  const utils = trpc.useUtils()

  const addComment = trpc.characterComment.addCharacterComment.useMutation({
    onSuccess: () => {
      utils.characterComment.getCharacterComments.invalidate({ characterId })
      setContent('')
      toast.success('Комментарий добавлен!')
    },
    onError: (error: { message: string }) => {
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
      userId: session.user.id
    })
  }

  if (!session) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500 text-sm">
          Войдите в систему, чтобы оставить комментарий
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Напишите комментарий о персонаже..."
        className="min-h-[100px] resize-none"
        maxLength={1000}
      />
      
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={addComment.isPending || !content.trim()}
          className="bg-yellow-400 text-black hover:bg-yellow-300 font-bold"
        >
          {addComment.isPending ? 'Отправка...' : 'Оставить комментарий'}
        </Button>
      </div>
    </form>
  )
}

export default CharacterCommentForm
