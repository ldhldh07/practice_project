import { Plus } from "lucide-react";

import { useOpenAddEmployeeDialog } from "@/features/employee-edit";
import { Button } from "@/shared/ui/button";

export function EmployeeHeaderWidget() {
  const setIsAddOpen = useOpenAddEmployeeDialog();

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">직원 관리</h1>
        <p className="text-sm text-muted-foreground">조직의 구성원 정보를 관리합니다</p>
      </div>
      <Button onClick={() => setIsAddOpen(true)}>
        <Plus className="h-4 w-4" />
        직원 추가
      </Button>
    </div>
  );
}
