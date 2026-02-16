import { EmployeePageHeader, useSetAddEmployeeDialog } from "@/entities/employee";

export function EmployeePageHeaderContainer() {
  const setIsAddOpen = useSetAddEmployeeDialog();

  return <EmployeePageHeader onAdd={() => setIsAddOpen(true)} />;
}
