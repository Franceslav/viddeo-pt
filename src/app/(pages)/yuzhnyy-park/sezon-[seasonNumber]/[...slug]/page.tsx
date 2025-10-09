import { redirect } from 'next/navigation'
import { trpc } from '@/app/server/routers/_app'

type Params = Promise<{ seasonNumber: string; slug: string[] }>

const Page = async ({ params }: { params: Params }) => {
  const { seasonNumber, slug } = await params
  
  try {
    console.log('SEO URL Debug:', { seasonNumber, slug })
    
    // Проверяем, что seasonNumber передается
    if (!seasonNumber) {
      console.log('No seasonNumber, redirecting to /south-park')
      redirect('/south-park')
    }
    
    // Парсим slug: ["seria-1-ne-bez-moego-anusa"]
    const slugString = slug.join('-')
    
    // Извлекаем номер эпизода из slug
    const episodeMatch = slugString.match(/seria-(\d+)/)
    if (!episodeMatch) {
      console.log('No episode number found, redirecting to season')
      redirect(`/south-park/season-${seasonNumber}`)
    }
    
    const episodeNumber = parseInt(episodeMatch[1])
    
    console.log('SEO URL Debug:', { seasonNumber, slug, slugString, episodeNumber })
    
    // Получаем все эпизоды
    const episodes = await trpc.episode.getEpisodes()
    
    // Ищем эпизод по сезону и номеру
    const episode = episodes.find(e => 
      e.season.seasonNumber === parseInt(seasonNumber) && 
      e.episodeNumber === episodeNumber
    )
    
    if (!episode) {
      console.log('Episode not found, redirecting to season')
      redirect(`/south-park/season-${seasonNumber}`)
    }

    console.log('Found episode, redirecting to:', `/gallery/episode/${episode.id}`)
    // Перенаправляем на оригинальный URL с ID
    redirect(`/gallery/episode/${episode.id}`)
  } catch (error) {
    console.log('Error in SEO URL:', error)
    redirect('/south-park')
  }
}

export default Page