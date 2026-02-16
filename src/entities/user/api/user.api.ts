import { http } from "@/shared/api/client";
import { validateSchema } from "@/shared/lib/validate";

import { userSchema, usersLiteResponseSchema } from "../model/user.schema";

import type { UserSchema, UserLiteSchema } from "../model/user.schema";

export const userApi = {
  async getProfile(): Promise<UserLiteSchema[]> {
    const data = await http.get("/users", {
      params: { limit: 0, select: ["username", "image"] },
    });
    const validated = validateSchema(usersLiteResponseSchema, data, "사용자 목록 응답 검증 실패");
    return validated.users;
  },
  async getById(id: number): Promise<UserSchema> {
    const data = await http.get(`/users/${id}`);
    return validateSchema(userSchema, data, "사용자 상세 응답 검증 실패");
  },
} as const;
