import { atom } from "jotai";

import { buildDepartmentTree, findDescendantDepartmentIds } from "./department.tree";

import type { Department } from "./department.types";

export const departmentSourceAtom = atom<Department[]>([]);
export const selectedDepartmentIdAtom = atom<number | null>(null);
export const expandedDepartmentIdsAtom = atom<Set<number>>(new Set<number>());
export const departmentTreeSearchAtom = atom("");

export const departmentTreeAtom = atom((get) => {
  const source = get(departmentSourceAtom);
  return buildDepartmentTree(source);
});

export const visibleDepartmentTreeAtom = atom((get) => {
  const tree = get(departmentTreeAtom);
  const keyword = get(departmentTreeSearchAtom).trim().toLowerCase();
  if (!keyword) return tree;

  const filterTree = (nodes: typeof tree): typeof tree => {
    return nodes
      .map((node) => ({ ...node, children: filterTree(node.children) }))
      .filter((node) => node.name.toLowerCase().includes(keyword) || node.children.length > 0);
  };

  return filterTree(tree);
});

export const selectedDepartmentDescendantsAtom = atom((get) => {
  const selectedId = get(selectedDepartmentIdAtom);
  if (!selectedId) return [] as number[];
  return findDescendantDepartmentIds(get(departmentTreeAtom), selectedId);
});

export const toggleDepartmentExpandAtom = atom(null, (get, set, id: number) => {
  const next = new Set(get(expandedDepartmentIdsAtom));
  if (next.has(id)) next.delete(id);
  else next.add(id);
  set(expandedDepartmentIdsAtom, next);
});

export const selectDepartmentAtom = atom(null, (_get, set, id: number | null) => {
  set(selectedDepartmentIdAtom, id);
});
