import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

import { EmployeeDetailCard } from "@/entities/employee";
import { EMPLOYEE_MANAGER_ROUTE } from "@/pages";

import { EmployeeDetailPagePanel } from "./employee-detail-page-panel";
import { EMPLOYEE_DETAIL_TEXT } from "../model/employee-detail.constants";

type EmployeeDetailPageSectionProps = {
  employeeId: number;
};

export function EmployeeDetailPageSection({ employeeId }: Readonly<EmployeeDetailPageSectionProps>) {
  return (
    <EmployeeDetailCard
      title={EMPLOYEE_DETAIL_TEXT.title}
      action={
        <Link
          to={EMPLOYEE_MANAGER_ROUTE}
          className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {EMPLOYEE_DETAIL_TEXT.backToList}
        </Link>
      }
    >
      <EmployeeDetailPagePanel employeeId={employeeId} />
    </EmployeeDetailCard>
  );
}
