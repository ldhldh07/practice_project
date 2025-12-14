import { z } from "zod";

import { createApiValidator } from "@/shared/lib/api-validator";

export const postSchema = z.object({
  id: z.number(),
  title: z.string(),
  body: z.string(),
  userId: z.number(),
  tags: z.array(z.string()).optional(),
  reactions: z
    .object({
      likes: z.number(),
      dislikes: z.number(),
    })
    .optional(),
});

export const postsResponseSchema = z.object({
  posts: z.array(postSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
});

export const tagSchema = z.object({
  slug: z.string(),
  name: z.string(),
  url: z.string(),
});

export const postValidator = createApiValidator(postSchema);
export const postsResponseValidator = createApiValidator(postsResponseSchema);
export const tagValidator = createApiValidator(tagSchema);
export const tagsArrayValidator = createApiValidator(z.array(tagSchema));

export type PostSchema = z.infer<typeof postSchema>;
export type PostsResponseSchema = z.infer<typeof postsResponseSchema>;
export type TagSchema = z.infer<typeof tagSchema>;
