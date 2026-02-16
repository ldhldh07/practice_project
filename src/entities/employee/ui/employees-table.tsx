import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table";

import type { Employee } from "../model/employee.types";

type EmployeesTableProps = {
  employees: Employee[];
  onSelect: (employee: Employee) => void;
};

const STATUS_LABEL: Record<Employee["status"], string> = {
  active: "재직",
  onLeave: "휴직",
  resigned: "퇴사",
};

export function EmployeesTable({ employees, onSelect }: Readonly<EmployeesTableProps>) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>이름</TableHead>
          <TableHead>이메일</TableHead>
          <TableHead>전화번호</TableHead>
          <TableHead>직책</TableHead>
          <TableHead>부서 ID</TableHead>
          <TableHead>입사일</TableHead>
          <TableHead>상태</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {employees.map((employee) => (
          <TableRow key={employee.id} className="cursor-pointer" onClick={() => onSelect(employee)}>
            <TableCell>{employee.name}</TableCell>
            <TableCell>{employee.email}</TableCell>
            <TableCell>{employee.phone}</TableCell>
            <TableCell>{employee.position}</TableCell>
            <TableCell>{employee.departmentId}</TableCell>
            <TableCell>{employee.hireDate}</TableCell>
            <TableCell>{STATUS_LABEL[employee.status]}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
