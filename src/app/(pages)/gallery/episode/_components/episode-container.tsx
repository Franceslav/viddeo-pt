import { trpc } from '@/app/server/routers/_app'
import { FC, Suspense } from 'react'
import PlayerJS from '../../video/_components/playerjs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDateShort, getInitials } from '@/lib/utils';
import EpisodeLikeButton from './episode-like-button';
import CommentForm from './comment-form';
import CommentsList from './comments-list';
import Link from 'next/link';
import { ArrowLeft, Calendar, Eye } from 'lucide-react';

interface Props {
  id: string;
}

const EpisodeContainer: FC<Props> = async ({ id }) => {
  const episode = await trpc.episode.getEpisode({ id });
  const user = await trpc.user.getUserById({ userId: episode.userId });
  const likesData = await trpc.likes.getLikes({ id: episode.id });

  // Увеличиваем просмотры
  await trpc.episode.increaseViews({ id: episode.id });

  return (
    <>
      <div className="mb-4">
        <Button variant="outline" size="sm" asChild className="bg-gray-800 border-yellow-400 text-white hover:bg-gray-700">
          <Link href={`/gallery/season/${episode.seasonId}`}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад к сезону
          </Link>
        </Button>
      </div>

            <PlayerJS 
              src={episode.url} 
              poster={episode.image} 
              title={episode.title}
              showPlayerSelector={false}
              showLightToggle={true}
              showFullscreen={true}
            />
      
      <div className="mt-4">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline" className="bg-gray-800 border-yellow-400 text-white">{episode.season.title}</Badge>
          <Badge variant="secondary" className="bg-yellow-400 text-black">Эпизод {episode.episodeNumber}</Badge>
        </div>
        
        <h1 className="text-2xl font-bold mb-4 text-white">{episode.title}</h1>
        
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarFallback>{getInitials(user.name ?? 'UN')}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold capitalize text-white">{user.name}</h2>
              <p className="text-sm text-white">Автор эпизода</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
          </div>
        </div>
        
        <div className="flex items-center gap-4 mt-4 text-sm text-white">
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            {episode.views + 1} просмотров
          </div>
          <EpisodeLikeButton
            episodeId={episode.id}
            likes={likesData.likes}
            dislikes={likesData.dislikes}
            userLike={null}
          />
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {formatDateShort(episode.createdAt)}
          </div>
        </div>
      </div>
      
      <div className="bg-gray-800 p-4 rounded-lg mt-4 border-2 border-yellow-400">
        <p className="text-white">
          {episode.description}
        </p>
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