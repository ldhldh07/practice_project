import { Pencil } from "lucide-react";

import { Button } from "@/shared/ui/button";

import type { ReactNode } from "react";

type EmployeeActionBarProps = {
  onEditEmployee: () => void;
  extraActions?: ReactNode;
};

export function EmployeeActionBar({ onEditEmployee, extraActions }: Readonly<EmployeeActionBarProps>) {
  return (
    <div role="toolbar" aria-label="직원 관리 도구" className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" onClick={onEditEmployee}>
        <Pencil aria-hidden="true" className="h-4 w-4" />
        직원 정보 수정
      </Button>
      {extraActions}
    </div>
  );
}
