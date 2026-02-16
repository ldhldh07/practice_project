import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

import { EMPLOYEE_MANAGER_ROUTE } from "@/pages";
import { Card, CardContent, CardHeader } from "@/shared/ui/card";

import { EmployeeDetailPanel } from "./employee-detail-panel";
import { EMPLOYEE_DETAIL_TEXT } from "../model/employee-detail.constants";

type EmployeeDetailSectionProps = {
  employeeId: number;
};

export function EmployeeDetailSection({ employeeId }: Readonly<EmployeeDetailSectionProps>) {
  return (
    <Card className="mx-auto w-full max-w-4xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">{EMPLOYEE_DETAIL_TEXT.title}</h2>
          <Link
            to={EMPLOYEE_MANAGER_ROUTE}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {EMPLOYEE_DETAIL_TEXT.backToList}
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <EmployeeDetailPanel employeeId={employeeId} />
      </CardContent>
    </Card>
  );
}
