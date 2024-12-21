import { PrismaClient } from "@prisma/client";
import { cache } from "react";

import { initTRPC } from "@trpc/server";
import { prisma } from "@/config/prisma";
import superjson from "superjson";

type Context = {
  db: PrismaClient;
};

export const createTRPCContext = cache(async () => {
  return {
    db: prisma,
  };
});

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const publicProcedure = t.procedure;
export const { router, createCallerFactory } = t;