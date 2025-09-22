'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"
import { trpc } from "@/app/_trpc/client"
import { toast } from "sonner"
import FileUpload from "./file-upload"
import { EpisodeWithSeasonFromRouter } from "@/types/admin"

interface EpisodeFormProps {
    episode?: EpisodeWithSeasonFromRouter | null
    onClose: () => void
    userId: string
}

const EpisodeForm = ({ episode, onClose, userId }: EpisodeFormProps) => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        url: "",
        episodeNumber: 1,
        seasonId: "",
        image: "",
    })
    const isHls = formData.url.trim().toLowerCase().endsWith('.m3u8')
    const [isTesting, setIsTesting] = useState(false)

    const utils = trpc.useUtils()

    const { data: seasons } = trpc.season.getSeasons.useQuery()

    const { mutate: createEpisode, isPending: isCreating } = trpc.episode.createEpisode.useMutation({
        onSuccess: () => {
            utils.episode.getEpisodes.invalidate()
            toast.success("Эпизод создан")
            onClose()
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })

    const { mutate: updateEpisode, isPending: isUpdating } = trpc.episode.updateEpisode.useMutation({
        onSuccess: () => {
            utils.episode.getEpisodes.invalidate()
            toast.success("Эпизод обновлен")
            onClose()
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })

    useEffect(() => {
        if (episode) {
            setFormData({
                title: episode.title,
                description: episode.description,
                url: episode.url,
                episodeNumber: episode.episodeNumber,
                seasonId: episode.seasonId,
                image: episode.image ?? "",
            })
        }
    }, [episode])

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

        if (episode) {
            updateEpisode({
                id: episode.id,
                ...formData
            })
        } else {
            createEpisode({
                ...formData,
                userId: userId
            })
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
                                {episode ? "Редактировать эпизод" : "Создать эпизод"}
                            </CardTitle>
                            <CardDescription>
                                {episode ? "Обновите информацию об эпизоде" : "Добавьте новый эпизод"}
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
                            <Label htmlFor="title">Название эпизода</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => handleChange("title", e.target.value)}
                                placeholder="Например: Эпизод 1"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="seasonId">Сезон</Label>
                            <Select
                                value={formData.seasonId}
                                onValueChange={(value) => handleChange("seasonId", value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Выберите сезон" />
                                </SelectTrigger>
                                <SelectContent>
                                    {seasons?.map((season) => (
                                        <SelectItem key={season.id} value={season.id}>
                                            {season.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="episodeNumber">Номер эпизода</Label>
                            <Input
                                id="episodeNumber"
                                type="number"
                                min="1"
                                value={formData.episodeNumber}
                                onChange={(e) => handleChange("episodeNumber", parseInt(e.target.value))}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="url">URL видео</Label>
                            <Input
                                id="url"
                                type="url"
                                value={formData.url}
                                onChange={(e) => handleChange("url", e.target.value)}
                                placeholder="https://cdn.example.com/episodes/s01e01/master.m3u8"
                                required
                            />
                            {isHls ? (
                                <p className="text-xs text-green-600">Определён формат HLS (.m3u8). Плеер использует hls.js.</p>
                            ) : (
                                <p className="text-xs text-yellow-600">Рекомендуется HLS (.m3u8) для стабильного воспроизведения.</p>
                            )}
                            <div className="flex gap-2">
                                <Button type="button" variant="outline" size="sm" disabled={isTesting || !formData.url} onClick={async () => {
                                    try {
                                        setIsTesting(true)
                                        const r = await fetch(formData.url, { method: 'HEAD' })
                                        if (r.ok) {
                                            toast.success(`URL доступен (${r.status})`)
                                        } else {
                                            toast.error(`Проверка неудачна: ${r.status}`)
                                        }
                                    } catch (e: unknown) {
                                        toast.error((e as Error)?.message || 'Не удалось проверить')
                                    } finally {
                                        setIsTesting(false)
                                    }
                                }}>Проверить HLS</Button>
                                {isHls && (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">HLS</span>
                                )}
                            </div>
                        </div>

                        <FileUpload
                            onFileSelect={handleFileSelect}
                            onImageUrlChange={handleImageUrlChange}
                            currentImage={formData.image}
                        />

                        <div className="space-y-2">
                            <Label htmlFor="description">Описание</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => handleChange("description", e.target.value)}
                                placeholder="Описание эпизода..."
                                rows={3}
                                required
                            />
                        </div>

                        <div className="flex gap-2 pt-4">
                            <Button
                                type="submit"
                                disabled={isCreating || isUpdating}
                                className="flex-1"
                            >
                                {isCreating || isUpdating ? "Сохранение..." : (episode ? "Обновить" : "Создать")}
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

export default EpisodeForm
