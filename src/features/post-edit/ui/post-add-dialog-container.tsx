import { PostAddDialog, useCreatePostForm } from "@/entities/post";
import { createModalFormHandler } from "@/shared";

import { useAddPostDialog, usePostActions } from "../model/edit-post.hook";

export function PostAddDialogContainer() {
  const [isAddOpen, setIsAddOpen] = useAddPostDialog();
  const postActions = usePostActions();
  const form = useCreatePostForm();

  const handleSubmit = createModalFormHandler(form, () => setIsAddOpen(false))(async (data) => {
    await postActions.create(data);
  });

  return <PostAddDialog open={isAddOpen} onOpenChange={setIsAddOpen} form={form} onSubmit={handleSubmit} />;
}
