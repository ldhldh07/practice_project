import { EmployeeAddDialog, useCreateEmployeeForm } from "@/entities/employee";
import { createModalFormHandler } from "@/shared";

import { useEmployeeActions, useEmployeeDialogState } from "../model/edit-employee.hook";

export function EmployeeAddDialogContainer() {
  const { isAddOpen, setIsAddOpen } = useEmployeeDialogState();
  const form = useCreateEmployeeForm();
  const actions = useEmployeeActions();

  const handleSubmit = createModalFormHandler(form, () => setIsAddOpen(false), true)(async (data) => {
    await actions.create(data);
  });

  return <EmployeeAddDialog open={isAddOpen} onOpenChange={setIsAddOpen} form={form} onSubmit={handleSubmit} />;
}
