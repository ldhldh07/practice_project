import { AttendanceList, useAttendanceByEmployeeQuery, useSetSelectedAttendance } from "@/entities/attendance";

type AttendanceListContainerProps = {
  employeeId: number;
};

export function AttendanceListContainer({ employeeId }: Readonly<AttendanceListContainerProps>) {
  const setSelectedAttendance = useSetSelectedAttendance();

  const { data } = useAttendanceByEmployeeQuery(employeeId);

  const attendance = data?.attendance ?? [];

  return <AttendanceList attendance={attendance} onSelect={setSelectedAttendance} />;
}
