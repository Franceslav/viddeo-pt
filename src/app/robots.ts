import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/_next/static/',
          '/_next/image/',
          '/assets/',
          '/uploads/'
        ],
        disallow: [
          '/admin/',
          '/api/',
          '/auth/',
          '/profile/',
          '/test-player-simple/',
          '/_next/webpack-hmr',
          '/_next/server/',
          '/_next/server-chunks/'
        ],
      },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://southpark-online.ru'}/sitemap.xml`,
  }
}
