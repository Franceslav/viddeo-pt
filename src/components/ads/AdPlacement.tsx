'use client'

import { AdBanner, TextAd } from './index'

interface AdPlacementProps {
  partnerId: string
  placement: 'header' | 'sidebar' | 'footer' | 'between-content' | 'video-top' | 'video-bottom'
  className?: string
}

export default function AdPlacement({ partnerId, placement, className = '' }: AdPlacementProps) {
  switch (placement) {
    case 'header':
      return (
        <div className={`ad-placement-header ${className}`}>
          <AdBanner 
            partnerId={partnerId} 
            size="728x90" 
            className="mx-auto"
          />
        </div>
      )

    case 'sidebar':
      return (
        <div className={`ad-placement-sidebar ${className}`}>
          <AdBanner 
            partnerId={partnerId} 
            size="160x600" 
            type="sticky"
            position="right"
          />
        </div>
      )

    case 'footer':
      return (
        <div className={`ad-placement-footer ${className}`}>
          <AdBanner 
            partnerId={partnerId} 
            size="728x90" 
            className="mx-auto"
          />
        </div>
      )

    case 'between-content':
      return (
        <div className={`ad-placement-content ${className}`}>
          <TextAd 
            partnerId={partnerId}
            text="🎯 1xBet - Лучшие коэффициенты на спорт! Бонус до 25,000₽"
            className="text-center my-6"
          />
        </div>
      )

    case 'video-top':
      return (
        <div className={`ad-placement-video-top ${className}`}>
          <AdBanner 
            partnerId={partnerId} 
            size="300x250" 
            className="mx-auto mb-4"
          />
        </div>
      )

    case 'video-bottom':
      return (
        <div className={`ad-placement-video-bottom ${className}`}>
          <AdBanner 
            partnerId={partnerId} 
            size="300x250" 
            className="mx-auto mt-4"
          />
        </div>
      )

    default:
      return null
  }
}
