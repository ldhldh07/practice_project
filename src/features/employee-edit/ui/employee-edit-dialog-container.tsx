import { EmployeeEditDialog } from "@/entities/employee";

import { useEditEmployeeDialogFlow } from "../model/edit-employee.hook";

export function EmployeeEditDialogContainer() {
  const { isEditOpen, setIsEditOpen, form, handleSubmit } = useEditEmployeeDialogFlow();

  return <EmployeeEditDialog open={isEditOpen} onOpenChange={setIsEditOpen} form={form} onSubmit={handleSubmit} />;
}
