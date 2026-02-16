import { z } from "zod";

export const departmentSchema = z.object({
  id: z.number(),
  parentId: z.number().nullable(),
  name: z.string(),
  description: z.string(),
  headCount: z.number(),
});

export const departmentsSchema = z.array(departmentSchema);

export type DepartmentSchema = z.infer<typeof departmentSchema>;
