import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import bcryptjs from "bcryptjs";

export const userRouter = router({
  getUserByEmail: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ input, ctx }) => {
      const user = await ctx.db.user.findUnique({
        where: { email: input.email }
      })

      return user
    }),
  validateUserPassWord: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string() }))
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
    }),
  createUser: publicProcedure
    .input(z.object({ name: z.string(), email: z.string().email(), password: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const hashedPassword = bcryptjs.hashSync(input.password, 10)

      await ctx.db.user.create({
        data: {
          name: input.name,
          email: input.email,
          password: hashedPassword
        }
      })
    })
})