import { PostEditDialog, useSelectedPost, useUpdatePostForm } from "@/entities/post";
import { createModalFormHandler } from "@/shared";

import { useEditPostDialog, usePostActions } from "../model/edit-post.hook";

export function PostEditDialogContainer() {
  const [isEditOpen, setIsEditOpen] = useEditPostDialog();
  const [selectedPost] = useSelectedPost();
  const postActions = usePostActions();
  const form = useUpdatePostForm(selectedPost);

  const handleSubmit = createModalFormHandler(
    form,
    () => setIsEditOpen(false),
    false,
  )(async (data) => {
    if (!selectedPost) {
      console.warn("수정할 게시물이 선택되지 않았습니다.");
      return;
    }
    await postActions.update({
      postId: String(selectedPost.id),
      params: data,
    });
  });

  return <PostEditDialog open={isEditOpen} onOpenChange={setIsEditOpen} form={form} onSubmit={handleSubmit} />;
}
