'use client'

import { useSession } from 'next-auth/react'

interface TextAdProps {
  partnerId: string
  text?: string
  className?: string
  showForLoggedIn?: boolean
}

export default function TextAd({ 
  partnerId, 
  text = "Зарегистрируйся в 1xBet и получи бонус до 25,000₽!",
  className = '',
  showForLoggedIn = false
}: TextAdProps) {
  const { data: session } = useSession()

  // Скрываем рекламу для авторизованных пользователей
  if (session?.user && !showForLoggedIn) {
    return null
  }

  const baseUrl = `https://1xbet.com/?tag=${partnerId}`

  return (
    <div className={`text-ad ${className}`}>
      <a 
        href={baseUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-block bg-gradient-to-r from-green-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-blue-700 transition-all duration-200 font-medium"
      >
        {text}
      </a>
    </div>
  )
}
