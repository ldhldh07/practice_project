import { EmployeeEditDialog } from "@/entities/employee";

import { useEditEmployeeDialogScenario } from "../model/edit-employee.hook";

export function EmployeeEditDialogContainer() {
  const { isEditOpen, setIsEditOpen, form, handleSubmit } = useEditEmployeeDialogScenario();

  return <EmployeeEditDialog open={isEditOpen} onOpenChange={setIsEditOpen} form={form} onSubmit={handleSubmit} />;
}
