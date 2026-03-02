import { useEffect } from "react";

import {
  useAddEmployeeDialog,
  useCreateEmployeeForm,
  useEditEmployeeDialog,
  useSelectedEmployeeValue,
  useUpdateEmployeeForm,
} from "@/entities/employee";

import { useCreateEmployeeMutation, useUpdateEmployeeMutation } from "./employee.mutation";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : null;
}

export function useAddEmployeeDialogFlow() {
  const [isAddOpen, setIsAddOpen] = useAddEmployeeDialog();
  const form = useCreateEmployeeForm();
  const createMutation = useCreateEmployeeMutation();

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

export function useEditEmployeeDialogFlow() {
  const [isEditOpen, setIsEditOpen] = useEditEmployeeDialog();
  const selectedEmployee = useSelectedEmployeeValue();
  const form = useUpdateEmployeeForm(selectedEmployee);
  const updateMutation = useUpdateEmployeeMutation();

  useEffect(() => {
    if (isEditOpen) {
      updateMutation.reset();
    }
  }, [isEditOpen, updateMutation]);

  const handleSubmit = form.handleSubmit(async (data) => {
    if (!selectedEmployee) return;
    try {
      await updateMutation.mutateAsync({ employeeId: selectedEmployee.id, params: data });
      setIsEditOpen(false);
    } catch {
      return;
    }
  });

  return {
    isEditOpen,
    setIsEditOpen,
    form,
    handleSubmit,
    error: getErrorMessage(updateMutation.error),
    resetError: updateMutation.reset,
  };
}
