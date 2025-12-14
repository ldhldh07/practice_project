import { http } from "@/shared/api/client";
import { withValidation } from "@/shared/lib/api-validator";

import { postValidator, postsResponseValidator, tagsArrayValidator } from "../model/post.schema";
import { Post } from "../model/post.types";

import type { Tag } from "../model/post.types";

export const postApi = {
  get({ limit, skip, sortBy, order }: PostsParams): Promise<PostsResponse> {
    return withValidation(() => http.get("/posts", { params: { limit, skip, sortBy, order } }), postsResponseValidator);
  },
  create(payload: CreatePostParams): Promise<Post> {
    return withValidation(() => http.post("/posts/add", payload), postValidator);
  },
  update({ postId, params }: UpdatePostPayload): Promise<Post> {
    return withValidation(() => http.put(`/posts/${postId}`, params), postValidator);
  },
  remove(id: number): Promise<void> {
    return http.delete(`/posts/${id}`);
  },
  async getByTag(
    tag: string,
    params?: Pick<PostsParams, "limit" | "skip" | "sortBy" | "order">,
  ): Promise<PostsResponse> {
    return withValidation(() => http.get(`/posts/tag/${tag}`, { params }), postsResponseValidator);
  },
  async search(
    query: string,
    params?: Pick<PostsParams, "limit" | "skip" | "sortBy" | "order">,
  ): Promise<PostsResponse> {
    return withValidation(() => http.get(`/posts/search`, { params: { q: query, ...params } }), postsResponseValidator);
  },
  async getTags(): Promise<Tag[]> {
    return withValidation(() => http.get(`/posts/tags`), tagsArrayValidator);
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
