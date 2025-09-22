import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "../trpc";

export const episodeRouter = router({
    // Получить все эпизоды
    getEpisodes: publicProcedure
        .query(async ({ ctx }) => {
            const episodes = await ctx.db.episode.findMany({
                orderBy: [
                    { season: { seasonNumber: 'asc' } },
                    { episodeNumber: 'asc' }
                ],
                include: {
                    season: true,
                    user: {
                        select: { name: true, email: true }
                    },
                    likes: true
                }
            });
            return episodes;
        }),

    // Получить эпизоды по сезону
    getEpisodesBySeason: publicProcedure
        .input(z.object({ seasonId: z.string() }))
        .query(async ({ input, ctx }) => {
            const episodes = await ctx.db.episode.findMany({
                where: { seasonId: input.seasonId },
                orderBy: { episodeNumber: 'asc' },
                include: {
                    season: true,
                    user: {
                        select: { name: true, email: true }
                    },
                    likes: true
                }
            });
            return episodes;
        }),

    // Получить эпизод по ID
    getEpisode: publicProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ input, ctx }) => {
            const episode = await ctx.db.episode.findUnique({
                where: { id: input.id },
                include: {
                    season: true,
                    user: {
                        select: { name: true, email: true }
                    },
                    likes: true
                }
            });

            if (!episode) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Episode not found'
                });
            }

            return episode;
        }),

    // Создать новый эпизод
    createEpisode: publicProcedure
        .input(z.object({
            title: z.string().min(1, "Title is required"),
            description: z.string().min(1, "Description is required"),
            url: z.string().url("Invalid URL"),
            episodeNumber: z.number().int().positive("Episode number must be positive"),
            seasonId: z.string().min(1, "Season ID is required"),
            userId: z.string().min(1, "User ID is required"),
            image: z.string().optional(),
        }))
        .mutation(async ({ input, ctx }) => {
            // Проверяем, существует ли сезон
            const season = await ctx.db.season.findUnique({
                where: { id: input.seasonId }
            });

            if (!season) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Season not found'
                });
            }

            // Проверяем, не существует ли уже эпизод с таким номером в сезоне
            const existingEpisode = await ctx.db.episode.findFirst({
                where: {
                    seasonId: input.seasonId,
                    episodeNumber: input.episodeNumber
                }
            });

            if (existingEpisode) {
                throw new TRPCError({
                    code: 'CONFLICT',
                    message: 'Episode with this number already exists in this season'
                });
            }

            const episode = await ctx.db.episode.create({
                data: input
            });

            return episode;
        }),

    // Обновить эпизод
    updateEpisode: publicProcedure
        .input(z.object({
            id: z.string(),
            title: z.string().min(1, "Title is required").optional(),
            description: z.string().min(1, "Description is required").optional(),
            url: z.string().url("Invalid URL").optional(),
            episodeNumber: z.number().int().positive("Episode number must be positive").optional(),
            seasonId: z.string().optional(),
            image: z.string().optional(),
        }))
        .mutation(async ({ input, ctx }) => {
            const { id, ...updateData } = input;

            // Если обновляется seasonId, проверяем что сезон существует
            if (updateData.seasonId) {
                const season = await ctx.db.season.findUnique({
                    where: { id: updateData.seasonId }
                });

                if (!season) {
                    throw new TRPCError({
                        code: 'NOT_FOUND',
                        message: 'Season not found'
                    });
                }
            }

            // Если обновляется номер эпизода, проверяем уникальность
            if (updateData.episodeNumber) {
                const seasonId = updateData.seasonId || (await ctx.db.episode.findUnique({ where: { id } }))?.seasonId;
                
                if (seasonId) {
                    const existingEpisode = await ctx.db.episode.findFirst({
                        where: {
                            episodeNumber: updateData.episodeNumber,
                            seasonId: seasonId,
                            id: { not: id }
                        }
                    });

                    if (existingEpisode) {
                        throw new TRPCError({
                            code: 'CONFLICT',
                            message: 'Episode with this number already exists in this season'
                        });
                    }
                }
            }

            const episode = await ctx.db.episode.update({
                where: { id },
                data: updateData
            });

            return episode;
        }),

    // Удалить эпизод
    deleteEpisode: publicProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ input, ctx }) => {
            await ctx.db.episode.delete({
                where: { id: input.id }
            });

            return { success: true };
        }),

    // Увеличить количество просмотров
    increaseViews: publicProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ input, ctx }) => {
            const episode = await ctx.db.episode.update({
                where: { id: input.id },
                data: { views: { increment: 1 } }
            });

            return episode;
        }),
});
