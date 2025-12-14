export type { Post, Tag } from "./model/post.types";

export type { CreatePostParams, UpdatePostPayload } from "./api/posts.api";
export type { PostsParams, PostsResponse } from "./api/posts.api";

export { 
  useSelectedPost, 
  usePostDetailDialog, 
  usePostManager,
  useCreatePostForm, 
  useUpdatePostForm,
  type CreatePostFormData,
  type UpdatePostFormData 
} from "./model/post.hook";

export { postApi } from "./api/posts.api";

export { PostAddDialog } from "./ui/post-add-dialog";

export { PostEditDialog } from "./ui/post-edit-dialog";

export { PostContent } from "./ui/post-content";

export { PostsTable } from "./ui/posts-table";
