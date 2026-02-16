import { PostContent, useSelectedPost, usePostDetailDialog, usePostSearchParams } from "@/entities/post";
import { CommentsListContainer } from "@/features/comment-edit";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog";

export function PostDetailDialogContainer() {
  const [selectedPost] = useSelectedPost();
  const [isDetailOpen, setIsDetailOpen] = usePostDetailDialog();
  const { params } = usePostSearchParams();
  const searchQuery = params.search ?? "";

  return (
    <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>게시물 상세</DialogTitle>
        </DialogHeader>

        <PostContent post={selectedPost} searchQuery={searchQuery} />

        {selectedPost?.id != null && <CommentsListContainer postId={selectedPost.id} searchQuery={searchQuery} />}
      </DialogContent>
    </Dialog>
  );
}
