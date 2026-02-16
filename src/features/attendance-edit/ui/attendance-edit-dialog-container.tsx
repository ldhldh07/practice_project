import { AttendanceEditDialog, useSelectedAttendance, useUpdateAttendanceForm } from "@/entities/attendance";
import { createModalFormHandler } from "@/shared";

import { useAttendanceActions, useAttendanceDialogState } from "../model/edit-attendance.hook";

type AttendanceEditDialogContainerProps = {
  employeeId: number;
};

export function AttendanceEditDialogContainer({ employeeId }: Readonly<AttendanceEditDialogContainerProps>) {
  const { isEditOpen, setIsEditOpen } = useAttendanceDialogState();
  const [selectedAttendance] = useSelectedAttendance();
  const actions = useAttendanceActions(employeeId);
  const form = useUpdateAttendanceForm(selectedAttendance);

  const handleSubmit = createModalFormHandler(form, () => setIsEditOpen(false), false)(async (data) => {
    if (!selectedAttendance) return;
    await actions.update({ attendanceId: selectedAttendance.id, payload: data });
  });

  return <AttendanceEditDialog open={isEditOpen} onOpenChange={setIsEditOpen} form={form} onSubmit={handleSubmit} />;
}
