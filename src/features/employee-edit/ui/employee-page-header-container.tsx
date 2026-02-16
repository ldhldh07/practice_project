import { EmployeePageHeader } from "@/entities/employee";

import { useOpenAddEmployeeDialog } from "../model/edit-employee.hook";

export function EmployeePageHeaderContainer() {
  const setIsAddOpen = useOpenAddEmployeeDialog();

  return <EmployeePageHeader onAdd={() => setIsAddOpen(true)} />;
}
