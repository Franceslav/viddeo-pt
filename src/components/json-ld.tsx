// import { ReactNode } from 'react'

interface JsonLdProps {
  data: object
}

/**
 * Компонент для вставки JSON-LD разметки
 */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data, null, 2)
      }}
    />
  )
}

export default JsonLd
