'use client'

import { ErrorBoundary } from 'react-error-boundary'

const EpisodeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      {children}
    </ErrorBoundary>
  )
}

export default EpisodeLayout
