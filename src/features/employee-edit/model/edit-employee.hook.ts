import {
  useAddEmployeeDialog,
  useCreateEmployeeForm,
  useEditEmployeeDialog,
  useSelectedEmployeeValue,
  useUpdateEmployeeForm,
} from "@/entities/employee";

import { useCreateEmployeeMutation, useUpdateEmployeeMutation } from "./employee.mutation";

export function useAddEmployeeDialogFlow() {
  const [isAddOpen, setIsAddOpen] = useAddEmployeeDialog();
  const form = useCreateEmployeeForm();
  const createMutation = useCreateEmployeeMutation();

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

export function useEditEmployeeDialogFlow() {
  const [isEditOpen, setIsEditOpen] = useEditEmployeeDialog();
  const selectedEmployee = useSelectedEmployeeValue();
  const form = useUpdateEmployeeForm(selectedEmployee);
  const updateMutation = useUpdateEmployeeMutation();

  const handleSubmit = form.handleSubmit((data) => {
    if (!selectedEmployee) return;
    updateMutation.mutate({ employeeId: selectedEmployee.id, params: data });
    setIsEditOpen(false);
  });

  return {
    isEditOpen,
    setIsEditOpen,
    form,
    handleSubmit,
  };
}
