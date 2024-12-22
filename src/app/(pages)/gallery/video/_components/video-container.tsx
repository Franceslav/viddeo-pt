import { trpc } from '@/app/server/routers/_app'
import React, { FC } from 'react'
import VideoPLayer from './video-player';
import SuggestedVideos from './suggested-videos';

interface Props {
  id: string;
}

const VideoContainer: FC<Props> = async ({ id }) => {

  const video = await trpc.video.getVideo({ id });

  return (
    <div className='flex flex-col lg:flex-row gap-8'>
      <div className='lg:w-2/3'>
        <VideoPLayer videoUrl={video.url} />
        <div className='flex flex-col gap-2'>
          <h2 className='text-2xl font-bold'>
            {video.title}
          </h2>
          <p className='text-sm text-gray-500'>
            {video.description}
          </p>
        </div>
      </div>
      <div className='lg:w-1/3 hidden lg:block'>
        <SuggestedVideos />
      </div>
    </div>
  )
}

export default VideoContainer