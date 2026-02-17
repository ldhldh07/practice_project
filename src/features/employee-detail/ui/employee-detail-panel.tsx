import { AlertCircle } from "lucide-react";

import {
  useSelectedAttendanceValue,
  useSetAddAttendanceDialog,
  useSetEditAttendanceDialog,
} from "@/entities/attendance";
import { EmployeeActionBar, EmployeeContent, useSetEditEmployeeDialog } from "@/entities/employee";
import { AttendanceDialogsBySelectedEmployee, AttendanceListContainer } from "@/features/attendance-edit";
import { EmployeeEditDialogContainer } from "@/features/employee-edit";
import { Separator } from "@/shared/ui/separator";
import { Skeleton } from "@/shared/ui/skeleton";

import { useEmployeeDetailLoad } from "../model/use-employee-detail-load";

type EmployeeDetailPanelProps = {
  employeeId: number;
};

export function EmployeeDetailPanel({ employeeId }: Readonly<EmployeeDetailPanelProps>) {
  const { employee, isLoading, isError } = useEmployeeDetailLoad(employeeId);
  const selectedAttendance = useSelectedAttendanceValue();

  const setIsEditEmployeeOpen = useSetEditEmployeeDialog();
  const setIsAddAttendanceOpen = useSetAddAttendanceDialog();
  const setIsEditAttendanceOpen = useSetEditAttendanceDialog();

  if (employeeId <= 0) {
    return (
      <p
        role="alert"
        className="flex h-32 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground"
      >
        유효하지 않은 직원 ID입니다.
      </p>
    );
  }

  if (isLoading) {
    return (
      <div aria-busy="true" aria-label="직원 정보 로딩 중" className="space-y-6">
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-28" />
            </div>
          ))}
        </div>
        <Separator />
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (isError || !employee) {
    return (
      <div
        role="alert"
        className="flex h-32 flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-sm text-muted-foreground"
      >
        <AlertCircle aria-hidden="true" className="h-5 w-5 text-destructive" />
        직원 정보를 불러오지 못했습니다.
      </div>
    );
  }

  return (
    <section aria-label="직원 상세 정보" className="space-y-6">
      <EmployeeContent employee={employee} />

      <Separator />

      <EmployeeActionBar
        onEditEmployee={() => setIsEditEmployeeOpen(true)}
        onAddAttendance={() => setIsAddAttendanceOpen(true)}
        onEditAttendance={() => setIsEditAttendanceOpen(true)}
        canEditAttendance={!!selectedAttendance}
      />

      <AttendanceListContainer employeeId={employeeId} />

      <EmployeeEditDialogContainer />
      <AttendanceDialogsBySelectedEmployee />
    </section>
  );
}
