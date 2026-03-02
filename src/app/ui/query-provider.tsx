import { MutationCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { gooeyToast } from "goey-toast";
import { useState, type PropsWithChildren } from "react";

import { ApiError, AppError, ResponseParseError, ValidationError } from "@/shared";

export function QueryProvider({ children }: PropsWithChildren) {
  const [client] = useState(
    () =>
      new QueryClient({
        mutationCache: new MutationCache({
          onError: (error, _variables, _context, mutation) => {
            if (mutation.meta?.hideErrorToast) return;

            const message = AppError.isApi(error) ? error.message : "오류가 발생했습니다. 다시 시도해 주세요.";

            gooeyToast.error(message);
          },
        }),
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
            throwOnError: false,
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
