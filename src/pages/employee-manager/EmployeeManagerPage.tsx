import { EmployeePageHeaderContainer } from "@/features/employee-edit";
import { getEmployeeDetailHref } from "@/shared/config/routes";
import { EmployeeBodyWidget, EmployeeDialogsWidget } from "@/widgets/employee-manager";

export function EmployeeManagerPage() {
  return (
    <div className="space-y-6">
      <EmployeePageHeaderContainer />
      <EmployeeBodyWidget toEmployeeDetailHref={getEmployeeDetailHref} />
      <EmployeeDialogsWidget />
    </div>
  );
}
