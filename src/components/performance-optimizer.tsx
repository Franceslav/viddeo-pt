import Head from "next/head"

interface PerformanceOptimizerProps {
  preloadImages?: string[]
  preloadFonts?: string[]
}

export default function PerformanceOptimizer({ 
  preloadImages = [], 
  preloadFonts = [] 
}: PerformanceOptimizerProps) {
  return (
    <Head>
      {/* Preload critical images */}
      {preloadImages.map((image, index) => (
        <link
          key={`preload-image-${index}`}
          rel="preload"
          as="image"
          href={image}
          type="image/webp"
        />
      ))}
      
      {/* Preload critical fonts */}
      {preloadFonts.map((font, index) => (
        <link
          key={`preload-font-${index}`}
          rel="preload"
          as="font"
          href={font}
          type="font/woff2"
          crossOrigin="anonymous"
        />
      ))}
      
      {/* DNS prefetch for external domains */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* Resource hints for better performance */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="theme-color" content="#000000" />
    </Head>
  )
}
