import { useAddAttendanceDialog, useEditAttendanceDialog, useSelectedAttendance } from "@/entities/attendance";
import { EmployeeContent, useEditEmployeeDialog, useEmployeeDetailDialog, useSelectedEmployee } from "@/entities/employee";
import { AttendanceListContainer } from "@/features/attendance-edit";
import { Button } from "@/shared/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui/dialog";


export function EmployeeDetailDialogContainer() {
  const [selectedEmployee] = useSelectedEmployee();
  const [isDetailOpen, setIsDetailOpen] = useEmployeeDetailDialog();
  const [, setIsEditEmployeeOpen] = useEditEmployeeDialog();
  const [, setIsAddAttendanceOpen] = useAddAttendanceDialog();
  const [, setIsEditAttendanceOpen] = useEditAttendanceDialog();
  const [selectedAttendance] = useSelectedAttendance();

  return (
    <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>직원 상세</DialogTitle>
        </DialogHeader>

        <EmployeeContent employee={selectedEmployee} />

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setIsEditEmployeeOpen(true);
              setIsDetailOpen(false);
            }}
          >
            직원 정보 수정
          </Button>
          <Button variant="outline" onClick={() => setIsAddAttendanceOpen(true)}>
            근태 추가
          </Button>
          <Button variant="outline" disabled={!selectedAttendance} onClick={() => setIsEditAttendanceOpen(true)}>
            선택 근태 수정
          </Button>
        </div>

        {selectedEmployee ? <AttendanceListContainer employeeId={selectedEmployee.id} /> : null}
      </DialogContent>
    </Dialog>
  );
}
