import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";

import { selectedUserAtom } from "./user.atom";
import { getUserFromCache, prefetchUserById } from "./user.query";
import { userApi } from "../api/user.api";

import type { User } from "./user.types";

export function useSelectedUser() {
  return useAtom(selectedUserAtom);
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
