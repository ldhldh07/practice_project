import {
  useSelectedAttendanceValue,
  useSetAddAttendanceDialog,
  useSetEditAttendanceDialog,
} from "@/entities/attendance";
import {
  EmployeeActionBar,
  EmployeeContent,
  useEmployeeDetailDialog,
  useSelectedEmployeeValue,
  useSetEditEmployeeDialog,
} from "@/entities/employee";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shared/ui/dialog";
import { Separator } from "@/shared/ui/separator";

type EmployeeDetailDialogContainerProps = {
  attendanceSlot?: import("react").ReactNode;
};

export function EmployeeDetailDialogContainer({ attendanceSlot }: Readonly<EmployeeDetailDialogContainerProps>) {
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

        <EmployeeActionBar
          onEditEmployee={() => {
            setIsEditEmployeeOpen(true);
            setIsDetailOpen(false);
          }}
          onAddAttendance={() => setIsAddAttendanceOpen(true)}
          onEditAttendance={() => setIsEditAttendanceOpen(true)}
          canEditAttendance={!!selectedAttendance}
        />

        {selectedEmployee ? attendanceSlot : null}
      </DialogContent>
    </Dialog>
  );
}
