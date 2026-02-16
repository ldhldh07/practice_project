import type { Comment } from "@/entities/comment/model/comment.types";
import { http } from "@/shared/api/client";
import { validateSchema } from "@/shared/lib/validate";

import { commentSchema, commentsResponseSchema } from "../model/comment.schema";

export const commentApi = {
  async get(postId: number): Promise<GetCommentsByPostIdResponse> {
    const data = await http.get(`/comments/post/${postId}`);
    return validateSchema(commentsResponseSchema, data, "댓글 목록 응답 검증 실패");
  },
  async create({ body, postId, userId }: CreateCommentPayload): Promise<Comment> {
    const data = await http.post("/comments/add", { body, postId, userId });
    return validateSchema(commentSchema, data, "댓글 생성 응답 검증 실패");
  },
  async update(payload: UpdateCommentPayload): Promise<Comment> {
    const { id, body } = payload;
    const data = await http.put(`/comments/${id}`, { body });
    return validateSchema(commentSchema, data, "댓글 수정 응답 검증 실패");
  },
  remove(id: number): Promise<void> {
    return http.delete(`/comments/${id}`);
  },
  async like({ id, likes }: LikeCommentPayload): Promise<Comment> {
    const data = await http.patch(`/comments/${id}`, { likes });
    return validateSchema(commentSchema, data, "댓글 좋아요 응답 검증 실패");
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
