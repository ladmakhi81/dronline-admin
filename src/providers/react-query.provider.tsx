"use client";

import { FC, PropsWithChildren, useRef } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const ReactQueryProvider: FC<PropsWithChildren> = ({ children }) => {
  const client = useRef(
    new QueryClient({ defaultOptions: { queries: { retryDelay: 1000 } } })
  );

  return (
    <QueryClientProvider client={client.current}>
      {children}
    </QueryClientProvider>
  );
};

export default ReactQueryProvider;
