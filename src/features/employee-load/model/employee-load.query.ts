import { queryOptions } from "@tanstack/react-query";

import { employeeApi, employeeQueryKeys } from "@/entities/employee";
import type { EmployeesParams } from "@/entities/employee";

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
