import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";

import { currentUserIdAtom, isUserModalOpenAtom, selectedUserAtom } from "./user.atom";
import { getUserFromCache, prefetchUserById } from "./user.query";
import { userApi } from "../api/user.api";

import type { User } from "./user.types";

export function useSelectedUser(): [User | null, (user: User | null) => void] {
  return useAtom(selectedUserAtom);
}

export function useCurrentUserId(): [number | null, (id: number | null) => void] {
  return useAtom(currentUserIdAtom);
}

export function useUserModal(): [boolean, (open: boolean) => void] {
  return useAtom(isUserModalOpenAtom);
}

export function useUserManager() {
  const queryClient = useQueryClient();

  return {
    getFromCache: (id: number) => getUserFromCache(queryClient, id),

    prefetchById: (id: number) => prefetchUserById(queryClient, id),

    loadById: async (id: number): Promise<User | null> => {
      const cached = getUserFromCache(queryClient, id);
      if (cached) return cached;

      await prefetchUserById(queryClient, id);
      return getUserFromCache(queryClient, id) ?? null;
    },

    getById: (id: number) => userApi.getById(id),
  };
}
