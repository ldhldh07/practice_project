import { EmployeesTable } from "@/entities/employee";
import { EmployeeFilterContainer } from "@/features/employee-filter";
import { Pagination } from "@/shared/ui/pagination";

import { useEmployeeBrowse } from "../model/use-employee-browse";

export function EmployeeBrowsePanel() {
  const { employees, total, skip, limit, onSelect, onChangeLimit, onPrev, onNext } = useEmployeeBrowse();

  return (
    <div className="space-y-4">
      <EmployeeFilterContainer />
      <div className="rounded-xl border bg-card shadow-sm">
        <EmployeesTable employees={employees} onSelect={onSelect} />
        <div className="border-t px-4 py-3">
          <Pagination
            total={total}
            skip={skip}
            limit={limit}
            onChangeLimit={onChangeLimit}
            onPrev={onPrev}
            onNext={onNext}
          />
        </div>
      </div>
    </div>
  );
}
