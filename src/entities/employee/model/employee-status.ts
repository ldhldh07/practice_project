import type { Employee } from "./employee.types";

type EmployeeStatusBadge = {
  label: string;
  variant: "success" | "warning" | "destructive";
};

export const EMPLOYEE_STATUS_CONFIG: Record<Employee["status"], EmployeeStatusBadge> = {
  active: { label: "재직", variant: "success" },
  onLeave: { label: "휴직", variant: "warning" },
  resigned: { label: "퇴사", variant: "destructive" },
};
