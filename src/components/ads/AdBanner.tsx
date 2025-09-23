'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface AdBannerProps {
  partnerId: string
  size?: '728x90' | '300x250' | '160x600' | '320x50'
  type?: 'banner' | 'sticky' | 'floating'
  position?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
  showForLoggedIn?: boolean
}

export default function AdBanner({ 
  partnerId, 
  size = '728x90', 
  type = 'banner',
  position = 'bottom',
  className = '',
  showForLoggedIn = false
}: AdBannerProps) {
  const { data: session } = useSession()
  const [isVisible, setIsVisible] = useState(true)

  // Скрываем рекламу для авторизованных пользователей (если не включено showForLoggedIn)
  useEffect(() => {
    if (session?.user && !showForLoggedIn) {
      setIsVisible(false)
    }
  }, [session, showForLoggedIn])

  // Размеры баннеров
  const bannerSizes = {
    '728x90': { width: 728, height: 90 },
    '300x250': { width: 300, height: 250 },
    '160x600': { width: 160, height: 600 },
    '320x50': { width: 320, height: 50 }
  }

  const dimensions = bannerSizes[size]

  if (!isVisible) return null

  const baseUrl = `https://1xbet.com/?tag=${partnerId}`
  
  // Стили для sticky/floating баннеров
  const getStickyStyles = () => {
    const baseStyles = {
      position: 'fixed' as const,
      zIndex: 999,
      backgroundColor: 'white',
      border: '1px solid #ddd',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    }

    switch (position) {
      case 'top':
        return { ...baseStyles, top: '10px', left: '50%', transform: 'translateX(-50%)' }
      case 'bottom':
        return { ...baseStyles, bottom: '10px', left: '50%', transform: 'translateX(-50%)' }
      case 'left':
        return { ...baseStyles, left: '10px', top: '50%', transform: 'translateY(-50%)' }
      case 'right':
        return { ...baseStyles, right: '10px', top: '50%', transform: 'translateY(-50%)' }
      default:
        return baseStyles
    }
  }

  const containerStyles = type === 'sticky' || type === 'floating' ? getStickyStyles() : {}

  return (
    <div 
      className={`ad-banner ${className}`}
      style={containerStyles}
    >
      <a 
        href={baseUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block"
      >
        <img
          src={`https://partner-cdn.1xbet.com/banner-${size}.gif`}
          alt="1xBet - Ставки на спорт"
          width={dimensions.width}
          height={dimensions.height}
          className="max-w-full h-auto"
          loading="lazy"
        />
      </a>
      
      {/* Кнопка закрытия для sticky баннеров */}
      {(type === 'sticky' || type === 'floating') && (
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-1 right-1 w-6 h-6 bg-gray-500 text-white rounded-full text-xs hover:bg-gray-700"
          aria-label="Закрыть рекламу"
        >
          ×
        </button>
      )}
    </div>
  )
}
