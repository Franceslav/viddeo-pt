import { FC, Suspense } from 'react'
import Link from 'next/link'
import { ArrowLeft, Calendar, Eye, ChevronLeft, ChevronRight } from 'lucide-react'

import { trpc } from '@/app/server/routers/_app'
import PlayerJS from '../../video/_components/playerjs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import EpisodeLikeButton from './episode-like-button'
import CommentForm from './comment-form'
import CommentsList from './comments-list'
import { formatDateShort, getInitials } from '@/lib/utils'
import JsonLd from "@/components/seo/JsonLD";
import Breadcrumbs from "@/components/seo/Breadcrumps";

// ВАЖНО: правильные пути/регистр


interface Props {
    id: string
}

const EpisodeContainer: FC<Props> = async ({ id }) => {
    const episode = await trpc.episode.getEpisode({ id })
    const user = await trpc.user.getUserById({ userId: episode.userId })
    const likesData = await trpc.likes.getLikes({ id: episode.id })
    const adjacentEpisodes = await trpc.episode.getAdjacentEpisodes({ id })

    // Увеличиваем просмотры
    await trpc.episode.increaseViews({ id: episode.id })

    // === SEO helpers ===
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://southpark-online.ru'
    const pageUrl = `${baseUrl}/yuzhnyy-park/sezon-${episode.season.seasonNumber}/seria-${episode.episodeNumber}`
    const seasonUrl = `${baseUrl}/yuzhnyy-park/sezon-${episode.season.seasonNumber}`
    const galleryUrl = `${baseUrl}/yuzhnyy-park`

    const views = (episode.views ?? 0) + 1
    const likes = likesData.likes ?? 0
    const dislikes = likesData.dislikes ?? 0

    const abs = (u?: string | null) =>
        !u ? undefined : u.startsWith('http') ? u : `${baseUrl}${u.startsWith('/') ? '' : '/'}${u}`

    // --- TVEpisode ---
    const episodeSchema = {
        '@context': 'https://schema.org',
        '@type': 'TVEpisode',
        name: episode.title,
        description: episode.description,
        url: pageUrl,
        image: abs(episode.image),
        thumbnailUrl: abs(episode.image),
        episodeNumber: episode.episodeNumber,
        partOfSeason: {
            '@type': 'TVSeason',
            seasonNumber: episode.season.seasonNumber,
            url: seasonUrl,
        },
        partOfSeries: {
            '@type': 'TVSeries',
            name: 'Южный парк',
            alternateName: 'South Park',
            url: baseUrl,
        },
        datePublished: episode.createdAt ? new Date(episode.createdAt).toISOString() : undefined,
        author: user?.name ? { '@type': 'Person', name: user.name } : undefined,
        interactionStatistic: [
            {
                '@type': 'InteractionCounter',
                interactionType: { '@type': 'WatchAction' },
                userInteractionCount: views,
            },
            {
                '@type': 'InteractionCounter',
                interactionType: 'LikeAction',
                userInteractionCount: likes,
            },
        ],
        potentialAction: {
            '@type': 'WatchAction',
            target: pageUrl,
        },
    }

    // --- BreadcrumbList ---
    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Главная', item: baseUrl },
            { '@type': 'ListItem', position: 2, name: 'Галерея', item: galleryUrl },
            { '@type': 'ListItem', position: 3, name: `Сезон ${episode.season.seasonNumber}`, item: seasonUrl },
            { '@type': 'ListItem', position: 4, name: episode.title, item: pageUrl },
        ],
    }

    // --- (опционально) VideoObject ---
    const videoObject = {
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        name: episode.title,
        description: episode.description,
        thumbnailUrl: abs(episode.image) ? [abs(episode.image)] : undefined,
        uploadDate: episode.createdAt ? new Date(episode.createdAt).toISOString() : undefined,
        contentUrl: episode.url, // прямой URL видео/стрима (если есть)
        embedUrl: pageUrl,       // страница воспроизведения
        publisher: { '@type': 'Organization', name: 'Южный парк онлайн' },
        interactionStatistic: {
            '@type': 'InteractionCounter',
            interactionType: { '@type': 'WatchAction' },
            userInteractionCount: views,
        },
        isPartOf: {
            '@type': 'TVEpisode',
            name: episode.title,
            episodeNumber: episode.episodeNumber,
        },
        // duration: 'PT22M',
    }

    return (
        <>
            {/* JSON-LD */}
            <JsonLd data={episodeSchema} />
            <JsonLd data={breadcrumbSchema} />
            <JsonLd data={videoObject} />

            <div className="mb-4 flex flex-col sm:flex-row gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="bg-gray-800 border-yellow-400 text-white hover:bg-gray-700 w-full sm:w-auto"
                >
                    <Link href={`/south-park/season-${episode.season.seasonNumber}`}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline">Назад к сезону</span>
                        <span className="sm:hidden">Назад</span>
                    </Link>
                </Button>
                
                {/* Компактные кнопки навигации */}
                <div className="flex gap-2 w-full sm:w-auto">
                    {adjacentEpisodes.previous && (
                        <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="bg-gray-800 border-yellow-400 text-white hover:bg-gray-700 flex-1 sm:flex-none"
                        >
                            <Link href={`/gallery/episode/${adjacentEpisodes.previous.id}`}>
                                <ChevronLeft className="w-4 h-4" />
                                <span className="hidden sm:inline ml-1">Пред.</span>
                            </Link>
                        </Button>
                    )}
                    
                    {adjacentEpisodes.next && (
                        <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="bg-gray-800 border-yellow-400 text-white hover:bg-gray-700 flex-1 sm:flex-none"
                        >
                            <Link href={`/gallery/episode/${adjacentEpisodes.next.id}`}>
                                <span className="hidden sm:inline mr-1">След.</span>
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        </Button>
                    )}
                </div>
            </div>

            {/* Видимые крошки */}
            <Breadcrumbs
                items={[
                    { name: 'South Park', href: '/south-park' },
                    { name: `Сезон ${episode.season.seasonNumber}`, href: `/south-park/season-${episode.season.seasonNumber}` },
                    { name: episode.title },
                ]}
            />

            <PlayerJS
                src={episode.url}
                poster={episode.image}
                title={episode.title}
                showPlayerSelector={false}
                showLightToggle={true}
                showFullscreen={true}
                fallbackSources={[]}
            />

            {/* Навигация между эпизодами */}
            <div className="mt-6 space-y-4">
                <h3 className="text-xl font-bold text-white text-center mb-4">Навигация по эпизодам</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Предыдущий эпизод */}
                    <div className="w-full">
                        {adjacentEpisodes.previous ? (
                            <Link href={`/gallery/episode/${adjacentEpisodes.previous.id}`}>
                                <div className="group bg-gray-800 border-2 border-yellow-400 rounded-lg p-4 hover:bg-gray-700 hover:border-yellow-300 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="flex-shrink-0 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center group-hover:bg-yellow-300 transition-colors">
                                            <ChevronLeft className="w-6 h-6 text-black" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-xs text-yellow-400 font-semibold uppercase tracking-wide">Предыдущий</div>
                                            <div className="text-sm font-bold text-white truncate group-hover:text-yellow-100 transition-colors">
                                                {adjacentEpisodes.previous.title}
                                            </div>
                                            <div className="text-xs text-gray-400 mt-1">
                                                Сезон {adjacentEpisodes.previous.season.seasonNumber} • Эпизод {adjacentEpisodes.previous.episodeNumber}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ) : (
                            <div className="bg-gray-800 border-2 border-gray-600 rounded-lg p-4 opacity-50">
                                <div className="flex items-center gap-3">
                                    <div className="flex-shrink-0 w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                                        <ChevronLeft className="w-6 h-6 text-gray-400" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-xs text-gray-500 font-semibold uppercase">Предыдущий</div>
                                        <div className="text-sm text-gray-500">Первый эпизод</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Следующий эпизод */}
                    <div className="w-full">
                        {adjacentEpisodes.next ? (
                            <Link href={`/gallery/episode/${adjacentEpisodes.next.id}`}>
                                <div className="group bg-gray-800 border-2 border-yellow-400 rounded-lg p-4 hover:bg-gray-700 hover:border-yellow-300 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 min-w-0 text-right">
                                            <div className="text-xs text-yellow-400 font-semibold uppercase tracking-wide">Следующий</div>
                                            <div className="text-sm font-bold text-white truncate group-hover:text-yellow-100 transition-colors">
                                                {adjacentEpisodes.next.title}
                                            </div>
                                            <div className="text-xs text-gray-400 mt-1">
                                                Сезон {adjacentEpisodes.next.season.seasonNumber} • Эпизод {adjacentEpisodes.next.episodeNumber}
                                            </div>
                                        </div>
                                        <div className="flex-shrink-0 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center group-hover:bg-yellow-300 transition-colors">
                                            <ChevronRight className="w-6 h-6 text-black" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ) : (
                            <div className="bg-gray-800 border-2 border-gray-600 rounded-lg p-4 opacity-50">
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 text-right">
                                        <div className="text-xs text-gray-500 font-semibold uppercase">Следующий</div>
                                        <div className="text-sm text-gray-500">Последний эпизод</div>
                                    </div>
                                    <div className="flex-shrink-0 w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                                        <ChevronRight className="w-6 h-6 text-gray-400" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-4">
                <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="bg-gray-800 border-yellow-400 text-white" data-season={episode.season.seasonNumber}>
                        {episode.season.title}
                    </Badge>
                    <Badge variant="secondary" className="bg-yellow-400 text-black" data-episode={episode.episodeNumber}>
                        Эпизод {episode.episodeNumber}
                    </Badge>
                </div>

                <h1 className="text-2xl font-bold mb-4 text-white">{episode.title} - Сезон {episode.season.seasonNumber}, Серия {episode.episodeNumber}</h1>

                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center space-x-4">
                        <Avatar>
                            <AvatarFallback>{getInitials(user?.name ?? 'UN')}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="font-semibold capitalize text-white">{user?.name ?? 'Неизвестный автор'}</h2>
                            <p className="text-sm text-white">Автор эпизода</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2" />
                </div>

                <div className="flex items-center gap-4 mt-4 text-sm text-white">
                    <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {views} просмотров
                    </div>
                    <EpisodeLikeButton episodeId={episode.id} likes={likes} dislikes={dislikes} userLike={null} />
                    <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDateShort(episode.createdAt)}
                    </div>
                </div>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg mt-4 border-2 border-yellow-400">
                <p className="text-white">{episode.description}</p>
            </div>

            {/* Комментарии */}
            <div className="mt-8 space-y-6">
                <div className="bg-yellow-300 border-2 border-yellow-400 rounded-lg p-4">
                    <h2 className="text-2xl font-black text-black mb-4" style={{ textShadow: '2px 2px 0px #000000' }}>
                        &quot;OH MY GOD! THEY KILLED KENNY!&quot; - ОБСУЖДЕНИЕ ЭПИЗОДА
                    </h2>

                    <CommentForm episodeId={episode.id} />
                </div>

                <Suspense fallback={<div className="text-white">Загрузка комментариев...</div>}>
                    <CommentsList episodeId={episode.id} />
                </Suspense>
            </div>
        </>
    )
}

export default EpisodeContainer
