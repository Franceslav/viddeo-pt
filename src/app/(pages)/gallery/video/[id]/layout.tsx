import React from 'react'
import SuggestedVideos from '../_components/suggested-videos'
import Container from '@/components/container'

const VideoLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Container>
      <div className='flex flex-col lg:flex-row gap-8'>
        <div className='flex flex-col gap-4 lg:w-2/3'>
          {children}
        </div>
        <div className='lg:w-1/3 hidden lg:block'>
          <SuggestedVideos />
        </div>
      </div>
    </Container>
  )
}

export default VideoLayout