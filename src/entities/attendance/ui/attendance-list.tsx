import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";

import type { Attendance } from "../model/attendance.types";

type AttendanceListProps = {
  attendance: Attendance[];
  onSelect: (attendance: Attendance) => void;
};

const STATUS_LABEL: Record<Attendance["status"], string> = {
  present: "정상",
  late: "지각",
  absent: "결근",
  halfDay: "반차",
  vacation: "휴가",
};

export function AttendanceList({ attendance, onSelect }: Readonly<AttendanceListProps>) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>일자</TableHead>
          <TableHead>출근</TableHead>
          <TableHead>퇴근</TableHead>
          <TableHead>상태</TableHead>
          <TableHead>메모</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {attendance.map((item) => (
          <TableRow key={item.id} className="cursor-pointer" onClick={() => onSelect(item)}>
            <TableCell>{item.date}</TableCell>
            <TableCell>{item.checkIn || "-"}</TableCell>
            <TableCell>{item.checkOut || "-"}</TableCell>
            <TableCell>{STATUS_LABEL[item.status]}</TableCell>
            <TableCell>{item.note || "-"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
