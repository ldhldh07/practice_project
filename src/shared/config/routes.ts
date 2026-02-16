export const ROUTES = {
  EMPLOYEE_MANAGER: "/",
  EMPLOYEE_DETAIL: "/employees/:employeeId",
  employeeDetail: (employeeId: number | string) => `/employees/${employeeId}`,
} as const;
