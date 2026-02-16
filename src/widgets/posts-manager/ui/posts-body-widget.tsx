import { usePostSearchParams } from "@/entities/post";
import type { SortOrder } from "@/entities/post";
import { PostFilterContainer } from "@/features/post-filter";
import { usePostsQuery } from "@/features/post-load";
import { CardContent } from "@/shared/ui/card";
import { Pagination } from "@/shared/ui/pagination";

import { PostsTableContainer } from "./posts-table-container";

export function PostsBodyWidget() {
  const { params, setParams } = usePostSearchParams();
  const { data, isFetching } = usePostsQuery({
    limit: params.limit,
    skip: params.skip,
    tag: params.tag,
    search: params.search,
    sortBy: params.sortBy,
    sortOrder: params.sortOrder as SortOrder,
  });

  return (
    <CardContent>
      <div className="flex flex-col gap-4">
        <PostFilterContainer />
        {isFetching ? <div className="flex justify-center p-4">로딩 중...</div> : <PostsTableContainer />}
        <Pagination
          total={data?.total ?? 0}
          skip={params.skip}
          limit={params.limit}
          onChangeLimit={(value) => setParams({ limit: Number(value), skip: 0 })}
          onPrev={() => setParams({ skip: Math.max(0, params.skip - params.limit) })}
          onNext={() => setParams({ skip: params.skip + params.limit })}
        />
      </div>
    </CardContent>
  );
}
