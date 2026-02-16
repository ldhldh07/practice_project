import {
  useAddAttendanceDialog,
  useCreateAttendanceForm,
  useEditAttendanceDialog,
  useSelectedAttendanceValue,
  useUpdateAttendanceForm,
} from "@/entities/attendance";

import { useCreateAttendanceMutation, useUpdateAttendanceMutation } from "./attendance.mutation";

export function useAttendanceAddDialogFlow(employeeId: number) {
  const [isAddOpen, setIsAddOpen] = useAddAttendanceDialog();
  const form = useCreateAttendanceForm();
  const createMutation = useCreateAttendanceMutation(employeeId);

  const handleSubmit = form.handleSubmit((data) => {
    createMutation.mutate(data);
    setIsAddOpen(false);
    form.reset();
  });

  return {
    isAddOpen,
    setIsAddOpen,
    form,
    handleSubmit,
  };
}

export function useAttendanceEditDialogFlow(employeeId: number) {
  const [isEditOpen, setIsEditOpen] = useEditAttendanceDialog();
  const selectedAttendance = useSelectedAttendanceValue();
  const form = useUpdateAttendanceForm(selectedAttendance);
  const updateMutation = useUpdateAttendanceMutation(employeeId);

  const handleSubmit = form.handleSubmit((data) => {
    if (!selectedAttendance) return;
    updateMutation.mutate({ attendanceId: selectedAttendance.id, payload: data });
    setIsEditOpen(false);
  });

  return {
    isEditOpen,
    setIsEditOpen,
    form,
    selectedAttendance,
    handleSubmit,
  };
}
