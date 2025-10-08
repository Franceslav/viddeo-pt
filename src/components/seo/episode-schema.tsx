interface Episode {
  id: string
  title: string
  description?: string
  episodeNumber: number
  season: {
    seasonNumber: number
    title: string
  }
  image?: string
  duration?: number
  uploadDate?: string
}

interface EpisodeSchemaProps {
  episode: Episode
}

export default function EpisodeSchema({ episode }: EpisodeSchemaProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://southpark-online.ru'
  
  const episodeSchema = {
    "@context": "https://schema.org",
    "@type": "TVEpisode",
    "name": episode.title,
    "description": episode.description || `Эпизод "${episode.title}" из сезона ${episode.season.seasonNumber} Южного парка`,
    "episodeNumber": episode.episodeNumber,
    "partOfSeason": {
      "@type": "TVSeason",
      "seasonNumber": episode.season.seasonNumber,
      "name": episode.season.title,
      "partOfSeries": {
        "@type": "TVSeries",
        "name": "Южный парк",
        "alternateName": "South Park"
      }
    },
    "partOfSeries": {
      "@type": "TVSeries",
      "name": "Южный парк",
      "alternateName": "South Park"
    },
    "url": `${baseUrl}/gallery/episode/${episode.id}`,
    "image": episode.image || `${baseUrl}/assets/hero.png`,
    "duration": episode.duration ? `PT${episode.duration}M` : undefined,
    "datePublished": episode.uploadDate,
    "inLanguage": "ru",
    "genre": ["Анимация", "Комедия", "Сатира"],
    "contentRating": "TV-MA"
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(episodeSchema) }}
    />
  )
}
