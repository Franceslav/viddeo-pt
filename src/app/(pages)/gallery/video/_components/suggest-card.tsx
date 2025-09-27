'use client'

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FC } from "react";

interface Props {
  id: string;
  title: string;
  views: number;
  type?: 'video' | 'episode';
  image?: string | null;
  seasonNumber?: number;
  episodeNumber?: number;
}

const SuggestCard: FC<Props> = ({ id, title, views, type = 'video', image, seasonNumber, episodeNumber }) => {

  const router = useRouter()

  const handleClick = () => {
    if (type === 'episode' && seasonNumber && episodeNumber) {
      router.push(`/yuzhnyy-park/sezon-${seasonNumber}/seria-${episodeNumber}`)
    } else if (type === 'episode') {
      router.push(`/gallery/episode/${id}`)
    } else {
      router.push(`/gallery/video/${id}`)
    }
  }

  return (
    <Card className="w-full group cursor-pointer border-2 border-black shadow-lg bg-white hover:bg-yellow-100 transition-colors duration-300" onClick={handleClick}>
      <CardContent className="p-2 flex space-x-2">
        <div className="flex-shrink-0 w-40 h-24 bg-gray-200 rounded-lg overflow-hidden border-2 border-black">
          {image ? (
            <Image src={image} alt={title} width={160} height={90} className="w-full h-full object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" priority />
          ) : (
            <Image src="/assets/placeholder-small.webp" alt="Video Thumbnail" width={160} height={90} className="w-full h-full object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" priority />
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-black line-clamp-2 text-black mb-1" style={{ textShadow: '1px 1px 0px #000000' }}>
            {title}
          </h3>
          <p className="text-xs text-gray-600 font-semibold">
            {views} просмотров
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default SuggestCard