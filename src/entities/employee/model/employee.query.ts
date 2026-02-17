import { keepPreviousData, queryOptions, useQuery } from "@tanstack/react-query";

import { employeeQueryKeys } from "./employee.keys";
import { employeeApi } from "../api/employee.api";

import type { EmployeesParams } from "../api/employee.api";

export const buildEmployeesQuery = (params: EmployeesParams) =>
  queryOptions({
    queryKey: employeeQueryKeys.list(params),
    queryFn: () => employeeApi.getList(params),
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  });

export const buildEmployeeDetailQuery = (employeeId: number) =>
  queryOptions({
    queryKey: employeeQueryKeys.detail(employeeId),
    queryFn: () => employeeApi.getById(employeeId),
    enabled: employeeId > 0,
  });

export function useEmployeesQuery(params: EmployeesParams) {
  return useQuery({
    ...buildEmployeesQuery(params),
    placeholderData: keepPreviousData,
  });
}
