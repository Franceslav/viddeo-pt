'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Eye, Image as ImageIcon, Link, Copy } from "lucide-react"
import { trpc } from "@/app/_trpc/client"
import { toast } from "sonner"
import UniversalEpisodeForm from "./universal-episode-form"
import Image from "next/image"
import { EpisodeWithSeasonFromRouter } from "@/types/admin"
import { createSimpleEpisodeSeoUrl } from "@/lib/transliteration"

interface EpisodesManagementProps {
    userId: string
}

const EpisodesManagement = ({ userId }: EpisodesManagementProps) => {
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingEpisode, setEditingEpisode] = useState<EpisodeWithSeasonFromRouter | null>(null)

    const utils = trpc.useUtils()

    const { data: episodes, isLoading } = trpc.episode.getEpisodes.useQuery()
    const { mutate: deleteEpisode } = trpc.episode.deleteEpisode.useMutation({
        onSuccess: () => {
            utils.episode.getEpisodes.invalidate()
            toast.success("Эпизод удален")
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })

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

    if (isLoading) {
        return <div>Загрузка...</div>
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Управление эпизодами</h2>
                <Button onClick={() => setIsFormOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Добавить эпизод
                </Button>
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
                                        <div className="mt-2 flex items-center gap-2">
                                            <Link className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-xs text-muted-foreground font-mono">
                                                {createSimpleEpisodeSeoUrl({
                                                    title: episode.title,
                                                    seasonNumber: episode.season.seasonNumber,
                                                    episodeNumber: episode.episodeNumber
                                                })}
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-6 w-6 p-0"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(`/gallery/episode/${episode.id}`)
                                                    toast.success("URL скопирован в буфер обмена")
                                                }}
                                            >
                                                <Copy className="w-3 h-3" />
                                            </Button>
                                        </div>
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
                <UniversalEpisodeForm
                    episode={editingEpisode}
                    onClose={handleFormClose}
                    userId={userId}
                />
            )}
        </div>
    )
}

export default EpisodesManagement
