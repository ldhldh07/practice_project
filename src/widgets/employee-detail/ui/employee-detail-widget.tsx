import { EmployeeDetailPageSection } from "@/features/employee-detail";

type EmployeeDetailWidgetProps = {
  employeeId: number;
};

export function EmployeeDetailWidget({ employeeId }: Readonly<EmployeeDetailWidgetProps>) {
  return <EmployeeDetailPageSection employeeId={employeeId} />;
}
