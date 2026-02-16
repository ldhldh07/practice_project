import { Pencil, Plus } from "lucide-react";

import {
  useSelectedAttendanceValue,
  useSetAddAttendanceDialog,
  useSetEditAttendanceDialog,
} from "@/entities/attendance";
import {
  EmployeeContent,
  useEmployeeDetailDialog,
  useSelectedEmployeeValue,
  useSetEditEmployeeDialog,
} from "@/entities/employee";
import { AttendanceListContainer } from "@/features/attendance-edit";
import { Button } from "@/shared/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { Separator } from "@/shared/ui/separator";

export function EmployeeDetailDialogContainer() {
  const selectedEmployee = useSelectedEmployeeValue();
  const [isDetailOpen, setIsDetailOpen] = useEmployeeDetailDialog();
  const setIsEditEmployeeOpen = useSetEditEmployeeDialog();
  const setIsAddAttendanceOpen = useSetAddAttendanceDialog();
  const setIsEditAttendanceOpen = useSetEditAttendanceDialog();
  const selectedAttendance = useSelectedAttendanceValue();

  return (
    <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
      <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>직원 상세</DialogTitle>
          <DialogDescription>직원의 상세 정보와 근태 기록을 확인합니다.</DialogDescription>
        </DialogHeader>

        <EmployeeContent employee={selectedEmployee} />

        <Separator />

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setIsEditEmployeeOpen(true);
              setIsDetailOpen(false);
            }}
          >
            <Pencil />
            직원 정보 수정
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsAddAttendanceOpen(true)}>
            <Plus />
            근태 추가
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={!selectedAttendance}
            onClick={() => setIsEditAttendanceOpen(true)}
          >
            <Pencil />
            선택 근태 수정
          </Button>
        </div>

        {selectedEmployee ? <AttendanceListContainer employeeId={selectedEmployee.id} /> : null}
      </DialogContent>
    </Dialog>
  );
}
