import { useAtomValue } from "jotai";

import { selectedDepartmentDescendantsAtom } from "@/entities/department";
import { EmployeesTable, useSelectedEmployee, useSetEmployeeDetailDialog } from "@/entities/employee";
import { EmployeeFilterContainer } from "@/features/employee-filter";
import { useEmployeesQuery } from "@/features/employee-load";
import { Pagination } from "@/shared/ui/pagination";

import { useEmployeeSearchParams } from "../../employee-filter";

export function EmployeeBrowsePanel() {
  const { params, setParams } = useEmployeeSearchParams();
  const selectedDescendants = useAtomValue(selectedDepartmentDescendantsAtom);
  const [, setSelectedEmployee] = useSelectedEmployee();
  const setDetailOpen = useSetEmployeeDetailDialog();

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
    <div className="space-y-4 border rounded-md bg-white p-4">
      <EmployeeFilterContainer />
      <EmployeesTable
        employees={data?.employees ?? []}
        onSelect={(employee) => {
          setSelectedEmployee(employee);
          setDetailOpen(true);
        }}
      />
      <Pagination
        total={data?.total ?? 0}
        skip={params.skip}
        limit={params.limit}
        onChangeLimit={(value) => setParams({ limit: Number(value), skip: 0 })}
        onPrev={() => setParams({ skip: Math.max(0, params.skip - params.limit) })}
        onNext={() => setParams({ skip: params.skip + params.limit })}
      />
    </div>
  );
}
