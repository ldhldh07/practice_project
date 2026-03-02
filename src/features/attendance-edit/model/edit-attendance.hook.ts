import { useEffect } from "react";

import {
  useAddAttendanceDialog,
  useCreateAttendanceForm,
  useEditAttendanceDialog,
  useSelectedAttendanceValue,
  useUpdateAttendanceForm,
} from "@/entities/attendance";

import { useCreateAttendanceMutation, useUpdateAttendanceMutation } from "./attendance.mutation";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : null;
}

export function useAttendanceAddDialogFlow(employeeId: number) {
  const [isAddOpen, setIsAddOpen] = useAddAttendanceDialog();
  const form = useCreateAttendanceForm();
  const createMutation = useCreateAttendanceMutation(employeeId);

  useEffect(() => {
    if (isAddOpen) {
      createMutation.reset();
    }
  }, [isAddOpen, createMutation]);

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      await createMutation.mutateAsync(data);
      setIsAddOpen(false);
      form.reset();
    } catch {
      return;
    }
  });

  return {
    isAddOpen,
    setIsAddOpen,
    form,
    handleSubmit,
    error: getErrorMessage(createMutation.error),
    resetError: createMutation.reset,
  };
}

export function useAttendanceEditDialogFlow(employeeId: number) {
  const [isEditOpen, setIsEditOpen] = useEditAttendanceDialog();
  const selectedAttendance = useSelectedAttendanceValue();
  const form = useUpdateAttendanceForm(selectedAttendance);
  const updateMutation = useUpdateAttendanceMutation(employeeId);

  useEffect(() => {
    if (isEditOpen) {
      updateMutation.reset();
    }
  }, [isEditOpen, updateMutation]);

  const handleSubmit = form.handleSubmit(async (data) => {
    if (!selectedAttendance) return;
    try {
      await updateMutation.mutateAsync({ attendanceId: selectedAttendance.id, payload: data });
      setIsEditOpen(false);
    } catch {
      return;
    }
  });

  return {
    isEditOpen,
    setIsEditOpen,
    form,
    selectedAttendance,
    handleSubmit,
    error: getErrorMessage(updateMutation.error),
    resetError: updateMutation.reset,
  };
}
