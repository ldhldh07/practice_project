import { useSearchParams } from "react-router-dom";

import type { EmployeeSortBy, SortOrder } from "@/entities/employee";

export type EmployeeSearchParams = {
  limit: number;
  skip: number;
  search?: string;
  departmentId?: number;
  status?: string;
  sortBy?: EmployeeSortBy;
  order?: SortOrder;
};

const DEFAULTS: EmployeeSearchParams = {
  limit: 10,
  skip: 0,
  sortBy: "id",
  order: "asc",
};

export function useEmployeeSearchParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const params: EmployeeSearchParams = {
    limit: Number(searchParams.get("limit") || DEFAULTS.limit),
    skip: Number(searchParams.get("skip") || DEFAULTS.skip),
    search: searchParams.get("search") || undefined,
    departmentId: searchParams.get("departmentId") ? Number(searchParams.get("departmentId")) : undefined,
    status: searchParams.get("status") || undefined,
    sortBy: (searchParams.get("sortBy") as EmployeeSortBy | null) || DEFAULTS.sortBy,
    order: (searchParams.get("order") as SortOrder | null) || DEFAULTS.order,
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
