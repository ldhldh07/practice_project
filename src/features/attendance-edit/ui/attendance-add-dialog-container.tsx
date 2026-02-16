import { AttendanceAddDialog } from "@/entities/attendance";

import { useAttendanceAddDialogScenario } from "../model/edit-attendance.hook";

type AttendanceAddDialogContainerProps = {
  employeeId: number;
};

export function AttendanceAddDialogContainer({ employeeId }: Readonly<AttendanceAddDialogContainerProps>) {
  const { isAddOpen, setIsAddOpen, form, handleSubmit } = useAttendanceAddDialogScenario(employeeId);

  return <AttendanceAddDialog open={isAddOpen} onOpenChange={setIsAddOpen} form={form} onSubmit={handleSubmit} />;
}
