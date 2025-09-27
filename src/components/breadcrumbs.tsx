import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

interface BreadcrumbItem {
  name: string
  href: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const allItems = [
    { name: "Главная", href: "/" },
    ...items
  ]

  // Структурированные данные для breadcrumbs
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": allItems.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://viddeo-pt-sp.vercel.app'}${item.href}`
    }))
  }

  return (
    <>
      {/* JSON-LD для breadcrumbs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-6" aria-label="Хлебные крошки">
        {allItems.map((item, index) => (
          <div key={`breadcrumb-${index}`} className="flex items-center">
            {index === 0 && <Home className="w-4 h-4 mr-1" />}
            {index > 0 && <ChevronRight className="w-4 h-4 mx-1" />}
            {index === allItems.length - 1 ? (
              <span className="text-white font-medium">{item.name}</span>
            ) : (
              <Link 
                href={item.href}
                className="hover:text-yellow-400 transition-colors duration-200"
              >
                {item.name}
              </Link>
            )}
          </div>
        ))}
      </nav>
    </>
  )
}
