export { commentApi } from "./api/comments.api";
export type {
  GetCommentsByPostIdResponse,
  CreateCommentPayload,
  UpdateCommentPayload,
  LikeCommentPayload,
} from "./api/comments.api";

export {
  useCommentsQuery,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useLikeCommentMutation,
} from "./model/comment.query";

export {
  useSelectedComment,
  useCommentManager,
  useCreateCommentForm,
  useUpdateCommentForm,
  type CreateCommentFormData,
  type UpdateCommentFormData,
} from "./model/comment.hook";

export type { CommentUser, Comment, CommentsByPostId } from "./model/comment.types";
export { CommentList } from "./ui/comment-list";
export { CommentAddDialog, CommentEditDialog } from "./ui";
