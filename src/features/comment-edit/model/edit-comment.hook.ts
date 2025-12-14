import { useAtom } from "jotai";
import { useState } from "react";

import { Comment, CreateCommentPayload, useCommentManager, useSelectedComment } from "@/entities/comment";

import {
  isAddCommentDialogOpenAtom,
  isEditCommentDialogOpenAtom,
  newCommentAtom,
  type NewCommentDraft,
} from "./edit-comment.atoms";

export function useCommentActions(postId: number) {
  const commentManager = useCommentManager(postId);
  const [, setNewComment] = useNewComment();
  const [, setIsAddOpen] = useAddCommentDialog();
  const [, setIsEditOpen] = useEditCommentDialog();
  const [, setSelectedComment] = useSelectedComment();

  return {
    create: commentManager.create,
    update: commentManager.update,
    delete: commentManager.delete,
    like: commentManager.like,

    createAndReset: async (payload: CreateCommentPayload) => {
      await commentManager.create(payload);
      setNewComment({ body: "", postId: null, userId: payload.userId });
      setIsAddOpen(false);
    },

    updateAndClose: async (id: number, body: string) => {
      await commentManager.update(id, body);
      setIsEditOpen(false);
    },

    prepareEdit: (comment: Comment) => {
      setSelectedComment(comment);
      setIsEditOpen(true);
    },

    prepareNew: (userId?: number) => {
      setNewComment((prev) => ({ ...prev, postId, userId: userId ?? prev.userId }));
      setIsAddOpen(true);
    },

    resetForm: () => setNewComment({ body: "", postId: null, userId: 1 }),
    closeAddDialog: () => setIsAddOpen(false),
    closeEditDialog: () => setIsEditOpen(false),
  };
}

export function useCommentSubmitting() {
  return useState(false);
}

export function useNewComment() {
  return useAtom(newCommentAtom);
}

export function useAddCommentDialog() {
  return useAtom(isAddCommentDialogOpenAtom);
}

export function useEditCommentDialog() {
  return useAtom(isEditCommentDialogOpenAtom);
}

export type { NewCommentDraft };
