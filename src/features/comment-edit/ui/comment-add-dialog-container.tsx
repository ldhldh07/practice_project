import { CommentAddDialog, useCreateCommentForm } from "@/entities/comment";
import { createModalFormHandler } from "@/shared";

import { useNewComment, useAddCommentDialog, useCommentActions } from "../model/edit-comment.hook";

export function CommentAddDialogContainer() {
  const [newComment] = useNewComment();
  const [isAddOpen, setIsAddOpen] = useAddCommentDialog();

  const postId = newComment.postId || 0;
  const commentActions = useCommentActions(postId);
  const form = useCreateCommentForm(postId);

  const handleSubmit = createModalFormHandler(form, () => setIsAddOpen(false))(async (data) => {
    const requestData = {
      body: data.body,
      postId: postId,
      userId: data.userId,
    };

    await commentActions.create(requestData);
  });

  return <CommentAddDialog open={isAddOpen} onOpenChange={setIsAddOpen} form={form} onSubmit={handleSubmit} />;
}
