'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { X } from "lucide-react"
import { trpc } from "@/app/_trpc/client"
import { toast } from "sonner"
import FileUpload from "./file-upload"
import { SeasonWithEpisodesFromRouter } from "@/types/admin"

interface SeasonFormProps {
    season?: SeasonWithEpisodesFromRouter | null
    onClose: () => void
}

const SeasonForm = ({ season, onClose }: SeasonFormProps) => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        seasonNumber: 1,
        image: "",
    })

    const utils = trpc.useUtils()

    const { mutate: createSeason, isPending: isCreating } = trpc.season.createSeason.useMutation({
        onSuccess: () => {
            utils.season.getSeasons.invalidate()
            toast.success("Сезон создан")
            onClose()
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })

    const { mutate: updateSeason, isPending: isUpdating } = trpc.season.updateSeason.useMutation({
        onSuccess: () => {
            utils.season.getSeasons.invalidate()
            toast.success("Сезон обновлен")
            onClose()
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })

    useEffect(() => {
        if (season) {
            setFormData({
                title: season.title,
                description: season.description ?? "",
                seasonNumber: season.seasonNumber,
                image: season.image ?? "",
            })
        }
    }, [season])

    const handleFileSelect = () => {
        // Файл обрабатывается в FileUpload компоненте
    }

    const handleImageUrlChange = (url: string) => {
        setFormData(prev => ({
            ...prev,
            image: url
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (season) {
            updateSeason({
                id: season.id,
                ...formData
            })
        } else {
            createSeason(formData)
        }
    }

    const handleChange = (field: string, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>
                                {season ? "Редактировать сезон" : "Создать сезон"}
                            </CardTitle>
                            <CardDescription>
                                {season ? "Обновите информацию о сезоне" : "Добавьте новый сезон"}
                            </CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" onClick={onClose}>
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Название сезона</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => handleChange("title", e.target.value)}
                                placeholder="Например: Сезон 1"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="seasonNumber">Номер сезона</Label>
                            <Input
                                id="seasonNumber"
                                type="number"
                                min="1"
                                value={formData.seasonNumber || ''}
                                onChange={(e) => {
                                    const value = parseInt(e.target.value)
                                    handleChange("seasonNumber", isNaN(value) ? 1 : value)
                                }}
                                required
                            />
                        </div>

                        <FileUpload
                            onFileSelect={handleFileSelect}
                            onImageUrlChange={handleImageUrlChange}
                            currentImage={formData.image}
                        />

                        <div className="space-y-2">
                            <Label htmlFor="description">Описание (необязательно)</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => handleChange("description", e.target.value)}
                                placeholder="Описание сезона..."
                                rows={3}
                            />
                        </div>

                        <div className="flex gap-2 pt-4">
                            <Button
                                type="submit"
                                disabled={isCreating || isUpdating}
                                className="flex-1"
                            >
                                {isCreating || isUpdating ? "Сохранение..." : (season ? "Обновить" : "Создать")}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                            >
                                Отмена
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default SeasonForm
