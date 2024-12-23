import { trpc } from '@/app/server/routers/_app'
import { FC } from 'react'
import VideoPLayer from './video-player';
import { Button } from '@/components/ui/button';
import { ThumbsUp } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatDateShort, getInitials } from '@/lib/utils';

interface Props {
  id: string;
}

const VideoContainer: FC<Props> = async ({ id }) => {

  const video = await trpc.video.getVideo({ id });

  const user = await trpc.user.getUserById({ userId: video.userId });

  return (
    <>
      <VideoPLayer video={video} />
      <div className="">
        <h1 className="text-2xl font-bold mb-4">Awesome Video Title</h1>
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
            <Button variant="outline" size="sm">
              <ThumbsUp className="mr-2 h-4 w-4" /> 100K
            </Button>
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