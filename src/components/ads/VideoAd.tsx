'use client'

import { useSession } from 'next-auth/react'

interface VideoAdProps {
  partnerId: string
  vastUrl?: string
  className?: string
  showForLoggedIn?: boolean
}

export default function VideoAd({ 
  partnerId, 
  className = '',
  showForLoggedIn = false
}: Omit<VideoAdProps, 'vastUrl'>) {
  const { data: session } = useSession()

  // Скрываем рекламу для авторизованных пользователей
  if (session?.user && !showForLoggedIn) {
    return null
  }

  // Если не передан VAST URL, используем дефолтный
  // const _defaultVastUrl = vastUrl || `https://partner.1xbet.com/vast?tag=${partnerId}`

  return (
    <div className={`video-ad ${className}`}>
      {/* VAST реклама будет интегрирована в плеер через PlayerJS */}
      <div className="text-center p-4 bg-gray-100 rounded-lg">
        <p className="text-sm text-gray-600 mb-2">Реклама</p>
        <a 
          href={`https://1xbet.com/?tag=${partnerId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          1xBet - Ставки на спорт
        </a>
      </div>
    </div>
  )
}

// Функция для получения VAST URL для интеграции с плеером
export function getVastUrl(partnerId: string): string {
  return `https://partner.1xbet.com/vast?tag=${partnerId}`
}
