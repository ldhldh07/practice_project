import { EmployeeAddDialog } from "@/entities/employee";

import { useAddEmployeeDialogScenario } from "../model/edit-employee.hook";

export function EmployeeAddDialogContainer() {
  const { isAddOpen, setIsAddOpen, form, handleSubmit } = useAddEmployeeDialogScenario();

  return <EmployeeAddDialog open={isAddOpen} onOpenChange={setIsAddOpen} form={form} onSubmit={handleSubmit} />;
}
