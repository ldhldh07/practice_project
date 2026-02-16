import { useParams } from "react-router-dom";

import { EmployeeDetailPageSection } from "@/features/employee-detail";

export function EmployeeDetailPage() {
  const { employeeId } = useParams<{ employeeId: string }>();
  const parsedEmployeeId = Number(employeeId);

  return <EmployeeDetailPageSection employeeId={parsedEmployeeId} />;
}
