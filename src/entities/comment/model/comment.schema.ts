import { z } from "zod";

export const commentUserSchema = z.object({
  id: z.number(),
  username: z.string(),
  fullName: z.string(),
});

export const commentSchema = z.object({
  id: z.number(),
  body: z.string(),
  postId: z.number(),
  likes: z.number().optional().default(0),
  user: commentUserSchema,
});

export const commentsResponseSchema = z.object({
  comments: z.array(commentSchema),
  total: z.number().optional(),
  skip: z.number().optional(),
  limit: z.number().optional(),
});

export type CommentSchema = z.infer<typeof commentSchema>;
export type CommentsResponseSchema = z.infer<typeof commentsResponseSchema>;
export type CommentUserSchema = z.infer<typeof commentUserSchema>;
