import { z } from "zod"
import { signIn } from "@/auth"
import { AuthError } from "next-auth"

import { publicProcedure, router } from "../trpc"
import { caller } from "./_app"

export const authRouter = router({
  loginWidthCredentials: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string() }))
    .query(async ({ input }) => {
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
        const userExists = await caller({ db: ctx.db }).user.getUserByEmail({ email: input.email })

        if (userExists) {
          throw new Error("User already exists")
        }

        await caller({ db: ctx.db }).user.createUser({ name: input.name, email: input.email, password: input.password })

        const result = await signIn("credentials", { email: input.email, password: input.password, redirect: false })

        if (result.error) {
          return { success: false, error: result.error }
        }

        return { success: true }
      } catch (error) {
        console.error(error);
        return { success: false, error: "An unexpected error occurred" };
      }
    })
})