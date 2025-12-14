import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useForm, type UseFormReturn } from "react-hook-form";
import { z } from "zod";

import { selectedCommentAtom } from "./comment.atom";
import { commentQueryKeys } from "./comment.keys";
import {
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useLikeCommentMutation,
} from "./comment.query";

import type { Comment } from "./comment.types";
import type { CreateCommentPayload } from "../api/comments.api";

export const useSelectedComment = () => {
  return useAtom(selectedCommentAtom);
};

export function useCommentManager(postId: number) {
  const queryClient = useQueryClient();
  const createMutation = useCreateCommentMutation();
  const updateMutation = useUpdateCommentMutation();
  const deleteMutation = useDeleteCommentMutation();
  const likeMutation = useLikeCommentMutation();

  return {
    create: async (payload: CreateCommentPayload) => {
      await createMutation.mutateAsync(payload);
    },

    update: async (id: number, body: string) => {
      await updateMutation.mutateAsync({ postId, id, body });
    },

    delete: async (id: number) => {
      await deleteMutation.mutateAsync({ id, postId });
    },

    like: async (id: number) => {
      const list = queryClient.getQueryData<Comment[]>(commentQueryKeys.byPost(postId)) ?? [];
      const currentLikes = list.find((c) => c.id === id)?.likes ?? 0;
      await likeMutation.mutateAsync({ id, postId, likes: currentLikes + 1 });
    },
  };
}

export interface CreateCommentFormData {
  body: string;
  postId: number;
  userId: number;
}

export const useCreateCommentForm = (
  postId: number,
  defaultValues?: Partial<CreateCommentFormData>,
): UseFormReturn<CreateCommentFormData> => {
  return useForm<CreateCommentFormData>({
    resolver: zodResolver(
      z.object({
        body: z.string().min(1, "댓글 내용을 입력해주세요").max(500, "댓글은 500자 이하여야 합니다").trim(),
        postId: z.number(),
        userId: z.number(),
      }),
    ),
    defaultValues: {
      body: "",
      postId,
      userId: 1,
      ...defaultValues,
    },
    mode: "onChange",
  });
};

export interface UpdateCommentFormData {
  body: string;
}

export const useUpdateCommentForm = (comment?: Comment | null): UseFormReturn<UpdateCommentFormData> => {
  return useForm<UpdateCommentFormData>({
    resolver: zodResolver(
      z.object({
        body: z.string().min(1, "댓글 내용을 입력해주세요").max(500, "댓글은 500자 이하여야 합니다").trim(),
      }),
    ),
    defaultValues: {
      body: comment?.body ?? "",
    },
    mode: "onChange",
  });
};
