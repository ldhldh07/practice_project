export const EMPLOYEE_MANAGER_ROUTE = "/";
export const EMPLOYEE_DETAIL_ROUTE = "/employees/:employeeId";
export const NOT_FOUND_ROUTE = "*";

export type EmployeeSortBy = "id" | "name" | "position" | "hireDate" | "status";
export type SortOrder = "asc" | "desc";

export type EmployeeSearchParams = {
  limit: number;
  skip: number;
  search?: string;
  departmentId?: number;
  status?: string;
  sortBy?: EmployeeSortBy;
  order?: SortOrder;
};

export const EMPLOYEE_SEARCH_DEFAULTS: EmployeeSearchParams = {
  limit: 10,
  skip: 0,
  sortBy: "id",
  order: "asc",
};

export const getEmployeeDetailHref = (employeeId: number | string) => `/employees/${employeeId}`;
