import { Card } from "@/shared/ui";
import { EmployeeBodyWidget, EmployeeDialogsWidget, EmployeeHeaderWidget } from "@/widgets/employee-manager";

export function EmployeeManagerPage() {
  return (
    <Card className="w-full max-w-[1400px] mx-auto">
      <EmployeeHeaderWidget />
      <EmployeeBodyWidget />
      <EmployeeDialogsWidget />
    </Card>
  );
}
