'use client'

import { trpc } from './client';
import { httpBatchLink } from '@trpc/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function getBaseUrl() {
  const base = (() => {
    if (typeof window !== 'undefined') return '';
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
    return `http://localhost:${process.env.PORT ?? 3000}`;
  })();
  return `${base}/api/trpc`;
}

const queryClient = new QueryClient();
const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: getBaseUrl(),
    }),
  ],
});

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}