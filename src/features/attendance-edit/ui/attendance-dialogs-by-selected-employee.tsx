import { useSelectedEmployeeValue } from "@/entities/employee";

import { AttendanceAddDialogContainer } from "./attendance-add-dialog-container";
import { AttendanceEditDialogContainer } from "./attendance-edit-dialog-container";

export function AttendanceDialogsBySelectedEmployee() {
  const selectedEmployee = useSelectedEmployeeValue();
  const employeeId = selectedEmployee?.id ?? 0;

  if (employeeId <= 0) return null;

  return (
    <>
      <AttendanceAddDialogContainer employeeId={employeeId} />
      <AttendanceEditDialogContainer employeeId={employeeId} />
    </>
  );
}
