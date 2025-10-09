import { CommentsForum } from './_components/comments-forum'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Комментарии Южного парка | Обсуждения и отзывы",
  description: "Читайте комментарии и обсуждения эпизодов Южного парка. Делитесь мнениями о любимых сериях и персонажах.",
  keywords: "комментарии южного парка, обсуждения, отзывы, мнения, дискуссии",
  openGraph: {
    title: "Комментарии Южного парка | Обсуждения и отзывы",
    description: "Читайте комментарии и обсуждения эпизодов Южного парка. Делитесь мнениями о любимых сериях и персонажах.",
    type: "website",
    images: [{
      url: "/assets/hero.png",
      width: 1200,
      height: 630,
      alt: "Комментарии и обсуждения Южного парка"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Комментарии Южного парка | Обсуждения и отзывы",
    description: "Читайте комментарии и обсуждения эпизодов Южного парка. Делитесь мнениями о любимых сериях и персонажах.",
    images: ["/assets/hero.png"]
  },
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://southpark-online.ru'}/comments`
  }
}

const CommentsPage = () => {
  return (
    <div className="min-h-screen bg-black w-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-white">Комментарии</h1>
          <CommentsForum />
        </div>
      </div>
    </div>
  )
}

export default CommentsPage
