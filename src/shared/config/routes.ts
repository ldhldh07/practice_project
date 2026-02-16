export const EMPLOYEE_MANAGER_ROUTE = "/";
export const EMPLOYEE_DETAIL_ROUTE = "/employees/:employeeId";
export const NOT_FOUND_ROUTE = "*";

export const getEmployeeDetailHref = (employeeId: number | string) => `/employees/${employeeId}`;
