import { Search } from "lucide-react";

import { DepartmentTree } from "@/entities/department";
import { useEmployeeSearchParams } from "@/features/employee-filter";
import { Input } from "@/shared/ui/input";

import { useDepartmentTree } from "../model/use-department-tree";

export function DepartmentTreeContainer() {
  const { tree, search, setSearch, selectedId, setSelectedId, expandedIds, toggleExpand } = useDepartmentTree();
  const { setParams } = useEmployeeSearchParams();

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-tight">조직도</h3>
      </div>
      <div className="relative">
        <Search
          aria-hidden="true"
          className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          aria-label="부서 검색"
          placeholder="부서 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-8 pl-8 text-xs"
        />
      </div>
      <div className="flex-1 overflow-auto">
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
      </div>
    </div>
  );
}
