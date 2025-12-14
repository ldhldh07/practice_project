import { CommentAddDialogContainer, CommentEditDialogContainer } from "@/features/comment-edit";
import { PostDetailDialogContainer } from "@/features/post-detail";
import { PostAddDialogContainer, PostEditDialogContainer } from "@/features/post-edit";
import { UserDetailDialogContainer } from "@/features/user-load";

export function PostsDialogsWidget() {
  return (
    <>
      <PostAddDialogContainer />
      <PostEditDialogContainer />
      <CommentAddDialogContainer />
      <CommentEditDialogContainer />
      <PostDetailDialogContainer />
      <UserDetailDialogContainer />
    </>
  );
}
