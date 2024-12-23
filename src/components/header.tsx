import Link from 'next/link'
import { Tv, Video } from 'lucide-react'

import Container from './container'
import LoginBtn from './login-btn'
import UserMenu from './user-menu'
import { auth } from '@/auth'
import { cn } from '@/lib/utils'
import { buttonVariants } from './ui/button'


interface NavItem {
  title: string
  href: string
}

const navItems: NavItem[] = [
  {
    title: 'Gallery',
    href: '/gallery',
  },
  {
    title: 'Pricing',
    href: '/#',
  },
  {
    title: 'Support',
    href: '/#',
  }
]

const Header = async () => {

  const session = await auth()

  return (
    <header className='py-6'>
      <Container className='flex items-center justify-between md:!px-12'>
        <Link href='/' className='flex items-center gap-2'>
          <Video className='size-6' />
          <span className='text-lg font-bold'>Viddeo</span>
        </Link>
        <div className='flex-1 flex items-center justify-end gap-2 '>
          <nav className='flex-1 justify-center hidden md:flex'>
            <ul className='flex items-center gap-6'>
              {navItems.map(({ title, href }) => (
                <li key={title}>
                  <Link href={href} className='text-sm font-normal'>{title}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className='flex items-center justify-end gap-2'>
            <div className='flex md:hidden'>
              <Link href='/gallery' className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }))}>
                <Tv className='size-6' />
              </Link>
            </div>
            {session?.user ? <UserMenu name={session.user.name} /> : <LoginBtn />}
          </div>
        </div>
      </Container>
    </header>
  )
}

export default Header