import { useAtom } from "jotai";

import {
  useAddEmployeeDialog,
  useCreateEmployeeForm,
  useEditEmployeeDialog,
  useSelectedEmployee,
  useSetAddEmployeeDialog,
  useUpdateEmployeeForm,
} from "@/entities/employee";
import { createModalFormHandler } from "@/shared";

import { employeeDialogModeAtom } from "./edit-employee.atoms";
import { useCreateEmployeeMutation, useDeleteEmployeeMutation, useUpdateEmployeeMutation } from "./employee.mutation";

export function useEmployeeDialogMode() {
  return useAtom(employeeDialogModeAtom);
}

export function useOpenAddEmployeeDialog() {
  return useSetAddEmployeeDialog();
}

export function useDeleteEmployeeAction() {
  const deleteMutation = useDeleteEmployeeMutation();

  return deleteMutation.mutateAsync;
}

export function useAddEmployeeDialogFlow() {
  const [isAddOpen, setIsAddOpen] = useAddEmployeeDialog();
  const form = useCreateEmployeeForm();
  const createMutation = useCreateEmployeeMutation();

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

export function useEditEmployeeDialogFlow() {
  const [isEditOpen, setIsEditOpen] = useEditEmployeeDialog();
  const [selectedEmployee] = useSelectedEmployee();
  const form = useUpdateEmployeeForm(selectedEmployee);
  const updateMutation = useUpdateEmployeeMutation();

  const handleSubmit = createModalFormHandler(
    form,
    () => setIsEditOpen(false),
    false,
  )(async (data) => {
    if (!selectedEmployee) return;
    await updateMutation.mutateAsync({ employeeId: selectedEmployee.id, params: data });
  });

  return {
    isEditOpen,
    setIsEditOpen,
    form,
    handleSubmit,
  };
}
