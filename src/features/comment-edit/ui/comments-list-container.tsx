import { Plus } from "lucide-react";
import { useCallback } from "react";

import { CommentList, useCommentsQuery } from "@/entities/comment";
import type { Comment } from "@/entities/comment";
import { Button } from "@/shared/ui/button";

import { useCommentActions } from "../index";

interface CommentsListContainerProps {
  postId?: number;
  searchQuery: string;
}

export function CommentsListContainer({ postId, searchQuery }: Readonly<CommentsListContainerProps>) {
  const { data: comments = [] } = useCommentsQuery(postId);
  const commentAction = useCommentActions(postId ?? 0);

  const handleEditComment = useCallback(
    (comment: Comment) => {
      commentAction.prepareEdit(comment);
    },
    [commentAction],
  );

  if (!postId) return null;

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">댓글</h3>
        <Button size="sm" onClick={() => postId && commentAction.prepareNew()}>
          <Plus className="w-3 h-3 mr-1" />
          댓글 추가
        </Button>
      </div>
      <CommentList
        comments={comments}
        searchQuery={searchQuery}
        onLike={(id) => commentAction.like(id)}
        onEdit={handleEditComment}
        onDelete={(id) => commentAction.delete(id)}
      />
    </div>
  );
}
