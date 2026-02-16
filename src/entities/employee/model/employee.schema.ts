import { z } from "zod";

export const employeeStatusSchema = z.enum(["active", "onLeave", "resigned"]);

export const employeeSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  position: z.string(),
  departmentId: z.number(),
  hireDate: z.string(),
  status: employeeStatusSchema,
  profileImage: z.string().optional(),
});

export const employeesResponseSchema = z.object({
  employees: z.array(employeeSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
});

export type EmployeeSchema = z.infer<typeof employeeSchema>;
export type EmployeesResponseSchema = z.infer<typeof employeesResponseSchema>;
export type EmployeeStatus = z.infer<typeof employeeStatusSchema>;
