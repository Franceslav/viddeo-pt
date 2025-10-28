import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { PrismaClient } from "@prisma/client"
import { seasonSlug, episodeSlug } from "@/lib/slugify"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ArrowRight, Play, Eye } from "lucide-react"
import { auth } from "@/auth"
import CommentsSection from "./_components/comments-section"
import EpisodeActions from "./_components/episode-actions"

const prisma = new PrismaClient()

interface EpisodePageProps {
  params: Promise<{ seasonSlug: string; episodeSlug: string }>
}

export async function generateMetadata({ params }: EpisodePageProps): Promise<Metadata> {
  const { seasonSlug: seasonSlugParam, episodeSlug: episodeSlugParam } = await params
  
  try {
    // Извлекаем номер сезона из slug
    const seasonMatch = seasonSlugParam.match(/sezon-(\d+)/);
    const seasonNumber = seasonMatch ? parseInt(seasonMatch[1]) : parseInt(seasonSlugParam);
    
    // Извлекаем номер эпизода из slug
    const episodeMatch = episodeSlugParam.match(/seriya-(\d+)/);
    const episodeNumber = episodeMatch ? parseInt(episodeMatch[1]) : 1;

    const episode = await prisma.episode.findFirst({
      where: {
        season: {
          seasonNumber: seasonNumber
        },
        episodeNumber: episodeNumber
      },
      include: {
        season: true
      }
    });

    if (!episode) {
      return {
        title: `Эпизод ${episodeNumber} сезона ${seasonNumber} - Южный парк`,
        description: `Смотреть эпизод ${episodeNumber} сезона ${seasonNumber} Южного парка онлайн бесплатно`
      };
    }

    return {
      title: `${episode.title} - Южный парк онлайн`,
      description: episode.description || `Смотреть ${episode.title} онлайн бесплатно в хорошем качестве`,
      keywords: `южный парк, ${episode.title}, сезон ${seasonNumber}, эпизод ${episodeNumber}, смотреть онлайн, бесплатно`,
      openGraph: {
        title: episode.title,
        description: episode.description || `Смотреть ${episode.title} онлайн бесплатно`,
        type: 'video.episode',
        images: episode.image ? [{ url: episode.image }] : undefined,
      },
    }
  } catch {
    return {
      title: `Эпизод - Южный парк онлайн`,
      description: `Смотреть эпизод Южного парка онлайн бесплатно`
    }
  }
}

