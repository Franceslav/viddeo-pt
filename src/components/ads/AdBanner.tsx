/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

interface AdBannerProps {
  partnerId: string
  size?: '728x90' | '300x250' | '160x600' | '320x50'
  type?: 'banner' | 'sticky' | 'floating'
  position?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
  showForLoggedIn?: boolean
}

export default function AdBanner({ 
  partnerId: _partnerId, 
  size: _size = '728x90', 
  type: _type = 'banner',
  position: _position = 'bottom',
  className: _className = '',
  showForLoggedIn: _showForLoggedIn = false
}: AdBannerProps) {
  // Временно отключено для улучшения SEO
  return null
}
