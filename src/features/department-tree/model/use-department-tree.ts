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

function useDepartmentTreeSourceSync() {
  const setDepartmentSource = useSetAtom(departmentSourceAtom);

  const query = useQuery({
    queryKey: departmentQueryKeys.list(),
    queryFn: () => departmentApi.getList(),
  });

  useEffect(() => {
    if (!query.data) return;
    setDepartmentSource(query.data);
  }, [query.data, setDepartmentSource]);
}

function useDepartmentTreeUrlSync(departmentId: number | undefined, setSelectedId: (id: number | null) => void) {
  useEffect(() => {
    if (!departmentId) return;
    setSelectedId(departmentId);
  }, [departmentId, setSelectedId]);
}

function useDepartmentTreeState() {
  const tree = useAtomValue(visibleDepartmentTreeAtom);
  const [search, setSearch] = useAtom(departmentTreeSearchAtom);
  const [selectedId, setSelectedId] = useAtom(selectedDepartmentIdAtom);
  const expandedIds = useAtomValue(expandedDepartmentIdsAtom);
  const toggleExpand = useSetAtom(toggleDepartmentExpandAtom);

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

export function useDepartmentTree() {
  const { params } = useEmployeeSearchParams();
  const state = useDepartmentTreeState();

  useDepartmentTreeSourceSync();
  useDepartmentTreeUrlSync(params.departmentId, state.setSelectedId);

  return state;
}
