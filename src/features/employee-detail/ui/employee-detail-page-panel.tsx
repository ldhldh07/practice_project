import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { useSelectedAttendance, useSetAddAttendanceDialog, useSetEditAttendanceDialog } from "@/entities/attendance";
import {
  EmployeeContent,
  employeeApi,
  employeeQueryKeys,
  useSelectedEmployee,
  useSetEditEmployeeDialog,
} from "@/entities/employee";
import { AttendanceDialogsBySelectedEmployee, AttendanceListContainer } from "@/features/attendance-edit";
import { EmployeeEditDialogContainer } from "@/features/employee-edit";
import { Button } from "@/shared/ui/button";

type EmployeeDetailPagePanelProps = {
  employeeId: number;
};

export function EmployeeDetailPagePanel({ employeeId }: Readonly<EmployeeDetailPagePanelProps>) {
  const [, setSelectedEmployee] = useSelectedEmployee();
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
    return <div className="text-sm text-gray-500">유효하지 않은 직원 ID입니다.</div>;
  }

  if (query.isLoading) {
    return <div className="text-sm text-gray-500">직원 정보를 불러오는 중입니다.</div>;
  }

  if (query.isError || !query.data) {
    return <div className="text-sm text-red-500">직원 정보를 불러오지 못했습니다.</div>;
  }

  return (
    <div className="space-y-4">
      <EmployeeContent employee={query.data} />

      <div className="flex gap-2">
        <Button variant="outline" onClick={() => setIsEditEmployeeOpen(true)}>
          직원 정보 수정
        </Button>
        <Button variant="outline" onClick={() => setIsAddAttendanceOpen(true)}>
          근태 추가
        </Button>
        <Button variant="outline" disabled={!selectedAttendance} onClick={() => setIsEditAttendanceOpen(true)}>
          선택 근태 수정
        </Button>
      </div>

      <AttendanceListContainer employeeId={employeeId} />

      <EmployeeEditDialogContainer />
      <AttendanceDialogsBySelectedEmployee />
    </div>
  );
}
