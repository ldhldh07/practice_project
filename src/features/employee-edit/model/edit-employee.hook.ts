import { useAtom } from "jotai";

import {
  useAddEmployeeDialog,
  useCreateEmployeeMutation,
  useDeleteEmployeeMutation,
  useEditEmployeeDialog,
  useUpdateEmployeeMutation,
} from "@/entities/employee";

import { employeeDialogModeAtom } from "./edit-employee.atoms";

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
