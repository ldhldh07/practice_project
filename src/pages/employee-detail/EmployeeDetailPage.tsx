import { useParams } from "react-router-dom";

import { EmployeeDetailSection } from "@/features/employee-detail";

export function EmployeeDetailPage() {
  const { employeeId } = useParams<{ employeeId: string }>();
  const parsedEmployeeId = Number(employeeId);

  return <EmployeeDetailSection employeeId={parsedEmployeeId} />;
}
