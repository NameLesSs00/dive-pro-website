'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { hydrateAuth } from '@/features/auth/authSlice';
import { loadStoredAuth } from '@/features/auth/authStorage';
import { store } from '@/store/store';

function AuthHydrator({ children }: { children: ReactNode }) {
  useEffect(() => {
    store.dispatch(hydrateAuth(loadStoredAuth()));
  }, []);

  return children;
}

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60,
            retry: 1,
          },
        },
      })
  );

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthHydrator>{children}</AuthHydrator>
      </QueryClientProvider>
    </Provider>
  );
}
