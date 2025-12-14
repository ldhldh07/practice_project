import { type UseFormReturn } from "react-hook-form";

import { FormDialog, Input, Textarea } from "@/shared";

import type { CreatePostFormData } from "../model/post.hook";

interface PostAddDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<CreatePostFormData>;
  onSubmit: () => void;
}

export function PostAddDialog({ open, onOpenChange, form, onSubmit }: PostAddDialogProps) {
  const {
    register,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="새 게시물 추가"
      onSubmit={onSubmit}
      submitLabel={isSubmitting ? "추가 중..." : "게시물 추가"}
      disabled={isSubmitting}
    >
      <Input placeholder="제목" {...register("title")} error={errors.title?.message} />
      <Textarea rows={30} placeholder="내용" {...register("body")} error={errors.body?.message} />
      <Input
        type="number"
        placeholder="사용자 ID"
        {...register("userId", { valueAsNumber: true })}
        error={errors.userId?.message}
      />
    </FormDialog>
  );
}
