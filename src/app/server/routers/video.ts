import { z } from "zod";
import { publicProcedure, router, } from "../trpc";
import { TRPCError } from "@trpc/server";

export const videoRouter = router({
  uploadVideo: publicProcedure
    .input(z.object({ title: z.string(), description: z.string(), url: z.string(), userId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const video = await ctx.db.video.create({ data: input })
      if (!video) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to upload video" })
      }
      return video
    }),
  getVideos: publicProcedure
    .query(async ({ ctx }) => {
      // Получаем обычные видео
      const videos = await ctx.db.video.findMany({
        select: {
          id: true,
          title: true,
          description: true,
          url: true,
          image: true,
          userId: true,
          views: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: { name: true, email: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      })

      // Получаем эпизоды как видео
      const episodes = await ctx.db.episode.findMany({
        include: {
          user: {
            select: { name: true, email: true }
          },
          season: {
            select: { title: true, seasonNumber: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      })

      // Преобразуем эпизоды в формат видео
      const episodesAsVideos = episodes.map(episode => ({
        id: episode.id,
        title: `${episode.season.title} - Эпизод ${episode.episodeNumber}: ${episode.title}`,
        description: episode.description,
        url: episode.url,
        userId: episode.userId,
        views: episode.views,
        createdAt: episode.createdAt,
        updatedAt: episode.updatedAt,
        user: episode.user,
        type: 'episode' as const,
        seasonId: episode.seasonId,
        episodeNumber: episode.episodeNumber,
        image: episode.image
      }))

      // Объединяем видео и эпизоды, сортируем по дате создания
      const allContent = [
        ...videos.map(v => ({
          ...v,
          type: 'video' as const,
          image: v.image ?? null
        })),
        ...episodesAsVideos
      ].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

      return allContent
    }),
  getVideo: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      // Сначала проверяем в таблице video
      const video = await ctx.db.video.findUnique({ where: { id: input.id } })
      if (video) {
        return video
      }

      // Если не найдено в video, проверяем в episodes
      const episode = await ctx.db.episode.findUnique({ 
        where: { id: input.id },
        include: {
          season: true
        }
      })
      
      if (!episode) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Video not found" })
      }

      // Преобразуем эпизод в формат видео
      return {
        id: episode.id,
        title: `${episode.season.title} - Эпизод ${episode.episodeNumber}: ${episode.title}`,
        description: episode.description,
        url: episode.url,
        userId: episode.userId,
        views: episode.views,
        createdAt: episode.createdAt,
        updatedAt: episode.updatedAt,
        image: episode.image
      }
    }),
  increaseViews: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const video = await ctx.db.video.update({ where: { id: input.id }, data: { views: { increment: 1 } } })
      if (!video) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to increase views" })
      }
      return video
    })
})
