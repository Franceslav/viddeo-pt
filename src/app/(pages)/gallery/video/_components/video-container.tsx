import { trpc } from '@/app/server/routers/_app'
import React, { FC } from 'react'
import VideoPLayer from './video-player';
import { Skeleton } from '@/components/ui/skeleton';

interface Props {
  id: string;
}

export const VideoContainer: FC<Props> = async ({ id }) => {

  const video = await trpc.video.getVideo({ id });

  return (
    <>
      <VideoPLayer videoUrl={video.url} />
      <div className='flex flex-col gap-2'>
        <h2 className='text-2xl font-bold'>
          {video.title}
        </h2>
        <p className='text-sm text-gray-500'>
          {video.description}
        </p>
      </div>
    </>
  )
}


// TODO: Create separate component for loading state if needed
export const VideoContainerLoading = () => {
  return (
    <div className='flex flex-col gap-4'>
      <Skeleton className='aspect-video w-full h-full rounded-lg' />
      <Skeleton className='w-full h-10 rounded-lg' />
      <Skeleton className='w-full h-10 rounded-lg' />
    </div>
  )
}