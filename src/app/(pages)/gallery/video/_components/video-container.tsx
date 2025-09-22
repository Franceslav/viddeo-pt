import { trpc } from '@/app/server/routers/_app'
import { FC, Suspense } from 'react'
import VideoPLayer from './video-player';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatDateShort, getInitials } from '@/lib/utils';
import LikeButton from './like-button';
import PlayerJS from './playerjs'

interface Props {
  id: string;
}

const VideoContainer: FC<Props> = async ({ id }) => {

  const video = await trpc.video.getVideo({ id });

  const user = await trpc.user.getUserById({ userId: video.userId });

  await trpc.likes.getLikes.prefetch({ id: video.id });

  return (
    <>
      <PlayerJS src={video.url} poster={video.image} title={video.title} />
      <div className="">
        <h1 className="text-2xl font-bold mb-4">{video.title}</h1>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarFallback>{getInitials(user.name ?? 'UN')}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold capitalize">{user.name}</h2>
              <p className="text-sm text-gray-500">1M subscribers</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Suspense fallback={<div>Loading...</div>}>
              <LikeButton videoId={video.id} type="video" />
            </Suspense>
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-500">{video.views} views • {formatDateShort(video.createdAt)}</p>
      </div>
      <div className="bg-gray-100 p-4 rounded-lg">
        <p className=''>
          {video.description}
        </p>
      </div>
    </>
  )
}

export default VideoContainer