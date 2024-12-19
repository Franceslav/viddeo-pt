import Link from 'next/link'
import { MenuIcon, Video } from 'lucide-react'

import Container from './container'
import LoginBtn from './login-btn'


interface NavItem {
  title: string
  href: string
}

const navItems: NavItem[] = [
  {
    title: 'Features',
    href: '/features',
  },
  {
    title: 'Pricing',
    href: '/pricing',
  },
  {
    title: 'Support',
    href: '/support',
  }
]

const Header = () => {
  return (
    <header className='py-6'>
      <Container className='flex items-center justify-between md:!px-12'>
        <Link href='/' className='flex items-center gap-2'>
          <Video className='size-6' />
          <span className='text-lg font-bold'>Viddeo</span>
        </Link>
        <div className='flex-1 hidden md:flex items-center gap-2 '>
          <nav className='flex-1 flex justify-center'>
            <ul className='flex items-center gap-6'>
              {navItems.map(({ title, href }) => (
                <li key={title}>
                  <Link href={href} className='text-sm font-normal'>{title}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <LoginBtn />
        </div>
        <div className='flex md:hidden'>
          <MenuIcon className='size-6' />
        </div>
      </Container>
    </header>
  )
}

export default Header