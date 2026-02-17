import { Badge } from "@/shared/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";

import type { Employee } from "../model/employee.types";

type EmployeesTableProps = {
  employees: Employee[];
  onSelect: (employee: Employee) => void;
};

const STATUS_CONFIG: Record<Employee["status"], { label: string; variant: "success" | "warning" | "destructive" }> = {
  active: { label: "재직", variant: "success" },
  onLeave: { label: "휴직", variant: "warning" },
  resigned: { label: "퇴사", variant: "destructive" },
};

export function EmployeesTable({ employees, onSelect }: Readonly<EmployeesTableProps>) {
  if (employees.length === 0) {
    return (
      <p
        role="status"
        className="flex h-32 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground"
      >
        조건에 맞는 직원이 없습니다
      </p>
    );
  }

  return (
    <Table aria-label="직원 목록">
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead scope="col">이름</TableHead>
          <TableHead scope="col">이메일</TableHead>
          <TableHead scope="col">전화번호</TableHead>
          <TableHead scope="col">직책</TableHead>
          <TableHead scope="col">입사일</TableHead>
          <TableHead scope="col">상태</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {employees.map((employee) => {
          const status = STATUS_CONFIG[employee.status];
          return (
            <TableRow
              key={employee.id}
              role="row"
              tabIndex={0}
              aria-label={`${employee.name} 상세 보기`}
              className="cursor-pointer"
              onClick={() => onSelect(employee)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(employee);
                }
              }}
            >
              <TableCell className="font-medium">{employee.name}</TableCell>
              <TableCell className="text-muted-foreground">{employee.email}</TableCell>
              <TableCell className="text-muted-foreground">{employee.phone}</TableCell>
              <TableCell>{employee.position}</TableCell>
              <TableCell className="text-muted-foreground">{employee.hireDate}</TableCell>
              <TableCell>
                <Badge variant={status.variant}>{status.label}</Badge>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
