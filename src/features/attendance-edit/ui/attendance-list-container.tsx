import { useQuery } from "@tanstack/react-query";

import { AttendanceList, attendanceApi, attendanceQueryKeys, useSelectedAttendance } from "@/entities/attendance";

type AttendanceListContainerProps = {
  employeeId: number;
};

export function AttendanceListContainer({ employeeId }: Readonly<AttendanceListContainerProps>) {
  const [, setSelectedAttendance] = useSelectedAttendance();

  const { data } = useQuery({
    queryKey: attendanceQueryKeys.byEmployee(employeeId),
    queryFn: () => attendanceApi.getByEmployee(employeeId),
    enabled: employeeId > 0,
  });

  const attendance = data?.attendance ?? [];

  return <AttendanceList attendance={attendance} onSelect={setSelectedAttendance} />;
}
