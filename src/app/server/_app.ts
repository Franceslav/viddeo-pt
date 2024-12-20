import { createCallerFactory, router } from './trpc';
import { userRouter } from './routers/user';

export const appRouter = router({
  user: userRouter
});

export const caller = createCallerFactory(appRouter);

export type AppRouter = typeof appRouter;
