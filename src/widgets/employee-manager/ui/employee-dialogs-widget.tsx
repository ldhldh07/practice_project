import { useSelectedEmployee } from "@/entities/employee";
import { AttendanceAddDialogContainer, AttendanceEditDialogContainer } from "@/features/attendance-edit";
import { EmployeeAddDialogContainer, EmployeeEditDialogContainer } from "@/features/employee-edit";

import { EmployeeDetailDialogContainer } from "./employee-detail-dialog-container";

export function EmployeeDialogsWidget() {
  const [selectedEmployee] = useSelectedEmployee();
  const employeeId = selectedEmployee?.id ?? 0;

  return (
    <>
      <EmployeeAddDialogContainer />
      <EmployeeEditDialogContainer />
      <EmployeeDetailDialogContainer />
      {employeeId > 0 ? <AttendanceAddDialogContainer employeeId={employeeId} /> : null}
      {employeeId > 0 ? <AttendanceEditDialogContainer employeeId={employeeId} /> : null}
    </>
  );
}
