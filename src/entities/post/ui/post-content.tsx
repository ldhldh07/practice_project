import { HighlightText } from "@shared/ui/highlight-text";

import { splitByHighlight } from "@/shared/lib/split-by-highlight";

import type { Post } from "../model/post.types";

interface PostContentProps {
  post: Post | null;
  searchQuery: string;
}

export function PostContent({ post, searchQuery }: Readonly<PostContentProps>) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">
        <HighlightText segments={splitByHighlight(post?.title ?? "", searchQuery) ?? []} />
      </h2>
      <p>
        <HighlightText segments={splitByHighlight(post?.body ?? "", searchQuery) ?? []} />
      </p>
    </div>
  );
}
