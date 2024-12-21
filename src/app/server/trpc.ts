import { prisma } from "@/config/prisma";
import { PrismaClient } from "@prisma/client";
import { initTRPC } from "@trpc/server";

type Context = {
  db: PrismaClient;
};

const createTRPCContext = () => {
  return {
    db: prisma,
  };
};

const t = initTRPC.context<Context>().create();

export const publicProcedure = t.procedure;
export const { createCallerFactory, router } = t;

export { createTRPCContext }
