import { useAtom } from "jotai";

import {
  useAddAttendanceDialog,
  useCreateAttendanceForm,
  useEditAttendanceDialog,
  useSelectedAttendance,
  useUpdateAttendanceForm,
} from "@/entities/attendance";
import { createModalFormHandler } from "@/shared";

import { useCreateAttendanceMutation, useUpdateAttendanceMutation } from "./attendance.mutation";
import { attendanceDialogModeAtom } from "./edit-attendance.atoms";

export function useAttendanceDialogMode() {
  return useAtom(attendanceDialogModeAtom);
}

export function useAttendanceAddDialogScenario(employeeId: number) {
  const [isAddOpen, setIsAddOpen] = useAddAttendanceDialog();
  const form = useCreateAttendanceForm();
  const createMutation = useCreateAttendanceMutation(employeeId);

  const handleSubmit = createModalFormHandler(
    form,
    () => setIsAddOpen(false),
    true,
  )(async (data) => {
    await createMutation.mutateAsync(data);
  });

  return {
    isAddOpen,
    setIsAddOpen,
    form,
    handleSubmit,
  };
}

export function useAttendanceEditDialogScenario(employeeId: number) {
  const [isEditOpen, setIsEditOpen] = useEditAttendanceDialog();
  const [selectedAttendance] = useSelectedAttendance();
  const form = useUpdateAttendanceForm(selectedAttendance);
  const updateMutation = useUpdateAttendanceMutation(employeeId);

  const handleSubmit = createModalFormHandler(
    form,
    () => setIsEditOpen(false),
    false,
  )(async (data) => {
    if (!selectedAttendance) return;
    await updateMutation.mutateAsync({ attendanceId: selectedAttendance.id, payload: data });
  });

  return {
    isEditOpen,
    setIsEditOpen,
    form,
    selectedAttendance,
    handleSubmit,
  };
}
