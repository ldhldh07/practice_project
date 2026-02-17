import { EmployeesTable } from "@/entities/employee";
import { Pagination } from "@/shared/ui/pagination";

import { useEmployeeBrowse } from "../model/use-employee-browse";

import type { ReactNode } from "react";

type EmployeeBrowsePanelProps = {
  toDetailHref: (employeeId: number) => string;
  filterSlot?: ReactNode;
};

export function EmployeeBrowsePanel({ toDetailHref, filterSlot }: Readonly<EmployeeBrowsePanelProps>) {
  const { employees, total, skip, limit, onSelect, onChangeLimit, onPrev, onNext } = useEmployeeBrowse({
    toDetailHref,
  });

  return (
    <div className="space-y-4">
      {filterSlot}
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
