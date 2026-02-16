
import { DepartmentTree } from "@/entities/department";
import { useEmployeeSearchParams } from "@/entities/employee";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";

import { useDepartmentTree } from "../model/use-department-tree";

export function DepartmentTreeContainer() {
  const { tree, search, setSearch, selectedId, setSelectedId, expandedIds, toggleExpand } = useDepartmentTree();
  const { setParams } = useEmployeeSearchParams();

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">조직도</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Input placeholder="부서 검색" value={search} onChange={(e) => setSearch(e.target.value)} />
        <DepartmentTree
          nodes={tree}
          selectedId={selectedId}
          expandedIds={expandedIds}
          onSelect={(id) => {
            setSelectedId(id);
            setParams({ departmentId: id, skip: 0 });
          }}
          onToggle={toggleExpand}
        />
      </CardContent>
    </Card>
  );
}
