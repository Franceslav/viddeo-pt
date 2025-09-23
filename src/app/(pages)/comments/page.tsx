import { CommentsForum } from './_components/comments-forum'

const CommentsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Комментарии</h1>
        <CommentsForum />
      </div>
    </div>
  )
}

export default CommentsPage
