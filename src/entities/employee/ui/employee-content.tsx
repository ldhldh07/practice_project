import type { Employee } from "../model/employee.types";

type EmployeeContentProps = {
  employee: Employee | null;
};

const STATUS_LABEL: Record<Employee["status"], string> = {
  active: "재직",
  onLeave: "휴직",
  resigned: "퇴사",
};

export function EmployeeContent({ employee }: Readonly<EmployeeContentProps>) {
  if (!employee) {
    return <div className="text-sm text-gray-500">선택된 직원이 없습니다.</div>;
  }

  return (
    <div className="grid grid-cols-2 gap-3 text-sm">
      <div>
        <span className="font-semibold">이름:</span> {employee.name}
      </div>
      <div>
        <span className="font-semibold">이메일:</span> {employee.email}
      </div>
      <div>
        <span className="font-semibold">전화번호:</span> {employee.phone}
      </div>
      <div>
        <span className="font-semibold">직책:</span> {employee.position}
      </div>
      <div>
        <span className="font-semibold">부서 ID:</span> {employee.departmentId}
      </div>
      <div>
        <span className="font-semibold">입사일:</span> {employee.hireDate}
      </div>
      <div>
        <span className="font-semibold">상태:</span> {STATUS_LABEL[employee.status]}
      </div>
    </div>
  );
}
