import { DepartmentTreeContainer } from "@/features/department-tree";
import { EmployeeBrowsePanel } from "@/features/employee-browse";

export function EmployeeBodyWidget() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
      <DepartmentTreeContainer />
      <EmployeeBrowsePanel />
    </div>
  );
}
