import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

import { prefetchCommentsByPost } from "@/entities/comment";
import { PostsTable, useSelectedPost, usePostDetailDialog, usePostSearchParams } from "@/entities/post";
import type { Post, SortOrder } from "@/entities/post";
import { useEditPostDialog, usePostActions } from "@/features/post-edit";
import { usePostsQuery } from "@/features/post-load";
import { useUserActions } from "@/features/user-load";
import { splitByHighlight } from "@/shared/lib/split-by-highlight";

export function PostsTableContainer() {
  const [, setSelectedPost] = useSelectedPost();
  const [, setIsDetailOpen] = usePostDetailDialog();
  const { params, setParams } = usePostSearchParams();
  const selectedTag = params.tag ?? "";
  const searchQuery = params.search ?? "";
  const { data } = usePostsQuery({
    limit: params.limit,
    skip: params.skip,
    tag: params.tag,
    search: params.search,
    sortBy: params.sortBy,
    sortOrder: (params.sortOrder as SortOrder) ?? "asc",
  });
  const posts: Post[] = data?.posts ?? [];
  const userActions = useUserActions();
  const [, setIsEditOpen] = useEditPostDialog();
  const { delete: deletePost } = usePostActions();
  const queryClient = useQueryClient();

  const handleClickTag = useCallback(
    (tag: string) => {
      if (tag === selectedTag) return;
      setParams({ tag, skip: 0 });
    },
    [selectedTag, setParams],
  );

  const handleOpenUser = useCallback(
    (user: Post["author"]) => {
      if (!user) return;
      void userActions.openById(user.id);
    },
    [userActions],
  );

  const handleOpenDetail = useCallback(
    async (post: Post) => {
      setSelectedPost(post);
      await prefetchCommentsByPost(queryClient, post.id);
      setIsDetailOpen(true);
    },
    [queryClient, setIsDetailOpen, setSelectedPost],
  );

  const handleEditPost = useCallback(
    (post: Post) => {
      setSelectedPost(post);
      setIsEditOpen(true);
    },
    [setIsEditOpen, setSelectedPost],
  );

  return (
    <PostsTable
      posts={posts}
      selectedTag={selectedTag}
      makeTitleSegments={(title) => splitByHighlight(title, searchQuery)}
      onClickTag={handleClickTag}
      onOpenUser={handleOpenUser}
      onOpenDetail={handleOpenDetail}
      onEdit={handleEditPost}
      onDelete={deletePost}
    />
  );
}
