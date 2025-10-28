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
      // Проверяем, что пользователь существует или создаем его
      let user = await ctx.db.user.findUnique({
        where: { id: input.userId }
      })

      if (!user) {
        try {
          user = await ctx.db.user.create({
            data: {
              id: input.userId,
              name: 'Пользователь',
              email: `user-${input.userId}@temp.com`,
              image: null
            }
          })
        } catch {
          throw new Error('User not found and could not be created')
        }
      }

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
        await ctx.db.like.delete({
          where: { id: existingLike.id }
        });
      } else {
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

        await ctx.db.like.create({
          data: {
            episodeId: input.episodeId,
            userId: input.userId,
            type: input.type
          }
        });
      }

      // Получаем обновленную статистику лайков
      const allLikes = await ctx.db.like.findMany({
        where: { episodeId: input.episodeId }
      })

      const userLike = await ctx.db.like.findFirst({
        where: {
          episodeId: input.episodeId,
          userId: input.userId
        }
      })

      return {
        type: userLike?.type || null,
        likesCount: allLikes.filter(like => like.type === 'like').length,
        dislikesCount: allLikes.filter(like => like.type === 'dislike').length
      }
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