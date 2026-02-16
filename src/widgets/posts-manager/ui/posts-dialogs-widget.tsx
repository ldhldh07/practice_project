import { CommentAddDialogContainer, CommentEditDialogContainer } from "@/features/comment-edit";
import { PostAddDialogContainer, PostEditDialogContainer } from "@/features/post-edit";
import { UserDetailDialogContainer } from "@/features/user-load";

import { PostDetailDialogContainer } from "./post-detail-dialog-container";

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
