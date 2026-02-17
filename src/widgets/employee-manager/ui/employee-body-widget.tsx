import { DepartmentTreeContainer } from "@/features/department-tree";
import { EmployeeBrowsePanel } from "@/features/employee-browse";
import { EmployeeFilterContainer } from "@/features/employee-filter";

type EmployeeBodyWidgetProps = {
  toEmployeeDetailHref: (employeeId: number) => string;
};

export function EmployeeBodyWidget({ toEmployeeDetailHref }: Readonly<EmployeeBodyWidgetProps>) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
      <aside>
        <DepartmentTreeContainer />
      </aside>
      <section>
        <EmployeeBrowsePanel toDetailHref={toEmployeeDetailHref} filterSlot={<EmployeeFilterContainer />} />
      </section>
    </div>
  );
}
