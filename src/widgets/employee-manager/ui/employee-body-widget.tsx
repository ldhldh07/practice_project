import { DepartmentTreeContainer } from "@/features/department-tree";
import { EmployeeBrowsePanel } from "@/features/employee-browse";
import { CardContent } from "@/shared/ui/card";

export function EmployeeBodyWidget() {
  return (
    <CardContent>
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-4 min-h-[680px]">
        <div className="border rounded-md bg-gray-50 p-2">
          <DepartmentTreeContainer />
        </div>
        <EmployeeBrowsePanel />
      </div>
    </CardContent>
  );
}
