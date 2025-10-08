import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
    }
  },
  images: {
    // Отключаем оптимизацию, чтобы локальные файлы из public/uploads отдавались без прокси _next/image
    unoptimized: true,
  },
  // Настройка для статических файлов
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: '/uploads/:path*',
      },
    ]
  },
  // Настройка для статических файлов
  trailingSlash: false,
  generateEtags: false,
  // Настройка заголовков для статических файлов
  async headers() {
    return [
      {
        source: '/uploads/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Принудительное использование HTTPS
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
        ],
      },
    ]
  },
  // HTTPS редиректы
  async redirects() {
    return [
      // Редирект с HTTP на HTTPS
      {
        source: '/(.*)',
        has: [
          {
            type: 'header',
            key: 'x-forwarded-proto',
            value: 'http',
          },
        ],
        destination: 'https://southpark-online.ru/:path*',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
