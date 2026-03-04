import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, type PropsWithChildren } from "react";

import { ApiError, ResponseParseError, ValidationError, isExpectedError } from "@/shared";

export function QueryProvider({ children }: PropsWithChildren) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: (failureCount, error) => {
              if (error instanceof ValidationError) return false;
              if (error instanceof ResponseParseError) return false;
              if (error instanceof ApiError) {
                const noRetryStatuses = [400, 401, 403, 404];
                if (error.statusCode && noRetryStatuses.includes(error.statusCode)) return false;
              }

              return failureCount < 2;
            },
          },
          mutations: {
            throwOnError: (error) => !isExpectedError(error),
          },
        },
      }),
  );
  return (
    <QueryClientProvider client={client}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
    </QueryClientProvider>
  );
}
