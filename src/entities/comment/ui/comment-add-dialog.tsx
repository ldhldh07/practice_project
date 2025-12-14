import { type UseFormReturn } from "react-hook-form";

import { FormDialog, Textarea } from "@/shared";

import type { CreateCommentFormData } from "../model/comment.hook";

interface CommentAddDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<CreateCommentFormData>;
  onSubmit: () => void;
}

export function CommentAddDialog({ open, onOpenChange, form, onSubmit }: CommentAddDialogProps) {
  const {
    register,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="새 댓글 추가"
      onSubmit={onSubmit}
      submitLabel={isSubmitting ? "추가 중..." : "댓글 추가"}
      disabled={isSubmitting}
    >
      <Textarea placeholder="댓글 내용" {...register("body")} error={errors.body?.message} />
    </FormDialog>
  );
}
