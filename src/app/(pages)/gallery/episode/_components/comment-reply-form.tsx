'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { trpc } from '@/app/_trpc/client'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { Reply, X } from 'lucide-react'

interface CommentReplyFormProps {
  parentId: string
  episodeId: string
  onCancel: () => void
}

const CommentReplyForm = ({ parentId, episodeId, onCancel }: CommentReplyFormProps) => {
  const [content, setContent] = useState('')
  const { data: session } = useSession()
  const utils = trpc.useUtils()

  const addComment = trpc.comment.addComment.useMutation({
    onSuccess: () => {
      toast.success('Ответ добавлен!')
      setContent('')
      onCancel()
      utils.comment.getComments.invalidate({ episodeId })
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) {
      toast.error('Ответ не может быть пустым')
      return
    }
    if (!session?.user?.id) {
      toast.error('Вы должны быть авторизованы, чтобы отвечать на комментарии')
      return
    }

    addComment.mutate({
      episodeId,
      userId: session.user.id,
      content,
      parentId
    })
  }

  if (!session?.user) {
    return (
      <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-4 text-center">
        <p className="text-yellow-800 font-bold">
          Войдите в систему, чтобы отвечать на комментарии!
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
        rows={3}
        className="bg-white border-2 border-black rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:border-transparent"
      />
      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-2 border-black"
        >
          <X className="w-4 h-4 mr-1" />
          Отмена
        </Button>
        <Button
          type="submit"
          disabled={addComment.isPending}
          className="bg-red-500 hover:bg-red-600 text-white border-2 border-black font-bold"
          style={{ textShadow: '1px 1px 0px #000000' }}
        >
          <Reply className="w-4 h-4 mr-1" />
          {addComment.isPending ? 'Отправка...' : 'Ответить'}
        </Button>
      </div>
    </form>
  )
}

export default CommentReplyForm
