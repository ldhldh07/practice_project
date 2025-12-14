import { type UseFormReturn } from "react-hook-form";

import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea } from "@/shared";

import type { UpdatePostFormData } from "../model/post.hook";

interface PostEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<UpdatePostFormData>;
  onSubmit: () => void;
}

export function PostEditDialog({ open, onOpenChange, form, onSubmit }: PostEditDialogProps) {
  const {
    register,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>게시물 수정</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Input placeholder="제목" {...register("title")} error={errors.title?.message} />
          <Textarea rows={15} placeholder="내용" {...register("body")} error={errors.body?.message} />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "수정 중..." : "게시물 업데이트"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
