import { useAtomValue } from "jotai";
import { useNavigate } from "react-router-dom";

import { selectedDepartmentDescendantsAtom } from "@/entities/department";
import { EmployeesTable, useSelectedEmployee } from "@/entities/employee";
import { EmployeeFilterContainer } from "@/features/employee-filter";
import { useEmployeesQuery } from "@/features/employee-load";
import { getEmployeeDetailHref } from "@/pages";
import { Pagination } from "@/shared/ui/pagination";

import { useEmployeeSearchParams } from "../../employee-filter";

export function EmployeeBrowsePanel() {
  const navigate = useNavigate();
  const { params, setParams } = useEmployeeSearchParams();
  const selectedDescendants = useAtomValue(selectedDepartmentDescendantsAtom);
  const [, setSelectedEmployee] = useSelectedEmployee();

  const departmentIds = selectedDescendants.length > 0 ? selectedDescendants.join(",") : undefined;

  const { data } = useEmployeesQuery({
    limit: params.limit,
    skip: params.skip,
    search: params.search,
    departmentIds,
    status: params.status,
    sortBy: params.sortBy,
    order: params.order,
  });

  return (
    <div className="space-y-4">
      <EmployeeFilterContainer />
      <div className="rounded-xl border bg-card shadow-sm">
        <EmployeesTable
          employees={data?.employees ?? []}
          onSelect={(employee) => {
            setSelectedEmployee(employee);
            navigate(getEmployeeDetailHref(employee.id));
          }}
        />
        <div className="border-t px-4 py-3">
          <Pagination
            total={data?.total ?? 0}
            skip={params.skip}
            limit={params.limit}
            onChangeLimit={(value) => setParams({ limit: Number(value), skip: 0 })}
            onPrev={() => setParams({ skip: Math.max(0, params.skip - params.limit) })}
            onNext={() => setParams({ skip: params.skip + params.limit })}
          />
        </div>
      </div>
    </div>
  );
}
