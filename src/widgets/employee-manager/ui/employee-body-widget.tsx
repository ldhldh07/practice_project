import { useNavigate } from "react-router-dom";

import { DepartmentTreeContainer } from "@/features/department-tree";
import { EmployeeBrowsePanel } from "@/features/employee-browse";
import { EmployeeFilterContainer } from "@/features/employee-filter";
type EmployeeBodyWidgetProps = {
  toEmployeeDetailHref: (employeeId: number) => string;
};

export function EmployeeBodyWidget({ toEmployeeDetailHref }: Readonly<EmployeeBodyWidgetProps>) {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
      <aside>
        <DepartmentTreeContainer />
      </aside>
      <section>
        <EmployeeBrowsePanel
          onNavigate={(employee) => navigate(toEmployeeDetailHref(employee.id))}
          filterSlot={<EmployeeFilterContainer />}
        />
      </section>
    </div>
  );
}
