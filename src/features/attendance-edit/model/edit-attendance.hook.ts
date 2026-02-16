import { useAtom } from "jotai";

import {
  useAddAttendanceDialog,
  useCreateAttendanceMutation,
  useEditAttendanceDialog,
  useSelectedAttendance,
  useUpdateAttendanceMutation,
} from "@/entities/attendance";

import { attendanceDialogModeAtom } from "./edit-attendance.atoms";

export function useAttendanceDialogMode() {
  return useAtom(attendanceDialogModeAtom);
}

export function useAttendanceDialogState() {
  const [isAddOpen, setIsAddOpen] = useAddAttendanceDialog();
  const [isEditOpen, setIsEditOpen] = useEditAttendanceDialog();
  return { isAddOpen, setIsAddOpen, isEditOpen, setIsEditOpen };
}

export function useAttendanceActions(employeeId: number) {
  const createMutation = useCreateAttendanceMutation(employeeId);
  const updateMutation = useUpdateAttendanceMutation(employeeId);
  const [selectedAttendance] = useSelectedAttendance();

  return {
    selectedAttendance,
    create: createMutation.mutateAsync,
    update: (payload: Parameters<typeof updateMutation.mutateAsync>[0]) => updateMutation.mutateAsync(payload),
  };
}
