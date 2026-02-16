export interface EmployeesListParams {
  limit: number;
  skip: number;
  search?: string;
  departmentId?: number;
  departmentIds?: string;
  status?: string;
  sortBy?: string;
  order?: string;
}

export const employeeQueryKeys = {
  all: ["employees"] as const,
  list: (params: EmployeesListParams) => ["employees", "list", params] as const,
  detail: (id: number) => ["employees", "detail", id] as const,
  search: (query: string) => ["employees", "search", query] as const,
};
