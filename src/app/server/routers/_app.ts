import { createCallerFactory, router } from "../trpc";
import { authRouter } from "./auth";
import { userRouter } from "./user";
import { videoRouter } from "./video";


export const appRouter = router({
  auth: authRouter,
  user: userRouter,
  video: videoRouter
});

export const caller = createCallerFactory(appRouter);

export type AppRouter = typeof appRouter;
