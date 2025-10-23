/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

interface VideoAdProps {
  partnerId: string
  vastUrl?: string
  className?: string
  showForLoggedIn?: boolean
}

export default function VideoAd({ 
  partnerId: _partnerId, 
  className: _className = '',
  showForLoggedIn: _showForLoggedIn = false
}: Omit<VideoAdProps, 'vastUrl'>) {
  // Временно отключено для улучшения SEO
  return null
}

// Функция для получения VAST URL для интеграции с плеером
export function getVastUrl(partnerId: string): string {
  return `https://partner.1xbet.com/vast?tag=${partnerId}`
}
