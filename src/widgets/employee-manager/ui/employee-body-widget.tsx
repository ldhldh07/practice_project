import { useAtomValue } from "jotai";


import { selectedDepartmentDescendantsAtom } from "@/entities/department";
import { useEmployeeSearchParams } from "@/entities/employee";
import { DepartmentTreeContainer } from "@/features/department-tree";
import { EmployeeFilterContainer } from "@/features/employee-filter";
import { useEmployeesQuery } from "@/features/employee-load";
import { CardContent } from "@/shared/ui/card";
import { Pagination } from "@/shared/ui/pagination";

import { EmployeeTableContainer } from "./employee-table-container";

export function EmployeeBodyWidget() {
  const { params, setParams } = useEmployeeSearchParams();
  const selectedDescendants = useAtomValue(selectedDepartmentDescendantsAtom);
  const departmentIds = selectedDescendants.length > 0 ? selectedDescendants.join(",") : undefined;

  const { data } = useEmployeesQuery({
    limit: params.limit,
    skip: params.skip,
    search: params.search,
    departmentIds,
    status: params.status,
    sortBy: params.sortBy,
    order: params.order,
  });

  return (
    <CardContent>
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-4 min-h-[680px]">
        <div className="border rounded-md bg-gray-50 p-2">
          <DepartmentTreeContainer />
        </div>

        <div className="space-y-4 border rounded-md bg-white p-4">
          <EmployeeFilterContainer />
          <EmployeeTableContainer />
          <Pagination
            total={data?.total ?? 0}
            skip={params.skip}
            limit={params.limit}
            onChangeLimit={(value) => setParams({ limit: Number(value), skip: 0 })}
            onPrev={() => setParams({ skip: Math.max(0, params.skip - params.limit) })}
            onNext={() => setParams({ skip: params.skip + params.limit })}
          />
        </div>
      </div>
    </CardContent>
  );
}
