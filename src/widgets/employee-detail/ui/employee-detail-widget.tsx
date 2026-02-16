import { Link } from "react-router-dom";

import { EmployeeDetailPagePanel } from "@/features/employee-detail";
import { ROUTES } from "@/shared/config/routes";
import { Card, CardContent, CardHeader } from "@/shared/ui/card";

type EmployeeDetailWidgetProps = {
  employeeId: number;
};

export function EmployeeDetailWidget({ employeeId }: Readonly<EmployeeDetailWidgetProps>) {
  return (
    <Card className="w-full max-w-[1000px] mx-auto">
      <CardHeader className="flex-row items-center justify-between">
        <h2 className="text-xl font-semibold">직원 상세</h2>
        <Link
          to={ROUTES.EMPLOYEE_MANAGER}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 py-2 px-4 border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-100"
        >
          목록으로
        </Link>
      </CardHeader>

      <CardContent>
        <EmployeeDetailPagePanel employeeId={employeeId} />
      </CardContent>
    </Card>
  );
}
