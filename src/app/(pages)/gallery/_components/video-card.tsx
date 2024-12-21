'use client'

import { PlayCircle } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from 'next/navigation'

interface VideoCardProps {
  id: string
  title: string
  views: number
  uploadedAt: string
}

export function VideoCard({ id, title, views, uploadedAt }: VideoCardProps) {

  const router = useRouter()

  return (
    <Card className="w-full group cursor-pointer" onClick={() => router.push(`/gallery/video/${id}`)}>
      <CardContent className="p-0">
        <div className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden">
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
          </div>
        </div>
      </CardContent>
    </Card>
  )
}