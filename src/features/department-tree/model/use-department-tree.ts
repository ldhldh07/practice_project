import { useQuery } from "@tanstack/react-query";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";

import {
  departmentQueryKeys,
  departmentApi,
  departmentSourceAtom,
  departmentTreeSearchAtom,
  expandedDepartmentIdsAtom,
  selectedDepartmentIdAtom,
  toggleDepartmentExpandAtom,
  visibleDepartmentTreeAtom,
} from "@/entities/department";
import { useEmployeeSearchParams } from "@/features/employee-filter";

export function useDepartmentTree() {
  const { params } = useEmployeeSearchParams();
  const setDepartmentSource = useSetAtom(departmentSourceAtom);
  const tree = useAtomValue(visibleDepartmentTreeAtom);
  const [search, setSearch] = useAtom(departmentTreeSearchAtom);
  const [selectedId, setSelectedId] = useAtom(selectedDepartmentIdAtom);
  const [expandedIds] = useAtom(expandedDepartmentIdsAtom);
  const toggleExpand = useSetAtom(toggleDepartmentExpandAtom);

  const query = useQuery({
    queryKey: departmentQueryKeys.list(),
    queryFn: () => departmentApi.getList(),
  });

  useEffect(() => {
    if (!query.data) return;
    setDepartmentSource(query.data);
  }, [query.data, setDepartmentSource]);

  useEffect(() => {
    if (!params.departmentId) return;
    setSelectedId(params.departmentId);
  }, [params.departmentId, setSelectedId]);

  return {
    tree,
    search,
    setSearch,
    selectedId,
    setSelectedId,
    expandedIds,
    toggleExpand,
  };
}
