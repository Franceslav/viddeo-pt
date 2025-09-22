'use client'

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, X, Image as ImageIcon } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

interface FileUploadProps {
    onFileSelect: (file: File | null) => void
    onImageUrlChange?: (url: string) => void
    currentImage?: string | null
    className?: string
}

const FileUpload = ({ onFileSelect, onImageUrlChange, currentImage, className = "" }: FileUploadProps) => {
    const [preview, setPreview] = useState<string | null>(currentImage || null)
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileSelect = async (file: File | null) => {
        if (file) {
            // Проверяем тип файла
            if (!file.type.startsWith('image/')) {
                toast.error('Пожалуйста, выберите файл изображения')
                return
            }

            // Проверяем размер файла (максимум 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Размер файла не должен превышать 5MB')
                return
            }

            setIsUploading(true)

            try {
                // Создаем превью
                const reader = new FileReader()
                reader.onload = (e) => {
                    const result = e.target?.result as string
                    setPreview(result)
                }
                reader.readAsDataURL(file)

                // Загружаем файл на сервер
                const formData = new FormData()
                formData.append('file', file)

                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                })

                const result = await response.json()
                
                if (!result.success) {
                    throw new Error(result.error || 'Upload failed')
                }

                // Вызываем callback с URL загруженного файла
                onFileSelect(file)
                if (onImageUrlChange) {
                    onImageUrlChange(result.url)
                }
                toast.success('Файл успешно загружен')
            } catch (error) {
                console.error('Upload error:', error)
                toast.error('Ошибка загрузки файла')
                setPreview(null)
            } finally {
                setIsUploading(false)
            }
        } else {
            setPreview(null)
            onFileSelect(null)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        
        const files = e.dataTransfer.files
        if (files.length > 0) {
            handleFileSelect(files[0])
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
    }

    const handleButtonClick = () => {
        fileInputRef.current?.click()
    }

    const handleRemove = () => {
        setPreview(null)
        onFileSelect(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    return (
        <div className={`space-y-2 ${className}`}>
            <Label>Картинка</Label>
            
            <div
                className="border-2 border-dashed rounded-lg p-4 text-center transition-colors hover:border-muted-foreground/50"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
            >
                {preview ? (
                    <div className="space-y-2">
                        <div className="relative w-32 h-32 mx-auto rounded-lg overflow-hidden">
                            <Image
                                src={preview}
                                alt="Предварительный просмотр"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="flex gap-2 justify-center">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleButtonClick}
                                disabled={isUploading}
                            >
                                <Upload className="w-4 h-4 mr-2" />
                                Заменить
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleRemove}
                                disabled={isUploading}
                            >
                                <X className="w-4 h-4 mr-2" />
                                Удалить
                            </Button>
                        </div>
                        {isUploading && (
                            <p className="text-sm text-muted-foreground">Загрузка...</p>
                        )}
                    </div>
                ) : (
                    <div className="space-y-2">
                        <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground" />
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Перетащите изображение сюда или
                            </p>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleButtonClick}
                                className="mt-2"
                                disabled={isUploading}
                            >
                                <Upload className="w-4 h-4 mr-2" />
                                Выберите файл
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            PNG, JPG, GIF до 5MB
                        </p>
                    </div>
                )}
            </div>

            <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
                className="hidden"
            />
        </div>
    )
}

export default FileUpload
