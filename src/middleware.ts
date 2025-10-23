import { auth } from "@/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const protectedRoutes = ["/profile"]

export default async function middleware(req: NextRequest) {
  const session = await auth()
  const { pathname } = req.nextUrl

  // Проверяем защищенные маршруты
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!session && isProtected) {
    const absoluteUrl = new URL("/", req.nextUrl.origin);
    return NextResponse.redirect(absoluteUrl.toString());
  }

  // Создаем ответ
  const response = NextResponse.next()

  // Настройка X-Robots-Tag для различных типов страниц
  if (pathname.startsWith('/admin')) {
    // Админ-панель - полностью скрыть от поисковиков
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, nosnippet, noarchive')
  } else if (pathname.startsWith('/api')) {
    // API роуты - не индексировать
    response.headers.set('X-Robots-Tag', 'noindex, nofollow')
  } else if (pathname.startsWith('/profile')) {
    // Профили пользователей - приватные страницы
    response.headers.set('X-Robots-Tag', 'noindex, nofollow')
  } else if (pathname.startsWith('/auth')) {
    // Страницы авторизации - не индексировать
    response.headers.set('X-Robots-Tag', 'noindex, nofollow')
  } else if (pathname.startsWith('/_next') || pathname.startsWith('/favicon.ico')) {
    // Служебные файлы Next.js
    response.headers.set('X-Robots-Tag', 'noindex, nofollow')
  } else {
    // Обычные страницы - разрешить индексацию
    response.headers.set('X-Robots-Tag', 'index, follow')
  }

  return response
}
