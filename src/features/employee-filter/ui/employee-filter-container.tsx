import { EmployeeFilter, useEmployeeSearchParams } from "@/entities/employee";

export function EmployeeFilterContainer() {
  const { params, setParams } = useEmployeeSearchParams();

  return (
    <EmployeeFilter
      search={params.search ?? ""}
      status={params.status ?? ""}
      sortBy={params.sortBy ?? "id"}
      order={params.order ?? "asc"}
      onSearchChange={(value) => setParams({ search: value || undefined, skip: 0 })}
      onStatusChange={(value) => setParams({ status: value || undefined, skip: 0 })}
      onSortByChange={(value) => setParams({ sortBy: value, skip: 0 })}
      onOrderChange={(value) => setParams({ order: value, skip: 0 })}
    />
  );
}
