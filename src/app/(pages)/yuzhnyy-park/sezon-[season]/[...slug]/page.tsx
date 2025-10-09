import { redirect } from 'next/navigation'
import { trpc } from '@/app/server/routers/_app'

type Params = Promise<{ season: string; slug: string[] }>

const Page = async ({ params }: { params: Params }) => {
  const { season, slug } = await params
  
  try {
    console.log('SEO URL Debug:', { season, slug })
    
    // Проверяем, что season передается
    if (!season) {
      console.log('No season, redirecting to /south-park')
      redirect('/south-park')
    }
    
    // Извлекаем номер сезона из season (например, "2" из "sezon-2")
    const seasonMatch = season.match(/sezon-(\d+)/)
    if (!seasonMatch) {
      console.log('Invalid season format, redirecting to /south-park')
      redirect('/south-park')
    }
    
    const seasonNumber = parseInt(seasonMatch[1])
    
    // Парсим slug: ["seria-1-ne-bez-moego-anusa"]
    const slugString = slug.join('-')
    
    // Извлекаем номер эпизода из slug
    const episodeMatch = slugString.match(/seria-(\d+)/)
    if (!episodeMatch) {
      console.log('No episode number found, redirecting to season')
      redirect(`/south-park/season-${seasonNumber}`)
    }
    
    const episodeNumber = parseInt(episodeMatch[1])
    
    console.log('SEO URL Debug:', { seasonNumber, episodeNumber })
    
    // Получаем все эпизоды
    const episodes = await trpc.episode.getEpisodes()
    
    // Ищем эпизод по сезону и номеру
    const foundEpisode = episodes.find(e => 
      e.season.seasonNumber === seasonNumber && 
      e.episodeNumber === episodeNumber
    )
    
    if (!foundEpisode) {
      console.log('Episode not found, redirecting to season')
      redirect(`/south-park/season-${seasonNumber}`)
    }

    console.log('Found episode, redirecting to:', `/gallery/episode/${foundEpisode.id}`)
    // Перенаправляем на оригинальный URL с ID
    redirect(`/gallery/episode/${foundEpisode.id}`)
  } catch (error) {
    console.log('Error in SEO URL:', error)
    redirect('/south-park')
  }
}

export default Page
