import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "../trpc";

export const seasonRouter = router({
    // Получить все сезоны
    getSeasons: publicProcedure
        .query(async ({ ctx }) => {
            const seasons = await ctx.db.season.findMany({
                orderBy: { seasonNumber: 'asc' },
                include: {
                    episodes: {
                        orderBy: { episodeNumber: 'asc' },
                        include: {
                            likes: true
                        }
                    }
                }
            });
            return seasons;
        }),

    // Получить сезон по ID
    getSeason: publicProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ input, ctx }) => {
            const season = await ctx.db.season.findUnique({
                where: { id: input.id },
                include: {
                    episodes: {
                        orderBy: { episodeNumber: 'asc' },
                        include: {
                            likes: true
                        }
                    }
                }
            });

            if (!season) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Season not found'
                });
            }

            return season;
        }),

    // Получить сезон по номеру
    getSeasonByNumber: publicProcedure
        .input(z.object({ seasonNumber: z.number() }))
        .query(async ({ input, ctx }) => {
            const season = await ctx.db.season.findFirst({
                where: { seasonNumber: input.seasonNumber },
                include: {
                    episodes: {
                        orderBy: { episodeNumber: 'asc' },
                        include: {
                            likes: true
                        }
                    }
                }
            });

            if (!season) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Season not found'
                });
            }

            return season;
        }),

    // Создать новый сезон
    createSeason: publicProcedure
        .input(z.object({
            title: z.string().min(1, "Title is required"),
            description: z.string().optional(),
            seasonNumber: z.number().int().positive("Season number must be positive"),
            image: z.string().optional(),
        }))
        .mutation(async ({ input, ctx }) => {
            // Проверяем, не существует ли уже сезон с таким номером
            const existingSeason = await ctx.db.season.findFirst({
                where: { seasonNumber: input.seasonNumber }
            });

            if (existingSeason) {
                throw new TRPCError({
                    code: 'CONFLICT',
                    message: 'Season with this number already exists'
                });
            }

            const season = await ctx.db.season.create({
                data: input
            });

            return season;
        }),

    // Обновить сезон
    updateSeason: publicProcedure
        .input(z.object({
            id: z.string(),
            title: z.string().min(1, "Title is required").optional(),
            description: z.string().optional(),
            seasonNumber: z.number().int().positive("Season number must be positive").optional(),
            isActive: z.boolean().optional(),
            image: z.string().optional(),
        }))
        .mutation(async ({ input, ctx }) => {
            const { id, ...updateData } = input;

            // Если обновляется номер сезона, проверяем уникальность
            if (updateData.seasonNumber) {
                const existingSeason = await ctx.db.season.findFirst({
                    where: {
                        seasonNumber: updateData.seasonNumber,
                        id: { not: id }
                    }
                });

                if (existingSeason) {
                    throw new TRPCError({
                        code: 'CONFLICT',
                        message: 'Season with this number already exists'
                    });
                }
            }

            const season = await ctx.db.season.update({
                where: { id },
                data: updateData
            });

            return season;
        }),

    // Удалить сезон
    deleteSeason: publicProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ input, ctx }) => {
            // Проверяем, есть ли эпизоды в сезоне
            const episodesCount = await ctx.db.episode.count({
                where: { seasonId: input.id }
            });

            if (episodesCount > 0) {
                throw new TRPCError({
                    code: 'CONFLICT',
                    message: 'Cannot delete season with episodes. Delete episodes first.'
                });
            }

            await ctx.db.season.delete({
                where: { id: input.id }
            });

            return { success: true };
        }),
});
