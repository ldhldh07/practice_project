import { useParams } from "react-router-dom";

import { AttendanceDialogsBySelectedEmployee, AttendanceListContainer } from "@/features/attendance-edit";
import { EmployeeDetailSection } from "@/features/employee-detail";
import { EmployeeEditDialogContainer } from "@/features/employee-edit";
import { EMPLOYEE_MANAGER_ROUTE } from "@/shared/config/routes";

export function EmployeeDetailPage() {
  const { employeeId } = useParams<{ employeeId: string }>();
  const parsedEmployeeId = Number(employeeId);

  return (
    <>
      <EmployeeDetailSection employeeId={parsedEmployeeId} backToRoute={EMPLOYEE_MANAGER_ROUTE}>
        <AttendanceListContainer employeeId={parsedEmployeeId} />
      </EmployeeDetailSection>
      <EmployeeEditDialogContainer />
      <AttendanceDialogsBySelectedEmployee />
    </>
  );
}
