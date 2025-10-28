import NextAuth from "next-auth"

import Credentials from 'next-auth/providers/credentials'

import { prisma } from "@/config/prisma"


const providers = [
  Credentials({
    credentials: {
      name: { label: "Name", type: "text" },
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    authorize: async (credentials) => {
      if (!credentials?.email || !credentials?.password) {
        return null;
      }

      try {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        });

        if (!user?.password) {
          return null;
        }

        const bcrypt = await import('bcryptjs');
        const isPasswordValid = await bcrypt.compare(credentials.password as string, user.password);

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image
        };
      } catch (error) {
        console.error('Authentication error:', error);
        return null;
      }
    },
  })
]

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: 'jwt' },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string
        session.user.name = token.name as string
        session.user.email = token.email as string
        session.user.image = token.image as string
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.name = user.name
        token.email = user.email
        token.image = user.image
      }
      return token
    }
  },
  providers,
})