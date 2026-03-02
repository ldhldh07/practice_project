import type { Employee } from "@/entities/employee";
import { EmployeesTable } from "@/entities/employee";
import { Pagination } from "@/shared/ui/pagination";

import { useEmployeeBrowse } from "../model/use-employee-browse";

import type { ReactNode } from "react";

type EmployeeBrowsePanelProps = {
  onNavigate?: (employee: Employee) => void;
  filterSlot?: ReactNode;
};

export function EmployeeBrowsePanel({ onNavigate, filterSlot }: Readonly<EmployeeBrowsePanelProps>) {
  const { employees, total, skip, limit, onSelect, onChangeLimit, onPrev, onNext } = useEmployeeBrowse();

  const handleSelect = (employee: Employee) => {
    onSelect(employee);
    onNavigate?.(employee);
  };

  return (
    <div className="space-y-4">
      {filterSlot}
      <div className="rounded-xl border bg-card shadow-sm">
        <EmployeesTable employees={employees} onSelect={handleSelect} />
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
