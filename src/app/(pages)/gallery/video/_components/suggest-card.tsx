'use client'

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FC } from "react";

interface Props {
  id: string;
  title: string;
  views: number;
}

const SuggestCard: FC<Props> = ({ id, title, views }) => {

  const router = useRouter()

  return (
    <Card className="w-full group cursor-pointer border-none shadow-none" onClick={() => router.push(`/gallery/video/${id}`)}>
      <CardContent className="p-0 flex space-x-2">
        <div className="flex-shrink-0 w-40 h-24 bg-gray-100 rounded-xl overflow-hidden">
          <Image src="/assets/placeholder-small.webp" alt="Video Thumbnail" width={160} height={90} className="w-full h-full object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" priority />
        </div>
        <div className="">
          <h3 className="text-base font-semibold line-clamp-2">{title}</h3>
          <p className="text-sm text-gray-500">
            Lorem ipsum dolor sit amet, consectetur.
          </p>
          <p className="text-sm text-gray-500">
            {views} views
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default SuggestCard