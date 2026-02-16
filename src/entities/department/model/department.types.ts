import type { DepartmentSchema } from "./department.schema";

export type Department = DepartmentSchema;

export type DepartmentTreeNode = Department & {
  children: DepartmentTreeNode[];
};
