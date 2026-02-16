import type { PostSchema, TagSchema } from "./post.schema";

import type { User } from "@/entities/user";

export type Post = PostSchema & {
  author?: User;
};

export type Tag = TagSchema;
