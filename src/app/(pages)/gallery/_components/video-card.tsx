'use client'

import { PlayCircle } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface VideoCardProps {
  id: string
  title: string
  views: number
  uploadedAt: string
  type?: 'video' | 'episode'
  image?: string | null
}

export function VideoCard({ id, title, views, uploadedAt, type = 'video', image }: VideoCardProps) {

  const router = useRouter()

  const handleClick = () => {
    if (type === 'episode') {
      router.push(`/gallery/episode/${id}`)
    } else {
      router.push(`/gallery/video/${id}`)
    }
  }

  return (
    <Card className="w-full group cursor-pointer" onClick={handleClick}>
      <CardContent className="p-0">
        <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
          {image ? (
            <Image src={image} alt={title} fill className="object-contain" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
          ) : (
            <Image src="/assets/placeholder-small.webp" alt="Video Thumbnail" fill className="object-contain" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" priority />
          )}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-50 rounded-xl">
            <PlayCircle className="w-12 h-12 text-white opacity-80" />
          </div>
        </div>
        <div className="p-4">
          <div className="flex flex-col">
            <h3 className="text-base font-semibold line-clamp-2 mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground">
              {views.toLocaleString()} views • {uploadedAt}
            </p>
            {type === 'episode' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1 w-fit">
                Эпизод
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}