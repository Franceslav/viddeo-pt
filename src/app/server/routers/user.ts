import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const userRouter = router({
  getUserByEmail: publicProcedure
    .input(z.object({ email: z.string() }))
    .query(async ({ input, ctx }) => {
      const user = await ctx.db.user.findUnique({
        where: { email: input.email }
      })
      return user
    })
})