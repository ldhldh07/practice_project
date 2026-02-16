import { useAtomValue } from "jotai";
import { useNavigate } from "react-router-dom";

import { selectedDepartmentDescendantsAtom } from "@/entities/department";
import { useSetSelectedEmployee } from "@/entities/employee";
import type { Employee } from "@/entities/employee";
import { useEmployeeSearchParams } from "@/features/employee-filter";
import { useEmployeesQuery } from "@/features/employee-load";
import { getEmployeeDetailHref } from "@/pages";

function useEmployeeListQuery() {
  const { params } = useEmployeeSearchParams();
  const selectedDescendants = useAtomValue(selectedDepartmentDescendantsAtom);
  const departmentIds = selectedDescendants.length > 0 ? selectedDescendants.join(",") : undefined;

  return useEmployeesQuery({
    limit: params.limit,
    skip: params.skip,
    search: params.search,
    departmentIds,
    status: params.status,
    sortBy: params.sortBy,
    order: params.order,
  });
}

export function useEmployeeBrowse() {
  const { params, setParams } = useEmployeeSearchParams();
  const { data } = useEmployeeListQuery();
  const navigate = useNavigate();
  const setSelectedEmployee = useSetSelectedEmployee();

  const onSelect = (employee: Employee) => {
    setSelectedEmployee(employee);
    navigate(getEmployeeDetailHref(employee.id));
  };

  const onChangeLimit = (value: number) => setParams({ limit: value, skip: 0 });
  const onPrev = () => setParams({ skip: Math.max(0, params.skip - params.limit) });
  const onNext = () => setParams({ skip: params.skip + params.limit });

  return {
    employees: data?.employees ?? [],
    total: data?.total ?? 0,
    skip: params.skip,
    limit: params.limit,
    onSelect,
    onChangeLimit,
    onPrev,
    onNext,
  };
}
