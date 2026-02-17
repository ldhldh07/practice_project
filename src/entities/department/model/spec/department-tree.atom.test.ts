import { createStore } from "jotai";
import { describe, expect, it } from "vitest";

import type { Department } from "../department.types";
import {
  departmentSourceAtom,
  departmentTreeAtom,
  departmentTreeSearchAtom,
  expandedDepartmentIdsAtom,
  selectDepartmentAtom,
  selectedDepartmentDescendantsAtom,
  selectedDepartmentIdAtom,
  toggleDepartmentExpandAtom,
  visibleDepartmentTreeAtom,
} from "../department-tree.atom";

describe("department-tree.atom integration", () => {
  const mockDepartments: Department[] = [
    { id: 1, parentId: null, name: "본사", description: "본사", headCount: 10 },
    { id: 2, parentId: 1, name: "개발팀", description: "개발팀", headCount: 5 },
    { id: 3, parentId: 1, name: "디자인팀", description: "디자인팀", headCount: 3 },
    { id: 4, parentId: 2, name: "프론트엔드팀", description: "프론트엔드팀", headCount: 2 },
    { id: 5, parentId: 2, name: "백엔드팀", description: "백엔드팀", headCount: 3 },
  ];

  describe("A. departmentTreeAtom (source → derived)", () => {
    it("derives tree structure from flat source data", () => {
      const store = createStore();
      store.set(departmentSourceAtom, mockDepartments);

      const tree = store.get(departmentTreeAtom);

      expect(tree).toHaveLength(1);
      expect(tree[0].id).toBe(1);
      expect(tree[0].children).toHaveLength(2);
      expect(tree[0].children[0].name).toBe("개발팀");
      expect(tree[0].children[0].children).toHaveLength(2);
    });

    it("returns empty tree when source is empty", () => {
      const store = createStore();
      store.set(departmentSourceAtom, []);

      const tree = store.get(departmentTreeAtom);

      expect(tree).toEqual([]);
    });

    it("updates tree when source changes", () => {
      const store = createStore();
      store.set(departmentSourceAtom, mockDepartments);

      const initialTree = store.get(departmentTreeAtom);
      expect(initialTree).toHaveLength(1);

      const updatedDepartments = [
        { id: 1, parentId: null, name: "본사", description: "본사", headCount: 10 },
        { id: 6, parentId: null, name: "지사", description: "지사", headCount: 5 },
      ];
      store.set(departmentSourceAtom, updatedDepartments);

      const updatedTree = store.get(departmentTreeAtom);
      expect(updatedTree).toHaveLength(2);
      expect(updatedTree[0].name).toBe("본사");
      expect(updatedTree[1].name).toBe("지사");
    });
  });

  describe("B. visibleDepartmentTreeAtom (source + search → filtered)", () => {
    it("returns full tree when search is empty", () => {
      const store = createStore();
      store.set(departmentSourceAtom, mockDepartments);
      store.set(departmentTreeSearchAtom, "");

      const visible = store.get(visibleDepartmentTreeAtom);

      expect(visible).toHaveLength(1);
      expect(visible[0].children).toHaveLength(2);
    });

    it("filters tree by matching keyword", () => {
      const store = createStore();
      store.set(departmentSourceAtom, mockDepartments);
      store.set(departmentTreeSearchAtom, "프론트");

      const visible = store.get(visibleDepartmentTreeAtom);

      expect(visible).toHaveLength(1);
      expect(visible[0].name).toBe("본사");
      expect(visible[0].children).toHaveLength(1);
      expect(visible[0].children[0].name).toBe("개발팀");
      expect(visible[0].children[0].children).toHaveLength(1);
      expect(visible[0].children[0].children[0].name).toBe("프론트엔드팀");
    });

    it("includes parent nodes when children match", () => {
      const store = createStore();
      store.set(departmentSourceAtom, mockDepartments);
      store.set(departmentTreeSearchAtom, "백엔드");

      const visible = store.get(visibleDepartmentTreeAtom);

      expect(visible).toHaveLength(1);
      expect(visible[0].name).toBe("본사");
      expect(visible[0].children).toHaveLength(1);
      expect(visible[0].children[0].name).toBe("개발팀");
      expect(visible[0].children[0].children).toHaveLength(1);
      expect(visible[0].children[0].children[0].name).toBe("백엔드팀");
    });

    it("performs case insensitive search", () => {
      const store = createStore();
      store.set(departmentSourceAtom, mockDepartments);
      store.set(departmentTreeSearchAtom, "개발");

      const visible1 = store.get(visibleDepartmentTreeAtom);

      store.set(departmentTreeSearchAtom, "개발");

      const visible2 = store.get(visibleDepartmentTreeAtom);

      expect(visible1).toEqual(visible2);
    });

    it("returns empty tree when no match found", () => {
      const store = createStore();
      store.set(departmentSourceAtom, mockDepartments);
      store.set(departmentTreeSearchAtom, "존재하지않는부서");

      const visible = store.get(visibleDepartmentTreeAtom);

      expect(visible).toEqual([]);
    });

    it("trims whitespace from search keyword", () => {
      const store = createStore();
      store.set(departmentSourceAtom, mockDepartments);
      store.set(departmentTreeSearchAtom, "  개발팀  ");

      const visible = store.get(visibleDepartmentTreeAtom);

      expect(visible).toHaveLength(1);
      expect(visible[0].children).toHaveLength(1);
      expect(visible[0].children[0].name).toBe("개발팀");
    });
  });

  describe("C. selectedDepartmentDescendantsAtom (source + selected → descendants)", () => {
    it("returns empty array when no selection", () => {
      const store = createStore();
      store.set(departmentSourceAtom, mockDepartments);
      store.set(selectedDepartmentIdAtom, null);

      const descendants = store.get(selectedDepartmentDescendantsAtom);

      expect(descendants).toEqual([]);
    });

    it("returns only selected id for leaf node", () => {
      const store = createStore();
      store.set(departmentSourceAtom, mockDepartments);
      store.set(selectedDepartmentIdAtom, 4);

      const descendants = store.get(selectedDepartmentDescendantsAtom);

      expect(descendants).toEqual([4]);
    });

    it("returns selected id and all child ids for parent node", () => {
      const store = createStore();
      store.set(departmentSourceAtom, mockDepartments);
      store.set(selectedDepartmentIdAtom, 2);

      const descendants = store.get(selectedDepartmentDescendantsAtom);

      expect(descendants).toHaveLength(3);
      expect(descendants).toContain(2);
      expect(descendants).toContain(4);
      expect(descendants).toContain(5);
    });

    it("returns all descendants for root node", () => {
      const store = createStore();
      store.set(departmentSourceAtom, mockDepartments);
      store.set(selectedDepartmentIdAtom, 1);

      const descendants = store.get(selectedDepartmentDescendantsAtom);

      expect(descendants).toHaveLength(5);
      expect(descendants).toContain(1);
      expect(descendants).toContain(2);
      expect(descendants).toContain(3);
      expect(descendants).toContain(4);
      expect(descendants).toContain(5);
    });

    it("returns empty array when selected id not found", () => {
      const store = createStore();
      store.set(departmentSourceAtom, mockDepartments);
      store.set(selectedDepartmentIdAtom, 999);

      const descendants = store.get(selectedDepartmentDescendantsAtom);

      expect(descendants).toEqual([]);
    });
  });

  describe("D. toggleDepartmentExpandAtom (action atom)", () => {
    it("adds id to expanded set when not expanded", () => {
      const store = createStore();
      store.set(expandedDepartmentIdsAtom, new Set<number>());

      store.set(toggleDepartmentExpandAtom, 1);

      const expanded = store.get(expandedDepartmentIdsAtom);
      expect(expanded.has(1)).toBe(true);
    });

    it("removes id from expanded set when already expanded", () => {
      const store = createStore();
      store.set(expandedDepartmentIdsAtom, new Set([1, 2]));

      store.set(toggleDepartmentExpandAtom, 1);

      const expanded = store.get(expandedDepartmentIdsAtom);
      expect(expanded.has(1)).toBe(false);
      expect(expanded.has(2)).toBe(true);
    });

    it("handles multiple toggles correctly", () => {
      const store = createStore();
      store.set(expandedDepartmentIdsAtom, new Set<number>());

      store.set(toggleDepartmentExpandAtom, 1);
      store.set(toggleDepartmentExpandAtom, 2);
      store.set(toggleDepartmentExpandAtom, 1);

      const expanded = store.get(expandedDepartmentIdsAtom);
      expect(expanded.has(1)).toBe(false);
      expect(expanded.has(2)).toBe(true);
    });

    it("maintains immutability by creating new Set", () => {
      const store = createStore();
      const initialSet = new Set([1]);
      store.set(expandedDepartmentIdsAtom, initialSet);

      store.set(toggleDepartmentExpandAtom, 2);

      const updatedSet = store.get(expandedDepartmentIdsAtom);
      expect(updatedSet).not.toBe(initialSet);
      expect(initialSet.has(2)).toBe(false);
      expect(updatedSet.has(2)).toBe(true);
    });
  });

  describe("E. selectDepartmentAtom (action atom)", () => {
    it("sets selected department id", () => {
      const store = createStore();
      store.set(selectedDepartmentIdAtom, null);

      store.set(selectDepartmentAtom, 5);

      const selected = store.get(selectedDepartmentIdAtom);
      expect(selected).toBe(5);
    });

    it("clears selection when set to null", () => {
      const store = createStore();
      store.set(selectedDepartmentIdAtom, 5);

      store.set(selectDepartmentAtom, null);

      const selected = store.get(selectedDepartmentIdAtom);
      expect(selected).toBeNull();
    });

    it("overwrites previous selection", () => {
      const store = createStore();
      store.set(selectedDepartmentIdAtom, 1);

      store.set(selectDepartmentAtom, 2);

      const selected = store.get(selectedDepartmentIdAtom);
      expect(selected).toBe(2);
    });
  });

  describe("F. Cross-atom chain (full integration)", () => {
    it("maintains consistency across source → selection → descendants chain", () => {
      const store = createStore();

      store.set(departmentSourceAtom, mockDepartments);
      store.set(selectDepartmentAtom, 2);

      const tree = store.get(departmentTreeAtom);
      const selected = store.get(selectedDepartmentIdAtom);
      const descendants = store.get(selectedDepartmentDescendantsAtom);

      expect(tree).toHaveLength(1);
      expect(selected).toBe(2);
      expect(descendants).toHaveLength(3);
      expect(descendants).toContain(2);
      expect(descendants).toContain(4);
      expect(descendants).toContain(5);
    });

    it("auto-updates derived values when source changes", () => {
      const store = createStore();
      store.set(departmentSourceAtom, mockDepartments);
      store.set(selectDepartmentAtom, 2);

      const initialDescendants = store.get(selectedDepartmentDescendantsAtom);
      expect(initialDescendants).toHaveLength(3);

      const updatedDepartments = mockDepartments.filter((d) => d.id !== 4);
      store.set(departmentSourceAtom, updatedDepartments);

      const updatedDescendants = store.get(selectedDepartmentDescendantsAtom);
      expect(updatedDescendants).toHaveLength(2);
      expect(updatedDescendants).toEqual([2, 5]);
    });

    it("maintains search filter consistency with tree updates", () => {
      const store = createStore();
      store.set(departmentSourceAtom, mockDepartments);
      store.set(departmentTreeSearchAtom, "개발");

      const initialVisible = store.get(visibleDepartmentTreeAtom);
      expect(initialVisible[0].children).toHaveLength(1);

      const updatedDepartments = [
        ...mockDepartments,
        { id: 6, parentId: 1, name: "개발지원팀", description: "개발지원팀", headCount: 2 },
      ];
      store.set(departmentSourceAtom, updatedDepartments);

      const updatedVisible = store.get(visibleDepartmentTreeAtom);
      expect(updatedVisible[0].children).toHaveLength(2);
    });

    it("handles complex scenario: expand → select → search → descendants", () => {
      const store = createStore();

      store.set(departmentSourceAtom, mockDepartments);
      store.set(toggleDepartmentExpandAtom, 1);
      store.set(toggleDepartmentExpandAtom, 2);
      store.set(selectDepartmentAtom, 2);
      store.set(departmentTreeSearchAtom, "팀");

      const expanded = store.get(expandedDepartmentIdsAtom);
      const selected = store.get(selectedDepartmentIdAtom);
      const visible = store.get(visibleDepartmentTreeAtom);
      const descendants = store.get(selectedDepartmentDescendantsAtom);

      expect(expanded.has(1)).toBe(true);
      expect(expanded.has(2)).toBe(true);
      expect(selected).toBe(2);
      expect(visible).toHaveLength(1);
      expect(descendants).toHaveLength(3);
      expect(descendants).toContain(2);
      expect(descendants).toContain(4);
      expect(descendants).toContain(5);
    });

    it("clears descendants when selection is cleared", () => {
      const store = createStore();
      store.set(departmentSourceAtom, mockDepartments);
      store.set(selectDepartmentAtom, 2);

      const initialDescendants = store.get(selectedDepartmentDescendantsAtom);
      expect(initialDescendants).toHaveLength(3);

      store.set(selectDepartmentAtom, null);

      const clearedDescendants = store.get(selectedDepartmentDescendantsAtom);
      expect(clearedDescendants).toEqual([]);
    });

    it("handles empty source with all atoms", () => {
      const store = createStore();
      store.set(departmentSourceAtom, []);
      store.set(selectDepartmentAtom, 1);
      store.set(departmentTreeSearchAtom, "test");
      store.set(toggleDepartmentExpandAtom, 1);

      const tree = store.get(departmentTreeAtom);
      const visible = store.get(visibleDepartmentTreeAtom);
      const descendants = store.get(selectedDepartmentDescendantsAtom);

      expect(tree).toEqual([]);
      expect(visible).toEqual([]);
      expect(descendants).toEqual([]);
    });
  });
});
