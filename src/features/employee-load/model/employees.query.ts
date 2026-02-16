import { keepPreviousData, useQuery } from "@tanstack/react-query";

import type { EmployeesParams } from "@/entities/employee";

import { buildEmployeesQuery } from "./employee-load.query";

export function useEmployeesQuery(params: EmployeesParams) {
  return useQuery({
    ...buildEmployeesQuery(params),
    placeholderData: keepPreviousData,
  });
}
