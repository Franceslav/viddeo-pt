'use client'

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Eye, Image as ImageIcon } from "lucide-react"
import { trpc } from "@/app/_trpc/client"
import { toast } from "sonner"
import EpisodeForm from "./episode-form"
import Image from "next/image"
import { EpisodeWithSeasonFromRouter } from "@/types/admin"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface EpisodesManagementProps {
    userId: string
}

const EpisodesManagement = ({ userId }: EpisodesManagementProps) => {
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingEpisode, setEditingEpisode] = useState<EpisodeWithSeasonFromRouter | null>(null)
    const [importUrl, setImportUrl] = useState("")
    const [importSeasonId, setImportSeasonId] = useState<string>("")
    const [startEpisodeNum, setStartEpisodeNum] = useState<number>(1)
    const [isImporting, setIsImporting] = useState(false)

    const utils = trpc.useUtils()

    const { data: episodes, isLoading } = trpc.episode.getEpisodes.useQuery()
    const { data: seasons } = trpc.season.getSeasons.useQuery()
    const { mutate: deleteEpisode } = trpc.episode.deleteEpisode.useMutation({
        onSuccess: () => {
            utils.episode.getEpisodes.invalidate()
            toast.success("Эпизод удален")
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })
    const { mutateAsync: createEpisode } = trpc.episode.createEpisode.useMutation()

    const handleEdit = (episode: EpisodeWithSeasonFromRouter) => {
        setEditingEpisode(episode)
        setIsFormOpen(true)
    }

    const handleDelete = (id: string) => {
        if (confirm("Вы уверены, что хотите удалить этот эпизод?")) {
            deleteEpisode({ id })
        }
    }

    const handleFormClose = () => {
        setIsFormOpen(false)
        setEditingEpisode(null)
    }

    const selectedSeasonTitle = useMemo(() => {
        return seasons?.find(s => s.id === importSeasonId)?.title || ""
    }, [seasons, importSeasonId])

    const handleImport = async () => {
        try {
            if (!importUrl) {
                toast.error("Укажите URL для импорта")
                return
            }
            if (!importSeasonId) {
                toast.error("Выберите сезон для импорта")
                return
            }
            setIsImporting(true)
            
            // Используем только HDRezka API
            const apiEndpoint = '/api/rezka/json'
            
            const res = await fetch(apiEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: importUrl })
            })
            if (!res.ok) {
                const err = await res.json().catch(() => ({}))
                throw new Error(err.error || `Ошибка запроса: ${res.status}`)
            }
            const data = await res.json()
            let items: Array<{ title: string; url: string; seasonNumber?: number; episodeNumber?: number; }> = []
            
            if (data.episodes && Array.isArray(data.episodes)) {
                // HDRezka формат
                items = data.episodes.map((ep: { title: string; url: string; seasonNumber: number; episodeNumber: number }) => ({
                    title: ep.title,
                    url: ep.url,
                    seasonNumber: ep.seasonNumber,
                    episodeNumber: ep.episodeNumber
                }))
            }
            
            if (!items.length) {
                toast.warning("Эпизоды не найдены по указанному URL")
                return
            }

            let created = 0
            for (let i = 0; i < items.length; i++) {
                const it = items[i]
                const epNum = it.episodeNumber && it.episodeNumber > 0 ? it.episodeNumber : (startEpisodeNum + i)
                try {
                    await createEpisode({
                        title: it.title || `Эпизод ${epNum}`,
                        description: it.title || `Импортировано из ${new URL(importUrl).hostname}`,
                        url: it.url,
                        episodeNumber: epNum,
                        seasonId: importSeasonId,
                        userId
                    })
                    created++
                } catch (e: unknown) {
                    // продолжаем импорт остальных
                    console.error(e)
                }
            }

            await utils.episode.getEpisodes.invalidate()
            toast.success(`Импорт завершен: создано ${created} из ${items.length}`)
        } catch (e: unknown) {
            toast.error((e as Error)?.message || 'Не удалось импортировать')
        } finally {
            setIsImporting(false)
        }
    }

    if (isLoading) {
        return <div>Загрузка...</div>
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold">Управление эпизодами</h2>
                    <Button onClick={() => setIsFormOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Добавить эпизод
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Импорт серий по URL</CardTitle>
                        <CardDescription>Вставьте ссылку на страницу HDRezka и выберите сезон. Серии будут созданы автоматически.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-3 md:grid-cols-4">
                        <div className="md:col-span-2">
                            <Label htmlFor="importUrl">URL страницы</Label>
                            <Input id="importUrl" placeholder="https://rezka.ag/cartoons/comedy/1760-yuzhny-park-1997-latest/87-paramount-comedy.html" value={importUrl} onChange={(e) => setImportUrl(e.target.value)} />
                        </div>
                        <div>
                            <Label>Сезон</Label>
                            <Select value={importSeasonId} onValueChange={setImportSeasonId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Выберите сезон" />
                                </SelectTrigger>
                                <SelectContent>
                                    {seasons?.map(s => (
                                        <SelectItem key={s.id} value={s.id}>{s.title}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="startEp">Старт. номер</Label>
                            <Input id="startEp" type="number" min={1} value={startEpisodeNum} onChange={(e) => setStartEpisodeNum(Number(e.target.value) || 1)} />
                        </div>
                        <div className="md:col-span-4">
                            <Button onClick={handleImport} disabled={isImporting}>
                                Импортировать{selectedSeasonTitle ? ` → ${selectedSeasonTitle}` : ''}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4">
                {episodes?.map((episode) => (
                    <Card key={episode.id}>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div className="flex gap-4">
                                    {episode.image ? (
                                        <div className="w-20 h-20 relative rounded-lg overflow-hidden flex-shrink-0">
                                            <Image
                                                src={episode.image}
                                                alt={episode.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                                            <ImageIcon className="w-8 h-8 text-muted-foreground" />
                                        </div>
                                    )}
                                    <div>
                                        <CardTitle className="flex items-center gap-2">
                                            {episode.title}
                                            <Badge variant="outline">
                                                {episode.season.title} - Эпизод {episode.episodeNumber}
                                            </Badge>
                                        </CardTitle>
                                        <CardDescription>
                                            {episode.views} просмотров • {episode.likes.length} лайков
                                        </CardDescription>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => window.open(episode.url, '_blank')}
                                    >
                                        <Eye className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleEdit(episode)}
                                    >
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDelete(episode.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                {episode.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {isFormOpen && (
                <EpisodeForm
                    episode={editingEpisode}
                    onClose={handleFormClose}
                    userId={userId}
                />
            )}
        </div>
    )
}

export default EpisodesManagement
