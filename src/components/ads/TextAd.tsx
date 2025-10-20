/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

interface TextAdProps {
  partnerId: string
  text?: string
  className?: string
  showForLoggedIn?: boolean
}

export default function TextAd({ 
  partnerId: _partnerId, 
  text: _text = "Зарегистрируйся в 1xBet и получи бонус до 25,000₽!",
  className: _className = '',
  showForLoggedIn: _showForLoggedIn = false
}: TextAdProps) {
  // Временно отключено для улучшения SEO
  return null
}
