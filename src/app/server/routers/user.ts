import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import bcryptjs from "bcryptjs";

export const userRouter = router({
  getUserByEmail: publicProcedure
    .input(z.object({ email: z.string() }))
    .query(async ({ input, ctx }) => {
      const user = await ctx.db.user.findUnique({
        where: { email: input.email }
      })
      
      return user
    }),
  validateUserPassWord: publicProcedure
    .input(z.object({ email: z.string(), password: z.string() }))
    .query(async ({ input, ctx }) => {
      const user = await ctx.db.user.findUnique({
        where: { email: input.email }
      })

      if (!user?.password) {
        throw new Error("User not found")
      }

      const isPasswordValid = await bcryptjs.compare(input.password, user.password)

      if(!isPasswordValid) {
        throw new Error("Invalid password")
      }
    })
})