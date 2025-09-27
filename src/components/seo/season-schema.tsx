interface Season {
  id: string
  title: string
  description?: string
  seasonNumber: number
  image?: string
  episodes: Array<{
    id: string
    title: string
    episodeNumber: number
  }>
}

interface SeasonSchemaProps {
  season: Season
}

export default function SeasonSchema({ season }: SeasonSchemaProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://viddeo-pt-sp.vercel.app'
  
  const seasonSchema = {
    "@context": "https://schema.org",
    "@type": "TVSeason",
    "name": season.title,
    "description": season.description || `Сезон ${season.seasonNumber} Южного парка с ${season.episodes.length} эпизодами`,
    "seasonNumber": season.seasonNumber,
    "numberOfEpisodes": season.episodes.length,
    "partOfSeries": {
      "@type": "TVSeries",
      "name": "Южный парк",
      "alternateName": "South Park"
    },
    "url": `${baseUrl}/gallery/season/${season.id}`,
    "image": season.image || `${baseUrl}/assets/hero.png`,
    "inLanguage": "ru",
    "genre": ["Анимация", "Комедия", "Сатира"],
    "contentRating": "TV-MA",
    "episode": season.episodes.map(episode => ({
      "@type": "TVEpisode",
      "name": episode.title,
      "episodeNumber": episode.episodeNumber,
      "url": `${baseUrl}/gallery/episode/${episode.id}`
    }))
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(seasonSchema) }}
    />
  )
}
