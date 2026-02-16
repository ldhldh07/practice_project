import { AttendanceAddDialog } from "@/entities/attendance";

import { useAttendanceAddDialogFlow } from "../model/edit-attendance.hook";

type AttendanceAddDialogContainerProps = {
  employeeId: number;
};

export function AttendanceAddDialogContainer({ employeeId }: Readonly<AttendanceAddDialogContainerProps>) {
  const { isAddOpen, setIsAddOpen, form, handleSubmit } = useAttendanceAddDialogFlow(employeeId);

  return <AttendanceAddDialog open={isAddOpen} onOpenChange={setIsAddOpen} form={form} onSubmit={handleSubmit} />;
}
