import { EmployeeEditDialog, useSelectedEmployee, useUpdateEmployeeForm } from "@/entities/employee";
import { createModalFormHandler } from "@/shared";

import { useEmployeeActions, useEmployeeDialogState } from "../model/edit-employee.hook";

export function EmployeeEditDialogContainer() {
  const { isEditOpen, setIsEditOpen } = useEmployeeDialogState();
  const [selectedEmployee] = useSelectedEmployee();
  const form = useUpdateEmployeeForm(selectedEmployee);
  const actions = useEmployeeActions();

  const handleSubmit = createModalFormHandler(form, () => setIsEditOpen(false), false)(async (data) => {
    if (!selectedEmployee) return;
    await actions.update({ employeeId: selectedEmployee.id, params: data });
  });

  return <EmployeeEditDialog open={isEditOpen} onOpenChange={setIsEditOpen} form={form} onSubmit={handleSubmit} />;
}
