import { useSearchParams } from "react-router-dom";

import {
  EMPLOYEE_SEARCH_DEFAULTS,
  type EmployeeSearchParams,
  type EmployeeSortBy,
  type SortOrder,
} from "@/shared/config/routes";

export function useEmployeeSearchParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const params: EmployeeSearchParams = {
    limit: Number(searchParams.get("limit") || EMPLOYEE_SEARCH_DEFAULTS.limit),
    skip: Number(searchParams.get("skip") || EMPLOYEE_SEARCH_DEFAULTS.skip),
    search: searchParams.get("search") || undefined,
    departmentId: searchParams.get("departmentId") ? Number(searchParams.get("departmentId")) : undefined,
    status: searchParams.get("status") || undefined,
    sortBy: (searchParams.get("sortBy") as EmployeeSortBy | null) || EMPLOYEE_SEARCH_DEFAULTS.sortBy,
    order: (searchParams.get("order") as SortOrder | null) || EMPLOYEE_SEARCH_DEFAULTS.order,
  };

  const setParams = (next: Partial<EmployeeSearchParams>) => {
    const merged = { ...params, ...next };
    const query = new URLSearchParams();

    Object.entries(merged).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;
      query.set(key, String(value));
    });

    setSearchParams(query);
  };

  return { params, setParams };
}
