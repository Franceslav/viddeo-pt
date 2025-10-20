import { trpc } from '@/app/server/routers/_app'

export async function GET() {
  try {
    // Получаем последние 20 эпизодов
    const episodes = await trpc.episode.getEpisodes()
    const latestEpisodes = episodes
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 20)

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://southpark-online.ru'

    const rssItems = latestEpisodes.map(episode => {
      const episodeTitle = `Южный Парк ${episode.season.seasonNumber} сезон ${episode.episodeNumber} серия – ${episode.title} смотреть онлайн`
      const episodeUrl = `${baseUrl}/gallery/episode/${episode.id}`
      const pubDate = new Date(episode.createdAt).toUTCString()
      
      return `    <item>
      <title><![CDATA[${episodeTitle}]]></title>
      <link>${episodeUrl}</link>
      <description><![CDATA[${episode.description || `Смотрите "${episode.title}" - ${episode.season.seasonNumber} сезон ${episode.episodeNumber} серия Южного парка онлайн бесплатно в HD качестве.`}]]></description>
      <pubDate>${pubDate}</pubDate>
      <guid isPermaLink="true">${episodeUrl}</guid>
    </item>`
    }).join('\n')

    const rssContent = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Южный парк онлайн - Новые серии</title>
    <description>Последние добавленные серии Южного парка для просмотра онлайн бесплатно</description>
    <link>${baseUrl}</link>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <language>ru</language>
    <copyright>© 2025 South Park Online</copyright>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <generator>Next.js RSS Generator</generator>

${rssItems}
  </channel>
</rss>`

    return new Response(rssContent, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Кэш на 1 час
      },
    })
  } catch (error) {
    console.error('Error generating RSS feed:', error)
    
    // Fallback RSS если что-то пошло не так
    const fallbackRss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Южный парк онлайн - Новые серии</title>
    <description>Последние добавленные серии Южного парка</description>
    <link>https://southpark-online.ru</link>
    <language>ru</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  </channel>
</rss>`

    return new Response(fallbackRss, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
      },
    })
  }
}
