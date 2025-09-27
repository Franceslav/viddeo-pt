'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { trpc } from "@/app/_trpc/client"
import { EpisodeWithSeasonFromRouter } from "@/types/admin"
import { X, Play, Upload, CheckCircle } from "lucide-react"
import FileUpload from "./file-upload"

interface UniversalEpisodeFormProps {
    episode?: EpisodeWithSeasonFromRouter | null
    onClose: () => void
    userId: string
}

const UniversalEpisodeForm = ({ episode, onClose, userId }: UniversalEpisodeFormProps) => {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [url, setUrl] = useState("")
    const [episodeNumber, setEpisodeNumber] = useState(1)
    const [seasonId, setSeasonId] = useState("")
    const [image, setImage] = useState("")
    const [, setUploadedFile] = useState<File | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [activeTab, setActiveTab] = useState("manual")
    
    
    // Для RUTUBE
    const [rutubeUrl, setRutubeUrl] = useState("")
    const [isRutubeLoading, setIsRutubeLoading] = useState(false)
    const [rutubeMetadata, setRutubeMetadata] = useState<Record<string, unknown> | null>(null)

    const utils = trpc.useUtils()
    const { data: seasons } = trpc.season.getSeasons.useQuery()
    const { mutateAsync: createEpisode } = trpc.episode.createEpisode.useMutation()
    const { mutateAsync: updateEpisode } = trpc.episode.updateEpisode.useMutation()

    // Инициализация формы для редактирования
    useEffect(() => {
        if (episode) {
            setTitle(episode.title)
            setDescription(episode.description)
            setUrl(episode.url)
            setEpisodeNumber(episode.episodeNumber)
            setSeasonId(episode.seasonId)
            // Если нет изображения, используем заглушку
            setImage(episode.image || "/assets/placeholder-medium.webp")
            setActiveTab("manual")
        } else {
            // При создании нового эпизода устанавливаем заглушку
            setImage("/assets/placeholder-medium.webp")
        }
    }, [episode])

    // Определяем тип URL
    const isRutubeUrl = (url: string) => {
        return /rutube\.ru/.test(url)
    }

    const isEmbedUrl = (url: string) => {
        return /rutube\.ru\/play\/embed/.test(url)
    }

    // Обработка RUTUBE URL
    const handleRutubeUrlChange = async (newUrl: string) => {
        setRutubeUrl(newUrl)
        
        if (!newUrl || !isRutubeUrl(newUrl)) {
            setRutubeMetadata(null)
            return
        }

        setIsRutubeLoading(true)
        try {
            // Извлекаем video ID
            let videoId = ""
            if (isEmbedUrl(newUrl)) {
                const match = newUrl.match(/embed\/([^/?]+)/)
                videoId = match?.[1] || ""
            } else {
                const match = newUrl.match(/rutube\.ru\/(?:video|shorts)\/([^/?]+)/)
                videoId = match?.[1] || ""
            }

            if (videoId) {
                const response = await fetch(`/api/rutube/metadata?id=${videoId}`)
                const data = await response.json()
                
                if (data.success) {
                    setRutubeMetadata(data)
                    setTitle(data.title || "")
                    setDescription(data.description || "")
                    // Если нет thumbnail, используем заглушку
                    setImage(data.thumbnail || "/assets/placeholder-medium.webp")
                }
            }
        } catch (error) {
            console.error('RUTUBE metadata error:', error)
        } finally {
            setIsRutubeLoading(false)
        }
    }

    // Конвертация RUTUBE URL в embed
    const convertToEmbedUrl = (url: string) => {
        if (isEmbedUrl(url)) return url
        
        const videoIdMatch = url.match(/rutube\.ru\/(?:video|shorts)\/([^/?]+)/)
        if (videoIdMatch) {
            const videoId = videoIdMatch[1]
            return `https://rutube.ru/play/embed/${videoId}`
        }
        return url
    }

    // Проверка URL
    const checkUrl = async () => {
        if (!url) return

        if (isRutubeUrl(url)) {
            try {
                const videoIdMatch = url.match(/rutube\.ru\/(?:video|shorts|play\/embed)\/([^/?]+)/)
                if (videoIdMatch) {
                    const response = await fetch(`/api/rutube/metadata?id=${videoIdMatch[1]}`)
                    const data = await response.json()
                    
                    if (data.success) {
                        setTitle(data.title || "")
                        setDescription(data.description || "")
                        // Если нет thumbnail, используем заглушку
                        setImage(data.thumbnail || "/assets/placeholder-medium.webp")
                        toast.success(`RUTUBE видео: ${data.title}`)
                    } else {
                        toast.error("Не удалось получить информацию о видео")
                    }
                }
            } catch {
                toast.error("Ошибка проверки RUTUBE видео")
            }
        } else {
            // Для других URL просто проверяем доступность
            try {
                const response = await fetch(url, { method: 'HEAD' })
                if (response.ok) {
                    toast.success("URL доступен")
                } else {
                    toast.warning(`URL недоступен (${response.status})`)
                }
            } catch {
                toast.error("URL недоступен")
            }
        }
    }

    // Сохранение эпизода
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!title || !seasonId) {
            toast.error("Заполните обязательные поля")
            return
        }

        setIsLoading(true)
        try {
            // Если нет изображения, используем заглушку
            let finalImage = image
            if (!finalImage) {
                finalImage = "/assets/placeholder-medium.webp"
            }

            const episodeData = {
                title,
                description,
                url: isRutubeUrl(url) ? convertToEmbedUrl(url) : url,
                episodeNumber,
                seasonId,
                image: finalImage, // Всегда устанавливаем изображение
                userId
            }

            if (episode) {
                await updateEpisode({ id: episode.id, ...episodeData })
                toast.success("Эпизод обновлен")
            } else {
                await createEpisode(episodeData)
                toast.success("Эпизод создан")
            }

            utils.episode.getEpisodes.invalidate()
            onClose()
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Ошибка сохранения"
            toast.error(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }


    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>{episode ? "Редактировать эпизод" : "Добавить эпизод"}</CardTitle>
                        <CardDescription>Универсальная форма для добавления эпизодов</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" onClick={onClose}>
                        <X className="w-4 h-4" />
                    </Button>
                </CardHeader>
                
                <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="manual">
                                <Upload className="w-4 h-4 mr-2" />
                                Вручную
                            </TabsTrigger>
                            <TabsTrigger value="rutube">
                                <Play className="w-4 h-4 mr-2" />
                                RUTUBE
                            </TabsTrigger>
                        </TabsList>

                        {/* Ручное добавление */}
                        <TabsContent value="manual" className="space-y-4">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <Label htmlFor="title">Название *</Label>
                                        <Input
                                            id="title"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="Название эпизода"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="episodeNumber">Номер эпизода *</Label>
                                        <Input
                                            id="episodeNumber"
                                            type="number"
                                            min={1}
                                            value={episodeNumber}
                                            onChange={(e) => setEpisodeNumber(Number(e.target.value) || 1)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="season">Сезон *</Label>
                                    <Select value={seasonId} onValueChange={setSeasonId} required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Выберите сезон" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {seasons?.map(season => (
                                                <SelectItem key={season.id} value={season.id}>
                                                    {season.title}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="url">URL видео *</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="url"
                                            value={url}
                                            onChange={(e) => setUrl(e.target.value)}
                                            placeholder="https://example.com/video.mp4 или RUTUBE ссылка"
                                            className="flex-1"
                                            required
                                        />
                                        <Button type="button" variant="outline" onClick={checkUrl}>
                                            Проверить
                                        </Button>
                                    </div>
                                    {isRutubeUrl(url) && !isEmbedUrl(url) && (
                                        <div className="mt-2 flex items-center gap-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setUrl(convertToEmbedUrl(url))}
                                            >
                                                → Embed
                                            </Button>
                                            <span className="text-xs text-muted-foreground">
                                                Конвертировать в embed URL
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="description">Описание</Label>
                                    <Textarea
                                        id="description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Описание эпизода"
                                        rows={3}
                                    />
                                </div>

                                <div>
                                    <FileUpload
                                        onFileSelect={setUploadedFile}
                                        onImageUrlChange={setImage}
                                        currentImage={image}
                                    />
                                </div>

                                <div className="flex justify-end gap-2">
                                    <Button type="button" variant="outline" onClick={onClose}>
                                        Отмена
                                    </Button>
                                    <Button type="submit" disabled={isLoading}>
                                        {isLoading ? "Сохранение..." : episode ? "Обновить" : "Создать"}
                                    </Button>
                                </div>
                            </form>
                        </TabsContent>

                        {/* RUTUBE */}
                        <TabsContent value="rutube" className="space-y-4">
                            <div>
                                <Label htmlFor="rutubeUrl">RUTUBE ссылка *</Label>
                                <Input
                                    id="rutubeUrl"
                                    value={rutubeUrl}
                                    onChange={(e) => handleRutubeUrlChange(e.target.value)}
                                    placeholder="https://rutube.ru/video/... или embed ссылка"
                                    className="mb-2"
                                />
                                {isRutubeLoading && (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full"></div>
                                        Получение метаданных...
                                    </div>
                                )}
                                {rutubeMetadata && (
                                    <div className="p-3 bg-muted rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                            <span className="font-medium">Метаданные получены</span>
                                        </div>
                                        <div className="text-sm space-y-1">
                                            <div><strong>Название:</strong> {String(rutubeMetadata.title || '')}</div>
                                            <div><strong>Автор:</strong> {String(rutubeMetadata.author || '')}</div>
                                            <div><strong>Длительность:</strong> {String(rutubeMetadata.duration || '')}</div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <Label htmlFor="rutubeTitle">Название</Label>
                                    <Input
                                        id="rutubeTitle"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Название эпизода"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="rutubeEpisodeNumber">Номер эпизода</Label>
                                    <Input
                                        id="rutubeEpisodeNumber"
                                        type="number"
                                        min={1}
                                        value={episodeNumber}
                                        onChange={(e) => setEpisodeNumber(Number(e.target.value) || 1)}
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="rutubeSeason">Сезон *</Label>
                                <Select value={seasonId} onValueChange={setSeasonId} required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Выберите сезон" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {seasons?.map(season => (
                                            <SelectItem key={season.id} value={season.id}>
                                                {season.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="rutubeDescription">Описание</Label>
                                <Textarea
                                    id="rutubeDescription"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Описание эпизода"
                                    rows={3}
                                />
                            </div>

                            <div>
                                <FileUpload
                                    onFileSelect={setUploadedFile}
                                    onImageUrlChange={setImage}
                                    currentImage={image}
                                />
                            </div>

                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={onClose}>
                                    Отмена
                                </Button>
                                <Button 
                                    onClick={() => {
                                        if (rutubeUrl) {
                                            setUrl(convertToEmbedUrl(rutubeUrl))
                                            setActiveTab("manual")
                                        }
                                    }}
                                    disabled={!rutubeUrl || !seasonId}
                                >
                                    Добавить RUTUBE видео
                                </Button>
                            </div>
                        </TabsContent>

                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}

export default UniversalEpisodeForm
