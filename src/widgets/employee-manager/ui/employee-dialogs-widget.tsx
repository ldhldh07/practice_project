import { AttendanceDialogsBySelectedEmployee } from "@/features/attendance-edit";
import { EmployeeAddDialogContainer, EmployeeEditDialogContainer } from "@/features/employee-edit";

export function EmployeeDialogsWidget() {
  return (
    <>
      <EmployeeAddDialogContainer />
      <EmployeeEditDialogContainer />
      <AttendanceDialogsBySelectedEmployee />
    </>
  );
}
