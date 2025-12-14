import { type UseFormReturn } from "react-hook-form";

import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Textarea } from "@/shared";

import type { UpdateCommentFormData } from "../model/comment.hook";

interface CommentEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<UpdateCommentFormData>;
  onSubmit: () => void;
}

export function CommentEditDialog({ open, onOpenChange, form, onSubmit }: CommentEditDialogProps) {
  const {
    register,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>댓글 수정</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Textarea placeholder="댓글 내용" {...register("body")} error={errors.body?.message} />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "수정 중..." : "댓글 업데이트"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
