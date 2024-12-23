import { z } from "zod"
import { publicProcedure, router } from "../trpc"

export const likesRouter = router({
  getLikes: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      return await ctx.db.like.findMany({
        where: { videoId: input.id }
      })
    }),
  likeVideo: publicProcedure
    .input(z.object({ videoId: z.string(), userId: z.string() }))
    .mutation(async ({ input, ctx }) => {

      const existingLike = await ctx.db.like.findFirst({
        where: {
          AND: [
            { videoId: input.videoId },
            { userId: input.userId }
          ]
        }
      });

      if (existingLike) {
        return await ctx.db.like.delete({
          where: { id: existingLike.id }
        });
      }

      return await ctx.db.like.create({
        data: {
          videoId: input.videoId,
          userId: input.userId
        }
      });
    }),

})