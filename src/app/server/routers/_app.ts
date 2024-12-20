import { createCallerFactory, router } from "../trpc";
import { authRouter } from "./auth";
import { userRouter } from "./user";


export const appRouter = router({
  auth: authRouter,
  user: userRouter,
});

export const caller = createCallerFactory(appRouter);

export type AppRouter = typeof appRouter;
