'use client'

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { X, Image as ImageIcon } from "lucide-react"

interface ImagePreviewProps {
    imageUrl: string
    alt: string
    onRemove?: () => void
    className?: string
}

const ImagePreview = ({ imageUrl, alt, onRemove, className = "" }: ImagePreviewProps) => {
    const [imageError, setImageError] = useState(false)

    if (imageError) {
        return (
            <div className={`w-20 h-20 bg-muted rounded-lg flex items-center justify-center ${className}`}>
                <ImageIcon className="w-8 h-8 text-muted-foreground" />
            </div>
        )
    }

    return (
        <div className={`relative w-20 h-20 rounded-lg overflow-hidden group ${className}`}>
            <Image
                src={imageUrl}
                alt={alt}
                fill
                className="object-cover"
                onError={() => setImageError(true)}
            />
            {onRemove && (
                <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-1 right-1 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={onRemove}
                >
                    <X className="w-3 h-3" />
                </Button>
            )}
        </div>
    )
}

export default ImagePreview
