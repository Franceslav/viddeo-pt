'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Home, Navigation, Users, MessageCircle, User, LogOut } from 'lucide-react'
import { Button } from './ui/button'
import { useSession, signOut } from 'next-auth/react'

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  {
    title: 'Главная',
    href: '/',
    icon: <Home className="w-3 h-3 sm:w-4 sm:h-4" />
  },
  {
    title: 'Навигация',
    href: '/gallery',
    icon: <Navigation className="w-3 h-3 sm:w-4 sm:h-4" />
  },
  {
    title: 'Персонажи',
    href: '/characters',
    icon: <Users className="w-3 h-3 sm:w-4 sm:h-4" />
  },
  {
    title: 'Комментарии',
    href: '/comments',
    icon: <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
  }
]

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { data: session } = useSession()

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' })
    setIsOpen(false)
  }

  return (
    <div className="md:hidden relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white border-2 border-black shadow-md hover:shadow-lg transform hover:scale-110 hover:rotate-3 transition-all duration-300"
      >
        {isOpen ? <X className="w-6 h-6 text-black" /> : <Menu className="w-6 h-6 text-black" />}
      </Button>
      
      {isOpen && (
        <div className="absolute top-full right-4 w-80 sm:w-72 md:w-64 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 border-4 border-black shadow-2xl rounded-lg z-40 mt-2 max-h-96 overflow-y-auto transform transition-all duration-300 ease-out animate-in slide-in-from-right-4 fade-in">
          <div className="px-4 py-4 space-y-2">
            {navItems.map(({ title, href, icon }, index) => (
              <Link
                key={title}
                href={href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-2 sm:gap-3 w-full text-xs sm:text-sm font-black text-black bg-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg border-2 border-black shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 ${
                  index % 2 === 0 ? 'hover:rotate-1' : 'hover:-rotate-1'
                }`}
                style={{ textShadow: '1px 1px 0px #000000' }}
              >
                {icon}
                {title}
              </Link>
            ))}
            
            {/* Разделитель */}
            <div className="border-t-2 border-black my-2"></div>
            
            {/* Кнопки профиля и выхода */}
            {session?.user ? (
              <>
                <Link
                  href="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 sm:gap-3 w-full text-xs sm:text-sm font-black text-black bg-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg border-2 border-black shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 hover:rotate-1"
                  style={{ textShadow: '1px 1px 0px #000000' }}
                >
                  <User className="w-3 h-3 sm:w-4 sm:h-4" />
                  Профиль
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 sm:gap-3 w-full text-xs sm:text-sm font-black text-black bg-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg border-2 border-black shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 hover:-rotate-1"
                  style={{ textShadow: '1px 1px 0px #000000' }}
                >
                  <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
                  Выйти
                </button>
              </>
            ) : (
              <Link
                href="/auth"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 sm:gap-3 w-full text-xs sm:text-sm font-black text-black bg-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg border-2 border-black shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 hover:rotate-1"
                style={{ textShadow: '1px 1px 0px #000000' }}
              >
                <User className="w-3 h-3 sm:w-4 sm:h-4" />
                Войти
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default MobileMenu
