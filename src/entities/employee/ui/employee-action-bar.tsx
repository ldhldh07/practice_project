import { Pencil, Plus } from "lucide-react";

import { Button } from "@/shared/ui/button";

type EmployeeActionBarProps = {
  onEditEmployee: () => void;
  onAddAttendance: () => void;
  onEditAttendance: () => void;
  canEditAttendance: boolean;
};

export function EmployeeActionBar({
  onEditEmployee,
  onAddAttendance,
  onEditAttendance,
  canEditAttendance,
}: Readonly<EmployeeActionBarProps>) {
  return (
    <div role="toolbar" aria-label="직원 관리 도구" className="flex gap-2">
      <Button variant="outline" size="sm" onClick={onEditEmployee}>
        <Pencil aria-hidden="true" className="h-4 w-4" />
        직원 정보 수정
      </Button>
      <Button variant="outline" size="sm" onClick={onAddAttendance}>
        <Plus aria-hidden="true" className="h-4 w-4" />
        근태 추가
      </Button>
      <Button variant="outline" size="sm" disabled={!canEditAttendance} onClick={onEditAttendance}>
        <Pencil aria-hidden="true" className="h-4 w-4" />
        선택 근태 수정
      </Button>
    </div>
  );
}
