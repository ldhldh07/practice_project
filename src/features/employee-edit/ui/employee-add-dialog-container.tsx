import { EmployeeAddDialog } from "@/entities/employee";

import { useAddEmployeeDialogFlow } from "../model/edit-employee.hook";

export function EmployeeAddDialogContainer() {
  const { isAddOpen, setIsAddOpen, form, handleSubmit } = useAddEmployeeDialogFlow();

  return <EmployeeAddDialog open={isAddOpen} onOpenChange={setIsAddOpen} form={form} onSubmit={handleSubmit} />;
}
