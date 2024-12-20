import { z } from "zod"
import { signIn } from "@/auth"
import { AuthError } from "next-auth"

import { publicProcedure, router } from "../trpc"
import { caller } from "./_app"
import { TRPCError } from "@trpc/server"

export const authRouter = router({
  loginWidthCredentials: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string() }))
    .mutation(async ({ input }) => {
      try {
        await signIn("credentials", { email: input.email, password: input.password })
      } catch (error) {
        if (error instanceof AuthError) {
          switch (error.type) {
            case "CredentialsSignin":
              throw new Error("Invalid credentials")
            default:
              throw new Error("Unknown error")
          }
        }
      }
    }),
  registerWithCredentials: publicProcedure
    .input(z.object({ name: z.string(), email: z.string().email(), password: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        await caller({ db: ctx.db }).user.createUser({ name: input.name, email: input.email, password: input.password })

        const result = await signIn("credentials", { email: input.email, password: input.password, redirect: false })

        if (result.error) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Invalid credentials'
          })
        }

        return { success: true }
      } catch (error) {
        if(error instanceof TRPCError) {
          throw error
        }

        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred'
        })
      }
    })
})