import { z } from "zod"
import { publicProcedure, router } from "../trpc"

export const likesRouter = router({
  getLikes: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const likes = await ctx.db.like.findMany({
        where: { 
          OR: [
            { videoId: input.id },
            { episodeId: input.id }
          ]
        }
      })
      
      const likesCount = likes.filter(like => like.type === 'like').length
      const dislikesCount = likes.filter(like => like.type === 'dislike').length
      
      return {
        likes: likesCount,
        dislikes: dislikesCount,
        allLikes: likes
      }
    }),
  likeVideo: publicProcedure
    .input(z.object({ videoId: z.string(), userId: z.string(), type: z.enum(['like', 'dislike']) }))
    .mutation(async ({ input, ctx }) => {

      const existingLike = await ctx.db.like.findFirst({
        where: {
          AND: [
            { videoId: input.videoId },
            { userId: input.userId },
            { type: input.type }
          ]
        }
      });

      if (existingLike) {
        return await ctx.db.like.delete({
          where: { id: existingLike.id }
        });
      }

      // Удаляем противоположный тип лайка, если он есть
      const oppositeLike = await ctx.db.like.findFirst({
        where: {
          AND: [
            { videoId: input.videoId },
            { userId: input.userId },
            { type: input.type === 'like' ? 'dislike' : 'like' }
          ]
        }
      });

      if (oppositeLike) {
        await ctx.db.like.delete({
          where: { id: oppositeLike.id }
        });
      }

      return await ctx.db.like.create({
        data: {
          videoId: input.videoId,
          userId: input.userId,
          type: input.type
        }
      });
    }),
  likeEpisode: publicProcedure
    .input(z.object({ episodeId: z.string(), userId: z.string(), type: z.enum(['like', 'dislike']) }))
    .mutation(async ({ input, ctx }) => {

      const existingLike = await ctx.db.like.findFirst({
        where: {
          AND: [
            { episodeId: input.episodeId },
            { userId: input.userId },
            { type: input.type }
          ]
        }
      });

      if (existingLike) {
        return await ctx.db.like.delete({
          where: { id: existingLike.id }
        });
      }

      // Удаляем противоположный тип лайка, если он есть
      const oppositeLike = await ctx.db.like.findFirst({
        where: {
          AND: [
            { episodeId: input.episodeId },
            { userId: input.userId },
            { type: input.type === 'like' ? 'dislike' : 'like' }
          ]
        }
      });

      if (oppositeLike) {
        await ctx.db.like.delete({
          where: { id: oppositeLike.id }
        });
      }

      return await ctx.db.like.create({
        data: {
          episodeId: input.episodeId,
          userId: input.userId,
          type: input.type
        }
      });
    }),
  getUserLikes: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input, ctx }) => {
      return await ctx.db.like.findMany({
        where: { userId: input.userId },
        include: {
          video: {
            select: { id: true, title: true, image: true }
          },
          episode: {
            select: { 
              id: true, 
              title: true, 
              image: true,
              season: {
                select: { title: true, seasonNumber: true }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
    })

})