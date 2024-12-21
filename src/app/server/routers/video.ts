import { z } from "zod";
import { publicProcedure, router, } from "../trpc";
import { Video } from "@prisma/client";
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
      const videos = await ctx.db.video.findMany()
      if (!videos) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Videos not found" })
      }
      return videos
    }),
  getVideo: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }): Promise<Video> => {
      const video = await ctx.db.video.findUnique({ where: { id: input.id } })
      if (!video) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Video not found" })
      }
      return video
    })
})