import { PrismaClient } from "@prisma/client";
import { initTRPC } from "@trpc/server";

type Context = {
  db: PrismaClient;
};

const t = initTRPC.context<Context>().create();

export const publicProcedure = t.procedure;
export const { createCallerFactory, router } = t;
