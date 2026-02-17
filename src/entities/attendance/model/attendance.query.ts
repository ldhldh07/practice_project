import { queryOptions, useQuery } from "@tanstack/react-query";

import { attendanceQueryKeys } from "./attendance.keys";
import { attendanceApi } from "../api/attendance.api";

export const buildAttendanceByEmployeeQuery = (employeeId: number) =>
  queryOptions({
    queryKey: attendanceQueryKeys.byEmployee(employeeId),
    queryFn: () => attendanceApi.getByEmployee(employeeId),
    enabled: employeeId > 0,
  });

export function useAttendanceByEmployeeQuery(employeeId: number) {
  return useQuery(buildAttendanceByEmployeeQuery(employeeId));
}
