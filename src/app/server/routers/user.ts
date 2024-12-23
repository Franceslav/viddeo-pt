import { z } from "zod";
import bcryptjs from "bcryptjs";
import { TRPCError } from "@trpc/server";

import { publicProcedure, router } from "../trpc";

export const userRouter = router({
  getUserByEmail: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ input, ctx }) => {
      const user = await ctx.db.user.findUnique({
        where: { email: input.email }
      })

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found'
        })
      }

      return user
    }),
  validateUserPassWord: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string() }))
    .query(async ({ input, ctx }) => {
      const user = await ctx.db.user.findUnique({
        where: { email: input.email }
      })

      if (!user?.password) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found'
        })
      }

      const isPasswordValid = await bcryptjs.compare(input.password, user.password)

      if (!isPasswordValid) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid password'
        })
      }

      return { isValid: true }
    }),
  createUser: publicProcedure
    .input(z.object({ name: z.string(), email: z.string().email(), password: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const hashedPassword = await bcryptjs.hash(input.password, 10)

      const userExists = await ctx.db.user.findUnique({
        where: { email: input.email }
      })

      if (userExists) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'User already exists'
        })
      }

      await ctx.db.user.create({
        data: {
          name: input.name,
          email: input.email,
          password: hashedPassword
        }
      })
    }),
    getUserById: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input, ctx }) => {
        const user = await ctx.db.user.findUnique({
          where: { id: input.id }
        })

        if (!user) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User not found'
          })
        }

        return user
      })
})