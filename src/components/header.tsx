import Link from 'next/link'
import Image from 'next/image'

import Container from './container'
import LoginBtn from './login-btn'
import UserMenu from './user-menu'
import MobileMenu from './mobile-menu'
import { auth } from '@/auth'
import { trpc } from '@/app/server/routers/_app'


interface NavItem {
  title: string
  href: string
}

const navItems: NavItem[] = [
  {
    title: 'Главная',
    href: '/',
  },
  {
    title: 'Навигация',
    href: '/gallery',
  },
  {
    title: 'Персонажи',
    href: '/characters',
  },
  {
    title: 'Комментарии',
    href: '/comments',
  }
]

const Header = async () => {

  const session = await auth()
  
  // Получаем данные пользователя для аватарки
  let userImage = null
  if (session?.user?.id) {
    try {
      const user = await trpc.user.getUserById({ userId: session.user.id })
      userImage = user.image
    } catch {
      // Игнорируем ошибки получения пользователя
    }
  }

  return (
    <header className='relative py-4 sm:py-6 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 border-b-4 border-black shadow-lg overflow-visible z-50'>
      <Container className='flex items-center justify-between md:!px-12 overflow-visible relative z-50'>
        <Link href='/' className='flex items-center gap-1 sm:gap-2 group'>
          <Image 
            src="/assets/KennyMcCormick.webp"
            alt="South Park Logo" 
            width={40}
            height={40}
            className="h-8 sm:h-10 w-auto object-contain transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 drop-shadow-lg bg-transparent"
          />
          <span className='text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-white transform group-hover:scale-105 group-hover:-rotate-1 transition-all duration-300 relative px-1 sm:px-2 py-1 rounded' style={{ textShadow: '1px 1px 0px #000000, 2px 2px 0px #ff0000, 3px 3px 0px #000000, 4px 4px 0px #ff0000' }}>
            <span className="absolute inset-0 bg-black bg-opacity-30 rounded -z-10"></span>
            ЮЖНЫЙ ПАРК
          </span>
        </Link>
        <div className='flex-1 flex items-center justify-end gap-1 sm:gap-2 '>
          <nav className='flex-1 justify-center hidden md:flex'>
            <ul className='flex items-center gap-4 lg:gap-6'>
              {navItems.map(({ title, href }, index) => (
                <li key={title} className={`transform hover:scale-110 hover:-rotate-2 transition-all duration-300 ${index % 2 === 0 ? 'hover:rotate-2' : 'hover:-rotate-2'}`}>
                  <Link 
                    href={href} 
                    className='text-xs lg:text-sm font-black text-black bg-white px-2 lg:px-3 py-1 lg:py-2 rounded-lg border-2 border-black shadow-md hover:shadow-lg transition-all duration-300'
                    style={{ textShadow: '1px 1px 0px #000000' }}
                  >
                    {title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className='flex items-center justify-end gap-1 sm:gap-2'>
            <MobileMenu />
            <div className="transform hover:scale-105 transition-transform duration-300">
              {session?.user ? <UserMenu name={session.user.name} image={userImage} /> : <LoginBtn />}
            </div>
          </div>
        </div>
      </Container>
    </header>
  )
}

export default Header