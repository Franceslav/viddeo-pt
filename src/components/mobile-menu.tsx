'use client'

import { useState, useEffect, useRef } from 'react'
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
    icon: <Home className="w-4 h-4" />
  },
  {
    title: 'Навигация',
    href: '/gallery',
    icon: <Navigation className="w-4 h-4" />
  },
  {
    title: 'Персонажи',
    href: '/characters',
    icon: <Users className="w-4 h-4" />
  },
  {
    title: 'Комментарии',
    href: '/comments',
    icon: <MessageCircle className="w-4 h-4" />
  }
]

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { data: session } = useSession()
  const menuRef = useRef<HTMLDivElement>(null)

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' })
    setIsOpen(false)
  }

  // Закрытие меню при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Закрытие меню при изменении размера экрана
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) { // md breakpoint
        setIsOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Закрытие меню при нажатии Escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  return (
    <div ref={menuRef} className="md:hidden relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white border-2 border-black shadow-md hover:shadow-lg transform hover:scale-110 hover:rotate-3 transition-all duration-300"
      >
        {isOpen ? <X className="w-6 h-6 text-black" /> : <Menu className="w-6 h-6 text-black" />}
      </Button>
      
      {isOpen && (
        <div className="fixed top-20 right-4 w-72 sm:w-80 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 border-4 border-black shadow-2xl rounded-lg z-50 max-h-96 overflow-y-auto transform transition-all duration-300 ease-out animate-in slide-in-from-right-4 fade-in">
          <div className="px-4 py-4 space-y-2">
            {navItems.map(({ title, href, icon }, index) => (
              <Link
                key={title}
                href={href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-2 w-full text-sm font-black text-black bg-white px-3 py-2 rounded-lg border-2 border-black shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 ${
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
                  className="flex items-center gap-2 w-full text-sm font-black text-black bg-white px-3 py-2 rounded-lg border-2 border-black shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 hover:rotate-1"
                  style={{ textShadow: '1px 1px 0px #000000' }}
                >
                  <User className="w-4 h-4" />
                  Профиль
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full text-sm font-black text-black bg-white px-3 py-2 rounded-lg border-2 border-black shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 hover:-rotate-1"
                  style={{ textShadow: '1px 1px 0px #000000' }}
                >
                  <LogOut className="w-4 h-4" />
                  Выйти
                </button>
              </>
            ) : (
              <Link
                href="/auth"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 w-full text-sm font-black text-black bg-white px-3 py-2 rounded-lg border-2 border-black shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 hover:rotate-1"
                style={{ textShadow: '1px 1px 0px #000000' }}
              >
                <User className="w-4 h-4" />
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
