import { useAtom } from "jotai";
import { useState } from "react";

import { usePostManager, CreatePostParams, UpdatePostPayload } from "@/entities/post";

import { isAddPostDialogOpenAtom, isEditPostDialogOpenAtom, newPostAtom } from "./edit-post.atoms";

export const useNewPost = () => {
  return useAtom(newPostAtom);
};

export const useAddPostDialog = () => {
  return useAtom(isAddPostDialogOpenAtom);
};

export const useEditPostDialog = () => {
  return useAtom(isEditPostDialogOpenAtom);
};

export const usePostActions = () => {
  const postManager = usePostManager();
  const [, setNewPost] = useNewPost();
  const [, setIsAddOpen] = useAddPostDialog();
  const [, setIsEditOpen] = useEditPostDialog();

  return {
    create: postManager.create,
    update: postManager.update,
    delete: postManager.delete,

    createAndReset: async (payload: CreatePostParams) => {
      await postManager.create(payload);
      setNewPost({ title: "", body: "", userId: 1 });
      setIsAddOpen(false);
    },

    updateAndClose: async (payload: UpdatePostPayload) => {
      await postManager.update(payload);
      setIsEditOpen(false);
    },

    resetForm: () => setNewPost({ title: "", body: "", userId: 1 }),
    closeAddDialog: () => setIsAddOpen(false),
    closeEditDialog: () => setIsEditOpen(false),
  };
};

export const usePostSubmitting = () => {
  return useState(false);
};
