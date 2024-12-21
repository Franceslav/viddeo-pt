import { z } from "zod";
import { publicProcedure, router, } from "../trpc";

export const videoRouter = router({
  uploadVideo: publicProcedure
    .input(z.object({ title: z.string(), description: z.string(), url: z.string(), userId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const video = await ctx.db.video.create({ data: input })
      return video
    }),
  getVideos: publicProcedure
    .query(async ({ ctx }) => {
      const videos = await ctx.db.video.findMany()
      return videos
    }),
  getVideo: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const video = await ctx.db.video.findUnique({ where: { id: input.id } })
      return video
    })
})