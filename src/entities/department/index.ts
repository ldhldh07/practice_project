export type { Department, DepartmentTreeNode } from "./model/department.types";

export { departmentApi } from "./api/department.api";
export { departmentQueryKeys } from "./model/department.keys";
export { buildDepartmentTree, flattenDepartmentTree, findDescendantDepartmentIds } from "./model/department.tree";

export {
  departmentSourceAtom,
  selectedDepartmentIdAtom,
  expandedDepartmentIdsAtom,
  departmentTreeSearchAtom,
  departmentTreeAtom,
  visibleDepartmentTreeAtom,
  selectedDepartmentDescendantsAtom,
  toggleDepartmentExpandAtom,
  selectDepartmentAtom,
} from "./model/department-tree.atom";

export { DepartmentTree } from "./ui/department-tree";
