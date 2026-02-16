import { EmployeePageHeaderContainer } from "@/features/employee-edit";
import { EmployeeBodyWidget, EmployeeDialogsWidget } from "@/widgets/employee-manager";

export function EmployeeManagerPage() {
  return (
    <div className="space-y-6">
      <EmployeePageHeaderContainer />
      <EmployeeBodyWidget />
      <EmployeeDialogsWidget />
    </div>
  );
}
