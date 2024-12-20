import { createTRPCReact } from '@trpc/react-query';
import { AppRouter } from '../server/_app';

export const trpc = createTRPCReact<AppRouter>();