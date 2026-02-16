import {
  useAddEmployeeDialog,
  useCreateEmployeeForm,
  useEditEmployeeDialog,
  useSelectedEmployeeValue,
  useUpdateEmployeeForm,
} from "@/entities/employee";
import { createModalFormHandler } from "@/shared";

import { useCreateEmployeeMutation, useUpdateEmployeeMutation } from "./employee.mutation";

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
  const selectedEmployee = useSelectedEmployeeValue();
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
