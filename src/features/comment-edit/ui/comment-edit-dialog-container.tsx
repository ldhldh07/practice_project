import { CommentEditDialog, useSelectedComment, useUpdateCommentForm } from "@/entities/comment";
import { createModalFormHandler } from "@/shared";

import { useEditCommentDialog, useCommentActions } from "../model/edit-comment.hook";

export function CommentEditDialogContainer() {
  const [isEditOpen, setIsEditOpen] = useEditCommentDialog();
  const [selectedComment] = useSelectedComment();

  const commentActions = useCommentActions(selectedComment?.postId ?? 0);
  const form = useUpdateCommentForm(selectedComment);

  const handleSubmit = createModalFormHandler(
    form,
    () => setIsEditOpen(false),
    false,
  )(async (data) => {
    if (!selectedComment) {
      console.warn("수정할 댓글이 선택되지 않았습니다.");
      return;
    }
    await commentActions.update(selectedComment.id, data.body);
  });

  return <CommentEditDialog open={isEditOpen} onOpenChange={setIsEditOpen} form={form} onSubmit={handleSubmit} />;
}
