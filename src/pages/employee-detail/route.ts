export const EMPLOYEE_DETAIL_ROUTE = "/employees/:employeeId";
export const EMPLOYEE_DETAIL_TITLE = "직원 상세";

export const getEmployeeDetailHref = (employeeId: number | string) => `/employees/${employeeId}`;
