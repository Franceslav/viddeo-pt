'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Eye, EyeOff, Image as ImageIcon, Link, Copy } from "lucide-react"
import { trpc } from "@/app/_trpc/client"
import { toast } from "sonner"
import SeasonForm from "./season-form"
import Image from "next/image"
import { SeasonWithEpisodesFromRouter } from "@/types/admin"
import { seasonSlug } from "@/lib/slugify"

const SeasonsManagement = () => {
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingSeason, setEditingSeason] = useState<SeasonWithEpisodesFromRouter | null>(null)

    const utils = trpc.useUtils()

    const { data: seasons, isLoading } = trpc.season.getSeasons.useQuery()
    const { mutate: deleteSeason } = trpc.season.deleteSeason.useMutation({
        onSuccess: () => {
            utils.season.getSeasons.invalidate()
            toast.success("Сезон удален")
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })
    const { mutate: updateSeason } = trpc.season.updateSeason.useMutation({
        onSuccess: () => {
            utils.season.getSeasons.invalidate()
            toast.success("Сезон обновлен")
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })

    const handleEdit = (season: SeasonWithEpisodesFromRouter) => {
        setEditingSeason(season)
        setIsFormOpen(true)
    }

    const handleDelete = (id: string) => {
        if (confirm("Вы уверены, что хотите удалить этот сезон?")) {
            deleteSeason({ id })
        }
    }

    const handleToggleActive = (season: SeasonWithEpisodesFromRouter) => {
        updateSeason({
            id: season.id,
            isActive: !season.isActive
        })
    }

    const handleFormClose = () => {
        setIsFormOpen(false)
        setEditingSeason(null)
    }

    if (isLoading) {
        return <div>Загрузка...</div>
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Управление сезонами</h2>
                <Button onClick={() => setIsFormOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Добавить сезон
                </Button>
            </div>

            <div className="grid gap-4">
                {seasons?.map((season) => (
                    <Card key={season.id}>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div className="flex gap-4">
                                    {season.image ? (
                                        <div className="w-20 h-20 relative rounded-lg overflow-hidden flex-shrink-0">
                                            <Image
                                                src={season.image}
                                                alt={season.title}
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
                                            {season.title}
                                            <Badge variant={season.isActive ? "default" : "secondary"}>
                                                {season.isActive ? "Активен" : "Неактивен"}
                                            </Badge>
                                        </CardTitle>
                                        <CardDescription>
                                            Сезон {season.seasonNumber} • {season.episodes.length} эпизодов
                                        </CardDescription>
                                        <div className="mt-2 flex items-center gap-2">
                                            <Link className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-xs text-muted-foreground font-mono">
                                                /{seasonSlug(season.seasonNumber)}
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-6 w-6 p-0"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(`/${seasonSlug(season.seasonNumber)}`)
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
                                        onClick={() => handleToggleActive(season)}
                                    >
                                        {season.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleEdit(season)}
                                    >
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDelete(season.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        {season.description && (
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    {season.description}
                                </p>
                            </CardContent>
                        )}
                    </Card>
                ))}
            </div>

            {isFormOpen && (
                <SeasonForm
                    season={editingSeason}
                    onClose={handleFormClose}
                />
            )}
        </div>
    )
}

export default SeasonsManagement
