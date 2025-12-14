import { useAtom } from "jotai";

import { useUserManager } from "@/entities/user";

import { isUserDetailOpenAtom, selectedUserAtom } from "./user-detail-modal.atoms";

export const useSelectedUser = () => {
  return useAtom(selectedUserAtom);
};

export const useUserDetailDialog = () => {
  return useAtom(isUserDetailOpenAtom);
};

export function useUserActions() {
  const userManager = useUserManager();
  const [, setUser] = useSelectedUser();
  const [, setIsOpen] = useUserDetailDialog();

  const openById = async (id: number) => {
    const cached = userManager.getFromCache(id);
    if (cached) setUser(cached);
    const loadedUser = await userManager.loadById(id);
    setUser(loadedUser);
    setIsOpen(true);
  };

  const close = () => setIsOpen(false);

  return {
    ...userManager,
    openById,
    close,
  };
}
