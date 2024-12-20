import NextAuth from "next-auth"

import Credentials from 'next-auth/providers/credentials'

import { prisma } from "@/config/prisma"
import { PrismaAdapter } from "@auth/prisma-adapter"

import { caller } from "./app/server/routers/_app"


const providers = [
  Credentials({
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    authorize: async (credentials) => {
      try {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await caller({db: prisma}).user.getUserByEmail({ email: credentials.email as string });

        if (!user) {
          throw new Error('User not found');
        }

        await caller({db: prisma}).user.validateUserPassWord({ email: credentials.email as string, password: credentials.password as string })

        return user;
      } catch (error) {
        console.error('Authentication error:', error);
        return null;
      }
    },
  })
]

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  providers,
})