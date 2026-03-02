import { AttendanceEditDialog } from "@/entities/attendance";

import { useAttendanceEditDialogFlow } from "../model/edit-attendance.hook";

type AttendanceEditDialogContainerProps = {
  employeeId: number;
};

export function AttendanceEditDialogContainer({ employeeId }: Readonly<AttendanceEditDialogContainerProps>) {
  const { isEditOpen, setIsEditOpen, form, handleSubmit, error } = useAttendanceEditDialogFlow(employeeId);

  return (
    <AttendanceEditDialog
      open={isEditOpen}
      onOpenChange={setIsEditOpen}
      form={form}
      onSubmit={handleSubmit}
      error={error}
    />
  );
}
