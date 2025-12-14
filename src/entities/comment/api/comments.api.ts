import type { Comment } from "@/entities/comment/model/comment.types";
import { http } from "@/shared/api/client";
import { withValidation } from "@/shared/lib/api-validator";

import { commentValidator, commentsResponseValidator } from "../model/comment.schema";

export const commentApi = {
  get(postId: number): Promise<GetCommentsByPostIdResponse> {
    return withValidation(() => http.get(`/comments/post/${postId}`), commentsResponseValidator);
  },
  create({ body, postId, userId }: CreateCommentPayload): Promise<Comment> {
    return withValidation(() => http.post("/comments/add", { body, postId, userId }), commentValidator);
  },
  update(payload: UpdateCommentPayload): Promise<Comment> {
    const { id, body } = payload;
    return withValidation(() => http.put(`/comments/${id}`, { body }), commentValidator);
  },
  remove(id: number): Promise<void> {
    return http.delete(`/comments/${id}`);
  },
  like({ id, likes }: LikeCommentPayload): Promise<Comment> {
    return withValidation(() => http.patch(`/comments/${id}`, { likes }), commentValidator);
  },
} as const;

export interface GetCommentsByPostIdResponse {
  comments: Comment[];
}
export interface CreateCommentPayload {
  body: string;
  postId: number;
  userId: number;
}

export interface UpdateCommentPayload {
  id: number;
  body: string;
}

export interface LikeCommentPayload {
  id: number;
  likes: number;
}
