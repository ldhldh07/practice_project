import type { ApiError } from "@/shared/lib/errors";
import "@tanstack/react-query";

declare module "@tanstack/react-query" {
  interface Register {
    defaultError: ApiError;
  }
}
