import "@tanstack/react-query";

interface QueryMeta extends Record<string, unknown> {
  hideErrorToast?: boolean;
}

declare module "@tanstack/react-query" {
  interface Register {
    mutationMeta: QueryMeta;
  }
}