export default async function EpisodePage({ params }: EpisodePageProps) {
  const { seasonSlug: seasonSlugParam, episodeSlug: episodeSlugParam } = await params
  const session = await auth()
  
  try {
    // Извлекаем номер сезона из slug
    const seasonMatch = seasonSlugParam.match(/sezon-(\d+)/);
    const seasonNumber = seasonMatch ? parseInt(seasonMatch[1]) : parseInt(seasonSlugParam);
    
    // Извлекаем номер эпизода из slug
    const episodeMatch = episodeSlugParam.match(/seriya-(\d+)/);
    const episodeNumber = episodeMatch ? parseInt(episodeMatch[1]) : 1;

    const episode = await prisma.episode.findFirst({
      where: {
        season: {
          seasonNumber: seasonNumber
        },
        episodeNumber: episodeNumber
      },
      include: {
        season: true,
        likes: true
      }
    });

    // Получаем лайк пользователя для этого эпизода
    let userLike = null;
    if (session?.user?.id) {
      userLike = await prisma.like.findFirst({
        where: {
          episodeId: episode?.id,
          userId: session.user.id
        }
      });
    }

    if (!episode) {
      notFound();
    }

    // Получаем соседние эпизоды
    const allEpisodes = await prisma.episode.findMany({
      where: {
        season: {
          seasonNumber: seasonNumber
        }
      },
      orderBy: { episodeNumber: 'asc' },
      include: { season: true }
    });

    const currentIndex = allEpisodes.findIndex(ep => ep.id === episode.id);
    const previousEpisode = currentIndex > 0 ? allEpisodes[currentIndex - 1] : null;
    const nextEpisode = currentIndex < allEpisodes.length - 1 ? allEpisodes[currentIndex + 1] : null;

    return (
      <div className="min-h-screen bg-black text-white">
        {/* Хлебные крошки */}
        <nav className="bg-gray-900 py-4">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center space-x-2 text-sm">
              <Link href="/" className="text-gray-400 hover:text-white">Главная</Link>
              <span className="text-gray-500">›</span>
              <Link href={`/${seasonSlug(seasonNumber)}`} className="text-gray-400 hover:text-white">
                Сезон {seasonNumber}
              </Link>
              <span className="text-gray-500">›</span>
              <span className="text-white">Эпизод {episodeNumber}</span>
            </div>
          </div>
        </nav>

        <div className="w-full px-4 py-8">
          <div className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Основной контент */}
              <div className="lg:col-span-3 space-y-6">
                {/* Видео плеер */}
                <div className="bg-black rounded-lg overflow-hidden">
                  {episode.url ? (
                    <div className="relative aspect-video">
                      <video
                        controls
                        className="w-full h-full"
                        poster={episode.image || undefined}
                      >
                        <source src={episode.url} type="video/mp4" />
                        Ваш браузер не поддерживает видео.
                      </video>
                    </div>
                  ) : (
                    <div className="aspect-video flex items-center justify-center bg-gray-800">
                      <div className="text-center">
                        <Play className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-400">Видео недоступно</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Навигация между сериями */}
                <div className="flex justify-between items-center gap-4">
                  {previousEpisode ? (
                    <Link 
                      href={`/${seasonSlug(seasonNumber)}/${episodeSlug(previousEpisode.episodeNumber, previousEpisode.title)}`}
                      className="flex items-center gap-3 bg-gray-800 hover:bg-gray-700 rounded-lg p-4 transition-colors flex-1"
                    >
                      <ArrowLeft className="w-5 h-5 text-blue-400" />
                      <div className="text-left">
                        <div className="text-sm text-gray-400">Предыдущая серия</div>
                        <div className="font-medium text-white line-clamp-1">
                          {previousEpisode.episodeNumber}. {previousEpisode.title}
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <div className="flex-1"></div>
                  )}
                  
                  {nextEpisode ? (
                    <Link 
                      href={`/${seasonSlug(seasonNumber)}/${episodeSlug(nextEpisode.episodeNumber, nextEpisode.title)}`}
                      className="flex items-center gap-3 bg-gray-800 hover:bg-gray-700 rounded-lg p-4 transition-colors flex-1"
                    >
                      <div className="text-right flex-1">
                        <div className="text-sm text-gray-400">Следующая серия</div>
                        <div className="font-medium text-white line-clamp-1">
                          {nextEpisode.episodeNumber}. {nextEpisode.title}
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-blue-400" />
                    </Link>
                  ) : (
                    <div className="flex-1"></div>
                  )}
                </div>

                {/* Информация о видео */}
                <div className="space-y-4">
                  {/* Заголовок */}
                  <h1 className="text-2xl font-bold text-white">{episode.title}</h1>
                  
                  {/* Статистика и действия */}
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-6 text-sm text-gray-400">
                      <span>{episode.views.toLocaleString()} просмотров</span>
                      <span>•</span>
                      <span>Сезон {seasonNumber}, Эпизод {episodeNumber}</span>
                      {episode.datePublished && (
                        <>
                          <span>•</span>
                          <span>{new Date(episode.datePublished).toLocaleDateString('ru-RU')}</span>
                        </>
                      )}
                    </div>
                    
                    <EpisodeActions 
                      episodeId={episode.id}
                      initialLikes={episode.likes.filter(like => like.type === 'like').length}
                      userLiked={userLike?.type === 'like'}
                      userDisliked={userLike?.type === 'dislike'}
                    />
                  </div>

                  {/* Описание */}
                  {episode.description && (
                    <div className="bg-gray-800 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold">Описание</h3>
                      </div>
                      <div className="text-gray-300 leading-relaxed whitespace-pre-line">
                        {episode.description}
                      </div>
                    </div>
                  )}

                  {/* Комментарии */}
                  <CommentsSection 
                    episodeId={episode.id}
                    isAuthenticated={!!session?.user}
                  />

                </div>
              </div>

              {/* Боковая панель - список эпизодов */}
              <div className="space-y-4">
                <div className="bg-gray-800 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-4">Эпизоды сезона {seasonNumber}</h3>
                  <div className="space-y-2">
                    {allEpisodes.map((ep) => (
                      <Link
                        key={ep.id}
                        href={`/${seasonSlug(seasonNumber)}/${episodeSlug(ep.episodeNumber, ep.title)}`}
                        className={`block p-3 rounded-lg transition-colors ${
                          ep.id === episode.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {ep.image && (
                            <div className="w-20 h-12 bg-gray-600 rounded flex-shrink-0">
                              <Image
                                src={ep.image}
                                alt={ep.title}
                                width={80}
                                height={48}
                                className="w-full h-full object-cover rounded"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium line-clamp-2 mb-1">
                              {ep.episodeNumber}. {ep.title}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                              <Eye className="w-3 h-3" />
                              <span>{ep.views}</span>
                              {ep.duration && (
                                <>
                                  <span>•</span>
                                  <span>{ep.duration}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error loading episode:', error)
    notFound()
  }
}