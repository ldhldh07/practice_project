import type { EmployeeSchema } from "./employee.schema";

export type Employee = EmployeeSchema;

export type EmployeeSortBy = "id" | "name" | "position" | "hireDate" | "status";
export type SortOrder = "asc" | "desc";
