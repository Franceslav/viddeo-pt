import { trpc } from '@/app/server/routers/_app'
import React, { FC } from 'react'
import VideoPLayer from './video-player';

interface Props {
  id: string;
}

const VideoContainer: FC<Props> = async ({ id }) => {

  const video = await trpc.video.getVideo({ id });

  return (
    <div className='flex flex-col gap-4'>
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
  )
}

export default VideoContainer