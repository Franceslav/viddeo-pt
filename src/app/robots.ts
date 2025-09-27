import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/api/',
        '/_next/',
        '/auth/',
        '/profile/',
        '/test-player-simple/'
      ],
    },
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://viddeo-pt-sp.vercel.app'}/sitemap.xml`,
  }
}
