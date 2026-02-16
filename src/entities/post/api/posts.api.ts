import { http } from "@/shared/api/client";
import { validateSchema } from "@/shared/lib/validate";

import { postSchema, postsResponseSchema, tagsArraySchema } from "../model/post.schema";
import { Post } from "../model/post.types";

import type { Tag } from "../model/post.types";

export const postApi = {
  async get({ limit, skip, sortBy, order }: PostsParams): Promise<PostsResponse> {
    const data = await http.get("/posts", { params: { limit, skip, sortBy, order } });
    return validateSchema(postsResponseSchema, data, "게시글 목록 응답 검증 실패");
  },
  async create(payload: CreatePostParams): Promise<Post> {
    const data = await http.post("/posts/add", payload);
    return validateSchema(postSchema, data, "게시글 생성 응답 검증 실패");
  },
  async update({ postId, params }: UpdatePostPayload): Promise<Post> {
    const data = await http.put(`/posts/${postId}`, params);
    return validateSchema(postSchema, data, "게시글 수정 응답 검증 실패");
  },
  remove(id: number): Promise<void> {
    return http.delete(`/posts/${id}`);
  },
  async getByTag(
    tag: string,
    params?: Pick<PostsParams, "limit" | "skip" | "sortBy" | "order">,
  ): Promise<PostsResponse> {
    const data = await http.get(`/posts/tag/${tag}`, { params });
    return validateSchema(postsResponseSchema, data, "태그별 게시글 응답 검증 실패");
  },
  async search(
    query: string,
    params?: Pick<PostsParams, "limit" | "skip" | "sortBy" | "order">,
  ): Promise<PostsResponse> {
    const data = await http.get(`/posts/search`, { params: { q: query, ...params } });
    return validateSchema(postsResponseSchema, data, "게시글 검색 응답 검증 실패");
  },
  async getTags(): Promise<Tag[]> {
    const data = await http.get(`/posts/tags`);
    return validateSchema(tagsArraySchema, data, "태그 목록 응답 검증 실패");
  },
} as const;

export type CreatePostParams = {
  title: string;
  body?: string;
  userId: number;
};

export type UpdatePostPayload = {
  postId: string;
  params: {
    title: string;
    body: string;
  };
};

export interface PostsParams {
  limit: number;
  skip: number;
  sortBy?: string;
  order?: "asc" | "desc";
}

export interface PostsResponse {
  posts: Post[];
  total: number;
}
