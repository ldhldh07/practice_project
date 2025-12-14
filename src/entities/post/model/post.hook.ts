import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai";
import { useForm, type UseFormReturn } from "react-hook-form";
import { z } from "zod";

import { isPostDetailDialogOpenAtom, selectedPostAtom } from "./post.atom";
import { useCreatePostMutation, useUpdatePostMutation, useDeletePostMutation } from "./post.query";

import type { Post } from "./post.types";
import type { CreatePostParams, UpdatePostPayload } from "../api/posts.api";

export const useSelectedPost = () => {
  return useAtom(selectedPostAtom);
};

export const usePostDetailDialog = () => {
  return useAtom(isPostDetailDialogOpenAtom);
};

export function usePostManager() {
  const createMutation = useCreatePostMutation();
  const updateMutation = useUpdatePostMutation();
  const deleteMutation = useDeletePostMutation();

  return {
    create: async (payload: CreatePostParams) => {
      await createMutation.mutateAsync(payload);
    },

    update: async (payload: UpdatePostPayload) => {
      await updateMutation.mutateAsync(payload);
    },

    delete: async (id: number) => {
      await deleteMutation.mutateAsync(id);
    },
  };
}

export interface CreatePostFormData {
  title: string;
  body: string;
  userId: number;
}

export const useCreatePostForm = (defaultValues?: Partial<CreatePostFormData>): UseFormReturn<CreatePostFormData> => {
  return useForm<CreatePostFormData>({
    resolver: zodResolver(
      z.object({
        title: z.string().min(1, "제목을 입력해주세요").max(100, "제목은 100자 이하여야 합니다").trim(),
        body: z.string().min(1, "내용을 입력해주세요").max(10000, "내용은 10000자 이하여야 합니다").trim(),
        userId: z.number(),
      }),
    ),
    defaultValues: {
      title: "",
      body: "",
      userId: 1,
      ...defaultValues,
    },
    mode: "onChange",
  });
};

export interface UpdatePostFormData {
  title: string;
  body: string;
}

export const useUpdatePostForm = (post?: Post | null): UseFormReturn<UpdatePostFormData> => {
  return useForm<UpdatePostFormData>({
    resolver: zodResolver(
      z.object({
        title: z.string().min(1, "제목을 입력해주세요").max(100, "제목은 100자 이하여야 합니다").trim(),
        body: z.string().min(1, "내용을 입력해주세요").max(10000, "내용은 10000자 이하여야 합니다").trim(),
      }),
    ),
    defaultValues: {
      title: post?.title ?? "",
      body: post?.body ?? "",
    },
    mode: "onChange",
  });
};
