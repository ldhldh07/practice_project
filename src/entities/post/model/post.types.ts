import type { User } from "@/entities/user";

import type { PostSchema, TagSchema } from "./post.schema";

export type Post = PostSchema & {
  author?: User;
};

export type Tag = TagSchema;
