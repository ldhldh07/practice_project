import { http } from "@/shared/api/client";
import { validateSchema } from "@/shared/lib/validate";

import { departmentsSchema } from "../model/department.schema";

import type { Department } from "../model/department.types";

export const departmentApi = {
  async getList(): Promise<Department[]> {
    const data = await http.get("/departments");
    return validateSchema(departmentsSchema, data, "부서 목록 응답 검증 실패");
  },
} as const;
