import type { Department, DepartmentTreeNode } from "./department.types";

export function buildDepartmentTree(items: Department[]): DepartmentTreeNode[] {
  const byParent = new Map<number | null, Department[]>();

  items.forEach((item) => {
    const group = byParent.get(item.parentId) ?? [];
    group.push(item);
    byParent.set(item.parentId, group);
  });

  const walk = (parentId: number | null): DepartmentTreeNode[] => {
    const children = byParent.get(parentId) ?? [];
    return children
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((child) => ({
        ...child,
        children: walk(child.id),
      }));
  };

  return walk(null);
}

export function flattenDepartmentTree(tree: DepartmentTreeNode[]): DepartmentTreeNode[] {
  return tree.flatMap((node) => [node, ...flattenDepartmentTree(node.children)]);
}

export function findDescendantDepartmentIds(tree: DepartmentTreeNode[], targetId: number): number[] {
  const stack = [...tree];

  while (stack.length > 0) {
    const node = stack.pop();
    if (!node) continue;

    if (node.id === targetId) {
      return flattenDepartmentTree([node]).map((item) => item.id);
    }

    stack.push(...node.children);
  }

  return [];
}
