import { AttendanceEditDialog } from "@/entities/attendance";

import { useAttendanceEditDialogScenario } from "../model/edit-attendance.hook";

type AttendanceEditDialogContainerProps = {
  employeeId: number;
};

export function AttendanceEditDialogContainer({ employeeId }: Readonly<AttendanceEditDialogContainerProps>) {
  const { isEditOpen, setIsEditOpen, form, handleSubmit } = useAttendanceEditDialogScenario(employeeId);

  return <AttendanceEditDialog open={isEditOpen} onOpenChange={setIsEditOpen} form={form} onSubmit={handleSubmit} />;
}
