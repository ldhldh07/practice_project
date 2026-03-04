import type { ApiError } from "@/shared/lib/errors";
import "@tanstack/react-query";
interface QueryMeta extends Record<string, unknown> {
  hideErrorToast?: boolean;
}

declare module "@tanstack/react-query" {
  interface Register {
    defaultError: ApiError;
    mutationMeta: QueryMeta;
  }
}
