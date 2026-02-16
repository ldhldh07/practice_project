import { Badge } from "@/shared/ui/badge";

import type { Employee } from "../model/employee.types";

type EmployeeContentProps = {
  employee: Employee | null;
};

const STATUS_CONFIG: Record<Employee["status"], { label: string; variant: "success" | "warning" | "destructive" }> = {
  active: { label: "재직", variant: "success" },
  onLeave: { label: "휴직", variant: "warning" },
  resigned: { label: "퇴사", variant: "destructive" },
};

function InfoItem({ label, value }: Readonly<{ label: string; value: string | number }>) {
  return (
    <div className="space-y-1">
      <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="text-sm">{value}</dd>
    </div>
  );
}

export function EmployeeContent({ employee }: Readonly<EmployeeContentProps>) {
  if (!employee) {
    return (
      <div className="flex h-24 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
        선택된 직원이 없습니다
      </div>
    );
  }

  const status = STATUS_CONFIG[employee.status];

  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
      <InfoItem label="이름" value={employee.name} />
      <InfoItem label="이메일" value={employee.email} />
      <InfoItem label="전화번호" value={employee.phone} />
      <InfoItem label="직책" value={employee.position} />
      <InfoItem label="부서 ID" value={employee.departmentId} />
      <InfoItem label="입사일" value={employee.hireDate} />
      <div className="space-y-1">
        <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">상태</dt>
        <dd>
          <Badge variant={status.variant}>{status.label}</Badge>
        </dd>
      </div>
    </dl>
  );
}
