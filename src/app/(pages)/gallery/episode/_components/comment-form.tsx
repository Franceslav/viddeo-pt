'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { trpc } from '@/app/_trpc/client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface CommentFormProps {
  episodeId: string
}

const CommentForm = ({ episodeId }: CommentFormProps) => {
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()
  const utils = trpc.useUtils()

  const addComment = trpc.comment.addComment.useMutation({
    onSuccess: () => {
      setContent('')
      utils.comment.getComments.invalidate({ episodeId })
      toast.success('Комментарий добавлен!')
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!session?.user?.id) {
      toast.error('Войдите в систему, чтобы оставить комментарий')
      router.push('/auth')
      return
    }

    if (!content.trim()) {
      toast.error('Комментарий не может быть пустым')
      return
    }

    setIsSubmitting(true)
    
    try {
      await addComment.mutateAsync({
        episodeId,
        content: content.trim(),
        userId: session.user.id
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!session?.user) {
    return (
      <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-4 text-center">
        <p className="text-yellow-800 font-bold">
          &quot;RESPECT MY AUTHORITAH!&quot; - Войдите в систему, чтобы оставить комментарий!
        </p>
        <Button 
          onClick={() => router.push('/auth')} 
          className="mt-2 bg-red-500 hover:bg-red-600 text-white border-2 border-black font-bold"
          style={{ textShadow: '1px 1px 0px #000000' }}
        >
          ВОЙТИ В СИСТЕМУ
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Оставьте комментарий к эпизоду..."
          className="min-h-[100px] resize-none border-2 border-black rounded-lg font-bold"
          style={{ textShadow: '1px 1px 0px #000000' }}
        />
      </div>
      
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting || !content.trim()}
          className="bg-yellow-400 hover:bg-yellow-500 text-black border-2 border-black font-black transform hover:scale-105 transition-all duration-300"
          style={{ textShadow: '1px 1px 0px #000000' }}
        >
          {isSubmitting ? 'ОТПРАВЛЯЕМ...' : 'ОТПРАВИТЬ КОММЕНТАРИЙ'}
        </Button>
      </div>
    </form>
  )
}

export default CommentForm
