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
          className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 py-2 px-4 border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-100"
        >
          {EMPLOYEE_DETAIL_TEXT.backToList}
        </Link>
      }
    >
      <EmployeeDetailPagePanel employeeId={employeeId} />
    </EmployeeDetailCard>
  );
}
