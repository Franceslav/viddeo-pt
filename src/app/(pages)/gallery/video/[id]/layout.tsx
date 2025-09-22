import React, { Suspense } from 'react'
import SuggestedVideos from '../_components/suggested-videos'
import Container from '@/components/container'
import { ErrorBoundary } from 'react-error-boundary'

const VideoLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Container>
      <div className='flex flex-col lg:flex-row gap-8'>
        <div className='flex flex-col gap-4 lg:w-2/3'>
          <ErrorBoundary fallback={<div>Something went wrong</div>}>
            {children}
          </ErrorBoundary>
        </div>
        {/* TODO: Find the best way to cache this component and avoid re-rendering on every page load */}
        <div className='lg:w-1/3 hidden lg:block'>
          <ErrorBoundary fallback={<div>Something went wrong with suggested videos</div>}>
            <Suspense fallback={<div>Loading suggested videos...</div>}>
              <SuggestedVideos />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </Container>
  )
}

export default VideoLayout