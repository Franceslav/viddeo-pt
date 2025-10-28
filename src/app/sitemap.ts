import { MetadataRoute } from 'next'
import { trpc } from '@/app/server/routers/_app'
import { seasonSlug, episodeSlug } from '@/lib/slugify'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://southpark-online.ru'
  
  // Статические страницы
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/characters`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/comments`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/auth`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/south-park`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
  ]

  try {
    // Динамические страницы сезонов - единый формат /sezon-[номер]
    const seasons = await trpc.season.getSeasons()
    const seasonPages = seasons.map((season) => ({
      url: `${baseUrl}/${seasonSlug(season.seasonNumber)}`,
      lastModified: new Date(season.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    // Динамические страницы эпизодов
    const episodes = await trpc.episode.getEpisodes()
    const episodePages = episodes.map((episode) => ({
      url: `${baseUrl}/${seasonSlug(episode.season.seasonNumber)}/${episode.slug || episodeSlug(episode.episodeNumber, episode.title)}`,
      lastModified: new Date(episode.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

    // Динамические страницы персонажей
    const characters = await trpc.character.getCharacters()
    const characterPages = characters.map((character) => ({
      url: `${baseUrl}/characters/${character.id}`,
      lastModified: new Date(character.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))

    return [...staticPages, ...seasonPages, ...episodePages, ...characterPages]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return staticPages
  }
}
