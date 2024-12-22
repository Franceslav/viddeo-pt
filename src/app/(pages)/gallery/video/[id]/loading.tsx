import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const Loading = () => {
  return (
    <div className='flex flex-col gap-4'>
      <Skeleton className='aspect-video w-full h-full rounded-lg'/>
      <Skeleton className='w-full h-10 rounded-lg'/>
      <Skeleton className='w-full h-10 rounded-lg'/>
    </div>
  )
}

export default Loading