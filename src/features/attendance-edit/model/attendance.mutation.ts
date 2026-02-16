import { useMutation, useQueryClient } from "@tanstack/react-query";

import { attendanceApi, attendanceQueryKeys } from "@/entities/attendance";
import type {
  Attendance,
  AttendanceListResponse,
  CreateAttendanceParams,
  UpdateAttendanceParams,
} from "@/entities/attendance";

export function useCreateAttendanceMutation(employeeId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAttendanceParams) => attendanceApi.create(employeeId, payload),
    onMutate: async (payload) => {
      const key = attendanceQueryKeys.byEmployee(employeeId);
      const prev = queryClient.getQueryData<AttendanceListResponse>(key);

      const optimistic: Attendance = {
        id: Date.now(),
        employeeId,
        date: payload.date,
        checkIn: payload.checkIn,
        checkOut: payload.checkOut,
        status: payload.status,
        note: payload.note,
      };

      queryClient.setQueryData<AttendanceListResponse>(key, (old) => {
        const snapshot = old ?? { attendance: [], total: 0 };
        return { attendance: [optimistic, ...snapshot.attendance], total: snapshot.total + 1 };
      });

      return { prev };
    },
    onError: (_error, _variables, context) => {
      if (!context) return;
      queryClient.setQueryData(attendanceQueryKeys.byEmployee(employeeId), context.prev);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: attendanceQueryKeys.byEmployee(employeeId) });
    },
  });
}

export function useUpdateAttendanceMutation(employeeId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ attendanceId, payload }: { attendanceId: number; payload: UpdateAttendanceParams }) =>
      attendanceApi.update(attendanceId, payload),
    onMutate: async ({ attendanceId, payload }) => {
      const key = attendanceQueryKeys.byEmployee(employeeId);
      const prev = queryClient.getQueryData<AttendanceListResponse>(key);

      queryClient.setQueryData<AttendanceListResponse>(key, (old) => {
        if (!old) return old;
        return {
          ...old,
          attendance: old.attendance.map((item) => (item.id === attendanceId ? { ...item, ...payload } : item)),
        };
      });

      return { prev };
    },
    onError: (_error, _variables, context) => {
      if (!context) return;
      queryClient.setQueryData(attendanceQueryKeys.byEmployee(employeeId), context.prev);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: attendanceQueryKeys.byEmployee(employeeId) });
    },
  });
}
