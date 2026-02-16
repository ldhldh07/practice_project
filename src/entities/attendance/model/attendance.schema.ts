import { z } from "zod";

export const attendanceStatusSchema = z.enum(["present", "late", "absent", "halfDay", "vacation"]);

export const attendanceSchema = z.object({
  id: z.number(),
  employeeId: z.number(),
  date: z.string(),
  checkIn: z.string().nullable(),
  checkOut: z.string().nullable(),
  status: attendanceStatusSchema,
  note: z.string().optional(),
});

export const attendanceListResponseSchema = z.object({
  attendance: z.array(attendanceSchema),
  total: z.number(),
});

export type AttendanceSchema = z.infer<typeof attendanceSchema>;
export type AttendanceStatus = z.infer<typeof attendanceStatusSchema>;
