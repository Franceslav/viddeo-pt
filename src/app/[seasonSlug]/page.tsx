import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { PrismaClient } from "@prisma/client"
import { seasonMeta, jsonLd } from "@/lib/seo"
import { seasonSlug, episodeSlug } from "@/lib/slugify"
import Link from "next/link"
import Image from "next/image"

const prisma = new PrismaClient()

// Настройка revalidation для динамических данных
export const revalidate = 0 // Отключаем кеширование, всегда загружаем свежие данные
export const dynamic = 'force-dynamic' // Форсируем динамический рендеринг

export async function generateMetadata({ params }: { params: Promise<{ seasonSlug: string }> }): Promise<Metadata> {
  const { seasonSlug: seasonNumberStr } = await params;
  
  // Извлекаем номер сезона из slug (sezon-01 -> 1)
  const seasonMatch = seasonNumberStr.match(/sezon-(\d+)/);
  const extractedSeasonNumber = seasonMatch ? parseInt(seasonMatch[1]) : parseInt(seasonNumberStr);
  
  try {
    // Сначала пробуем найти по извлеченному номеру (основной способ)
    let season = null;
    if (!isNaN(extractedSeasonNumber) && extractedSeasonNumber >= 1) {
      season = await prisma.season.findFirst({
        where: { seasonNumber: extractedSeasonNumber },
        include: { episodes: true }
      });
    }
    
    // Если не нашли по номеру, пробуем найти по slug
    if (!season) {
      season = await prisma.season.findFirst({
        where: { slug: seasonNumberStr },
        include: { episodes: true }
      });
    }
    
    if (!season) {
      const meta = seasonMeta(extractedSeasonNumber || 1);
      return {
        title: meta.title,
        description: meta.description
      };
    }
    
    const seasonNumber = season.seasonNumber;

    const meta = seasonMeta(seasonNumber, season.year ?? undefined)
    return {
      title: season.metaTitle ?? meta.title,
      description: season.metaDesc ?? meta.description,
      keywords: `южный парк, сезон ${seasonNumber}, ${season.year || ''}, смотреть онлайн, бесплатно`,
      openGraph: {
        title: meta.title,
        description: meta.description,
        type: 'website',
        images: season.poster ? [{ url: season.poster }] : undefined,
      },
    }
  } catch {
    const meta = seasonMeta(extractedSeasonNumber || 1)
    return {
      title: meta.title,
      description: meta.description
    }
  }
}

export default async function SeasonPage({ params }: { params: Promise<{ seasonSlug: string }> }) {
  const { seasonSlug: seasonNumberStr } = await params;
  
  // Извлекаем номер сезона из slug (sezon-01 -> 1)
  const seasonMatch = seasonNumberStr.match(/sezon-(\d+)/);
  const extractedSeasonNumber = seasonMatch ? parseInt(seasonMatch[1]) : parseInt(seasonNumberStr);
  
  try {
    // Сначала пробуем найти по извлеченному номеру (основной способ)
    let season = null;
    if (!isNaN(extractedSeasonNumber) && extractedSeasonNumber >= 1) {
      season = await prisma.season.findFirst({
        where: { seasonNumber: extractedSeasonNumber },
        include: { episodes: { orderBy: { episodeNumber: 'asc' } } }
      });
    }
    
    // Если не нашли по номеру, пробуем найти по slug
    if (!season) {
      season = await prisma.season.findFirst({
        where: { slug: seasonNumberStr },
        include: { episodes: { orderBy: { episodeNumber: 'asc' } } }
      });
    }
    
    if (!season) {
      notFound();
    }
    
    const seasonNumber = season.seasonNumber;
    const meta = seasonMeta(seasonNumber, season.year ?? undefined)
    const episodes = season.episodes

    // JSON-LD данные
    const json = {
      "@context": "https://schema.org",
      "@type": "TVSeason",
      "name": `Южный парк — Сезон ${seasonNumber}`,
      "seasonNumber": String(seasonNumber),
      "partOfSeries": { "@type": "TVSeries", "name": "Южный парк", "url": "/" },
      "url": `/${seasonSlug(seasonNumber)}/`,
      "image": season.poster,
      "numberOfEpisodes": episodes.length,
      "startDate": season.year ? `${season.year}-01-01` : undefined
    }


    return (
      <div className="min-h-screen bg-black w-full">
        <main className="w-full p-6 space-y-6">
        <nav aria-label="Хлебные крошки" className="text-sm mb-4">
          <span>
            <Link href="/" className="underline hover:text-gray-300 text-white">Главная</Link> › 
            <span className="text-gray-400"> Сезон {seasonNumber}</span>
          </span>
        </nav>

        {/* Постер и основная информация */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          {season.poster && (
            <div className="flex-shrink-0">
              <Image
                src={season.poster}
                alt={`Постер ${season.title || `Сезона ${seasonNumber}`}`}
                width={300}
                height={450}
                className="rounded-lg shadow-lg"
              />
            </div>
          )}
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2 text-white">{meta.h1}</h1>
            
            <div className="flex gap-4 mb-4 text-sm text-gray-400">
              {season.year && <span>Год: {season.year}</span>}
              <span>Серий: {episodes.length}</span>
            </div>
          </div>
        </div>

        {/* Список серий */}
        <div>
          <h2 className="text-2xl font-bold mb-4 text-white">Серии сезона</h2>
          {episodes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
              {episodes.map((episode) => (
                <Link 
                  key={episode.id} 
                  href={`/${seasonSlug(seasonNumber)}/${episode.slug || episodeSlug(episode.episodeNumber, episode.title)}/`}
                  className="bg-gray-900 rounded-lg p-4 hover:bg-gray-800 transition-colors border border-gray-700 hover:border-gray-600"
                >
                  {/* Картинка эпизода */}
                  {episode.image && (
                    <div className="w-full h-32 mb-3 relative rounded-lg overflow-hidden bg-gray-800">
                      <Image
                        src={episode.image}
                        alt={episode.title}
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}
                  
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-semibold text-yellow-400 bg-yellow-900/30 px-2 py-1 rounded">
                      Серия {episode.episodeNumber}
                    </span>
                    {episode.datePublished && (
                      <span className="text-xs text-gray-500">
                        {new Date(episode.datePublished).toLocaleDateString('ru-RU')}
                      </span>
                    )}
                  </div>
                  <h3 className="text-white font-semibold mb-2 line-clamp-2">
                    {episode.title}
                  </h3>
                  {episode.duration && (
                    <p className="text-xs text-gray-500">
                      Длительность: {episode.duration}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-gray-900 rounded-lg p-8 text-center border border-gray-700">
              <p className="text-gray-400">Серии еще не добавлены</p>
            </div>
          )}
        </div>

        {/* Описание сезона */}
        {season.description && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-white">О сезоне</h2>
            <p className="text-lg text-gray-300 leading-relaxed">
              {season.description}
            </p>
          </div>
        )}


        {/* JSON-LD */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(json) }} />
        </main>
      </div>
    )
  } catch (error) {
    console.error('Error loading season:', error)
    notFound()
  }
}
