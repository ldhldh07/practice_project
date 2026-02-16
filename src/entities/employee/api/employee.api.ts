import { http } from "@/shared/api/client";
import { validateSchema } from "@/shared/lib/validate";

import { employeeSchema, employeesResponseSchema } from "../model/employee.schema";

import type { Employee } from "../model/employee.types";

export type EmployeesParams = {
  limit: number;
  skip: number;
  search?: string;
  departmentId?: number;
  departmentIds?: string;
  status?: string;
  sortBy?: string;
  order?: string;
};

export interface EmployeesResponse {
  employees: Employee[];
  total: number;
  skip: number;
  limit: number;
}

export type CreateEmployeeParams = Omit<Employee, "id">;

export type UpdateEmployeeParams = Partial<Omit<Employee, "id">>;

export interface UpdateEmployeePayload {
  employeeId: number;
  params: UpdateEmployeeParams;
}

export const employeeApi = {
  async getList(params: EmployeesParams): Promise<EmployeesResponse> {
    const data = await http.get("/employees", { params });
    return validateSchema(employeesResponseSchema, data, "직원 목록 응답 검증 실패");
  },

  async getById(id: number): Promise<Employee> {
    const data = await http.get(`/employees/${id}`);
    return validateSchema(employeeSchema, data, "직원 상세 응답 검증 실패");
  },

  async create(payload: CreateEmployeeParams): Promise<Employee> {
    const data = await http.post("/employees", payload);
    return validateSchema(employeeSchema, data, "직원 생성 응답 검증 실패");
  },

  async update({ employeeId, params }: UpdateEmployeePayload): Promise<Employee> {
    const data = await http.put(`/employees/${employeeId}`, params);
    return validateSchema(employeeSchema, data, "직원 수정 응답 검증 실패");
  },

  remove(id: number): Promise<void> {
    return http.delete(`/employees/${id}`);
  },
} as const;
