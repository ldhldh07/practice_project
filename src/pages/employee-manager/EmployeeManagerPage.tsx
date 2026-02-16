import { EmployeeBodyWidget, EmployeeDialogsWidget, EmployeeHeaderWidget } from "@/widgets/employee-manager";

export function EmployeeManagerPage() {
  return (
    <div className="space-y-6">
      <EmployeeHeaderWidget />
      <EmployeeBodyWidget />
      <EmployeeDialogsWidget />
    </div>
  );
}
