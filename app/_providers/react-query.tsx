"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryProvider = new QueryClient();

  return (
    <QueryClientProvider client={queryProvider}>{children}</QueryClientProvider>
  );
}
