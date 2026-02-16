import { http } from "@/shared/api/client";
import { validateSchema } from "@/shared/lib/validate";

import { attendanceListResponseSchema, attendanceSchema } from "../model/attendance.schema";

import type { Attendance } from "../model/attendance.types";

export interface AttendanceListResponse {
  attendance: Attendance[];
  total: number;
}

export type CreateAttendanceParams = Omit<Attendance, "id" | "employeeId">;
export type UpdateAttendanceParams = Partial<Omit<Attendance, "id" | "employeeId">>;

export const attendanceApi = {
  async getByEmployee(employeeId: number): Promise<AttendanceListResponse> {
    const data = await http.get(`/employees/${employeeId}/attendance`);
    return validateSchema(attendanceListResponseSchema, data, "근태 목록 응답 검증 실패");
  },

  async create(employeeId: number, payload: CreateAttendanceParams): Promise<Attendance> {
    const data = await http.post(`/employees/${employeeId}/attendance`, payload);
    return validateSchema(attendanceSchema, data, "근태 생성 응답 검증 실패");
  },

  async update(attendanceId: number, payload: UpdateAttendanceParams): Promise<Attendance> {
    const data = await http.put(`/attendance/${attendanceId}`, payload);
    return validateSchema(attendanceSchema, data, "근태 수정 응답 검증 실패");
  },
} as const;
