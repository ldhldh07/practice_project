import { useAtom } from "jotai";

import { useAddEmployeeDialog, useEditEmployeeDialog, useSetAddEmployeeDialog } from "@/entities/employee";

import { employeeDialogModeAtom } from "./edit-employee.atoms";
import { useCreateEmployeeMutation, useDeleteEmployeeMutation, useUpdateEmployeeMutation } from "./employee.mutation";

export function useEmployeeDialogMode() {
  return useAtom(employeeDialogModeAtom);
}

export function useEmployeeActions() {
  const createMutation = useCreateEmployeeMutation();
  const updateMutation = useUpdateEmployeeMutation();
  const deleteMutation = useDeleteEmployeeMutation();

  return {
    create: createMutation.mutateAsync,
    update: updateMutation.mutateAsync,
    remove: deleteMutation.mutateAsync,
  };
}

export function useEmployeeDialogState() {
  const [isAddOpen, setIsAddOpen] = useAddEmployeeDialog();
  const [isEditOpen, setIsEditOpen] = useEditEmployeeDialog();

  return {
    isAddOpen,
    setIsAddOpen,
    isEditOpen,
    setIsEditOpen,
  };
}

export function useOpenAddEmployeeDialog() {
  return useSetAddEmployeeDialog();
}
