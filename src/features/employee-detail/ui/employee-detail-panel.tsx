import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Pencil, Plus } from "lucide-react";
import { useEffect } from "react";

import { useSelectedAttendance, useSetAddAttendanceDialog, useSetEditAttendanceDialog } from "@/entities/attendance";
import {
  EmployeeContent,
  employeeApi,
  employeeQueryKeys,
  useSetSelectedEmployee,
  useSetEditEmployeeDialog,
} from "@/entities/employee";
import { AttendanceDialogsBySelectedEmployee, AttendanceListContainer } from "@/features/attendance-edit";
import { EmployeeEditDialogContainer } from "@/features/employee-edit";
import { Button } from "@/shared/ui/button";
import { Separator } from "@/shared/ui/separator";
import { Skeleton } from "@/shared/ui/skeleton";

type EmployeeDetailPanelProps = {
  employeeId: number;
};

export function EmployeeDetailPanel({ employeeId }: Readonly<EmployeeDetailPanelProps>) {
  const setSelectedEmployee = useSetSelectedEmployee();
  const [selectedAttendance] = useSelectedAttendance();

  const setIsEditEmployeeOpen = useSetEditEmployeeDialog();
  const setIsAddAttendanceOpen = useSetAddAttendanceDialog();
  const setIsEditAttendanceOpen = useSetEditAttendanceDialog();

  const query = useQuery({
    queryKey: employeeQueryKeys.detail(employeeId),
    queryFn: () => employeeApi.getById(employeeId),
    enabled: employeeId > 0,
  });

  useEffect(() => {
    if (!query.data) return;
    setSelectedEmployee(query.data);

    return () => {
      setSelectedEmployee(null);
    };
  }, [query.data, setSelectedEmployee]);

  if (employeeId <= 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
        유효하지 않은 직원 ID입니다.
      </div>
    );
  }

  if (query.isLoading) {
    return (
      <div className="space-y-6">
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

  if (query.isError || !query.data) {
    return (
      <div className="flex h-32 flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-sm text-muted-foreground">
        <AlertCircle className="h-5 w-5 text-destructive" />
        직원 정보를 불러오지 못했습니다.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <EmployeeContent employee={query.data} />

      <Separator />

      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => setIsEditEmployeeOpen(true)}>
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

      <AttendanceListContainer employeeId={employeeId} />

      <EmployeeEditDialogContainer />
      <AttendanceDialogsBySelectedEmployee />
    </div>
  );
}
