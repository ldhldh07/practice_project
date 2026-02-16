import { useAtomValue } from "jotai";

import { selectedDepartmentDescendantsAtom } from "@/entities/department";
import { EmployeesTable, useEmployeeDetailDialog, useEmployeeSearchParams, useSelectedEmployee } from "@/entities/employee";
import { useEmployeesQuery } from "@/features/employee-load";

export function EmployeeTableContainer() {
  const { params } = useEmployeeSearchParams();
  const selectedDescendants = useAtomValue(selectedDepartmentDescendantsAtom);
  const [, setSelectedEmployee] = useSelectedEmployee();
  const [, setDetailOpen] = useEmployeeDetailDialog();

  const departmentIds = selectedDescendants.length > 0 ? selectedDescendants.join(",") : undefined;

  const { data } = useEmployeesQuery({
    limit: params.limit,
    skip: params.skip,
    search: params.search,
    status: params.status,
    sortBy: params.sortBy,
    order: params.order,
    departmentIds,
  });

  return (
    <EmployeesTable
      employees={data?.employees ?? []}
      onSelect={(employee) => {
        setSelectedEmployee(employee);
        setDetailOpen(true);
      }}
    />
  );
}
