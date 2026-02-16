import { AttendanceAddDialog, useCreateAttendanceForm } from "@/entities/attendance";
import { createModalFormHandler } from "@/shared";

import { useAttendanceActions, useAttendanceDialogState } from "../model/edit-attendance.hook";

type AttendanceAddDialogContainerProps = {
  employeeId: number;
};

export function AttendanceAddDialogContainer({ employeeId }: Readonly<AttendanceAddDialogContainerProps>) {
  const { isAddOpen, setIsAddOpen } = useAttendanceDialogState();
  const actions = useAttendanceActions(employeeId);
  const form = useCreateAttendanceForm();

  const handleSubmit = createModalFormHandler(form, () => setIsAddOpen(false), true)(async (data) => {
    await actions.create(data);
  });

  return <AttendanceAddDialog open={isAddOpen} onOpenChange={setIsAddOpen} form={form} onSubmit={handleSubmit} />;
}
