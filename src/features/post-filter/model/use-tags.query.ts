import { useQuery } from "@tanstack/react-query";

import { postApi, postsQueryKeys } from "@/entities/post";

export function useTagsQuery() {
  return useQuery({
    queryKey: postsQueryKeys.tags,
    queryFn: () => postApi.getTags(),
    staleTime: 5 * 60_000,
  });
}
