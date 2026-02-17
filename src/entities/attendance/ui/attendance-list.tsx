import { Badge } from "@/shared/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";

import type { Attendance } from "../model/attendance.types";

type AttendanceListProps = {
  attendance: Attendance[];
  onSelect: (attendance: Attendance) => void;
};

const STATUS_CONFIG: Record<
  Attendance["status"],
  { label: string; variant: "success" | "warning" | "destructive" | "info" | "purple" }
> = {
  present: { label: "정상", variant: "success" },
  late: { label: "지각", variant: "warning" },
  absent: { label: "결근", variant: "destructive" },
  halfDay: { label: "반차", variant: "info" },
  vacation: { label: "휴가", variant: "purple" },
};

export function AttendanceList({ attendance, onSelect }: Readonly<AttendanceListProps>) {
  if (attendance.length === 0) {
    return (
      <p
        role="status"
        className="flex h-24 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground"
      >
        근태 기록이 없습니다
      </p>
    );
  }

  return (
    <Table aria-label="근태 기록">
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead scope="col">일자</TableHead>
          <TableHead scope="col">출근</TableHead>
          <TableHead scope="col">퇴근</TableHead>
          <TableHead scope="col">상태</TableHead>
          <TableHead scope="col">메모</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {attendance.map((item) => {
          const status = STATUS_CONFIG[item.status];
          return (
            <TableRow
              key={item.id}
              role="row"
              tabIndex={0}
              aria-label={`${item.date} 근태 상세`}
              className="cursor-pointer"
              onClick={() => onSelect(item)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(item);
                }
              }}
            >
              <TableCell className="font-medium">{item.date}</TableCell>
              <TableCell className="text-muted-foreground">{item.checkIn || "-"}</TableCell>
              <TableCell className="text-muted-foreground">{item.checkOut || "-"}</TableCell>
              <TableCell>
                <Badge variant={status.variant}>{status.label}</Badge>
              </TableCell>
              <TableCell className="max-w-48 truncate text-muted-foreground">{item.note || "-"}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
