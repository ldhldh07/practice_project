import { describe, expect, it } from "vitest";

import type { Department, DepartmentTreeNode } from "../department.types";
import { buildDepartmentTree, findDescendantDepartmentIds, flattenDepartmentTree } from "../department.tree";

describe("buildDepartmentTree", () => {
  it("returns empty array when input is empty", () => {
    const result = buildDepartmentTree([]);

    expect(result).toEqual([]);
  });

  it("builds tree with single root department", () => {
    const departments: Department[] = [{ id: 1, parentId: null, name: "본부", description: "본부", headCount: 10 }];

    const result = buildDepartmentTree(departments);

    expect(result).toEqual([{ id: 1, parentId: null, name: "본부", description: "본부", headCount: 10, children: [] }]);
  });

  it("builds tree with multiple root departments", () => {
    const departments: Department[] = [
      { id: 2, parentId: null, name: "영업부", description: "영업부", headCount: 5 },
      { id: 1, parentId: null, name: "개발부", description: "개발부", headCount: 10 },
    ];

    const result = buildDepartmentTree(departments);

    expect(result).toHaveLength(2);
    expect(result[0].name).toBe("개발부"); // sorted by name
    expect(result[1].name).toBe("영업부");
  });

  it("builds nested hierarchy with parent-child-grandchild", () => {
    const departments: Department[] = [
      { id: 1, parentId: null, name: "본부", description: "본부", headCount: 10 },
      { id: 2, parentId: 1, name: "개발팀", description: "개발팀", headCount: 5 },
      { id: 3, parentId: 2, name: "프론트엔드팀", description: "프론트엔드팀", headCount: 3 },
    ];

    const result = buildDepartmentTree(departments);

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
    expect(result[0].children).toHaveLength(1);
    expect(result[0].children[0].id).toBe(2);
    expect(result[0].children[0].children).toHaveLength(1);
    expect(result[0].children[0].children[0].id).toBe(3);
    expect(result[0].children[0].children[0].children).toEqual([]);
  });

  it("sorts children by name using localeCompare", () => {
    const departments: Department[] = [
      { id: 1, parentId: null, name: "본부", description: "본부", headCount: 10 },
      { id: 3, parentId: 1, name: "인사팀", description: "인사팀", headCount: 3 },
      { id: 2, parentId: 1, name: "개발팀", description: "개발팀", headCount: 5 },
      { id: 4, parentId: 1, name: "영업팀", description: "영업팀", headCount: 4 },
    ];

    const result = buildDepartmentTree(departments);

    expect(result[0].children).toHaveLength(3);
    expect(result[0].children[0].name).toBe("개발팀");
    expect(result[0].children[1].name).toBe("영업팀");
    expect(result[0].children[2].name).toBe("인사팀");
  });

  it("handles unsorted input with mixed parentId ordering", () => {
    const departments: Department[] = [
      { id: 3, parentId: 2, name: "프론트엔드팀", description: "프론트엔드팀", headCount: 3 },
      { id: 1, parentId: null, name: "본부", description: "본부", headCount: 10 },
      { id: 2, parentId: 1, name: "개발팀", description: "개발팀", headCount: 5 },
    ];

    const result = buildDepartmentTree(departments);

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
    expect(result[0].children[0].id).toBe(2);
    expect(result[0].children[0].children[0].id).toBe(3);
  });

  it("builds complex tree with multiple branches", () => {
    const departments: Department[] = [
      { id: 1, parentId: null, name: "본부", description: "본부", headCount: 10 },
      { id: 2, parentId: 1, name: "개발팀", description: "개발팀", headCount: 5 },
      { id: 3, parentId: 1, name: "영업팀", description: "영업팀", headCount: 4 },
      { id: 4, parentId: 2, name: "프론트엔드팀", description: "프론트엔드팀", headCount: 3 },
      { id: 5, parentId: 2, name: "백엔드팀", description: "백엔드팀", headCount: 2 },
    ];

    const result = buildDepartmentTree(departments);

    expect(result).toHaveLength(1);
    expect(result[0].children).toHaveLength(2);
    expect(result[0].children[0].name).toBe("개발팀");
    expect(result[0].children[0].children).toHaveLength(2);
    expect(result[0].children[0].children[0].name).toBe("백엔드팀"); // sorted
    expect(result[0].children[0].children[1].name).toBe("프론트엔드팀");
    expect(result[0].children[1].name).toBe("영업팀");
  });
});

describe("flattenDepartmentTree", () => {
  it("returns empty array when tree is empty", () => {
    const result = flattenDepartmentTree([]);

    expect(result).toEqual([]);
  });

  it("returns single node when tree has one node", () => {
    const tree: DepartmentTreeNode[] = [
      { id: 1, parentId: null, name: "본부", description: "본부", headCount: 10, children: [] },
    ];

    const result = flattenDepartmentTree(tree);

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
  });

  it("flattens nested tree in depth-first order", () => {
    const tree: DepartmentTreeNode[] = [
      {
        id: 1,
        parentId: null,
        name: "본부",
        description: "본부",
        headCount: 10,
        children: [
          {
            id: 2,
            parentId: 1,
            name: "개발팀",
            description: "개발팀",
            headCount: 5,
            children: [
              { id: 3, parentId: 2, name: "프론트엔드팀", description: "프론트엔드팀", headCount: 3, children: [] },
            ],
          },
        ],
      },
    ];

    const result = flattenDepartmentTree(tree);

    expect(result).toHaveLength(3);
    expect(result[0].id).toBe(1); // root first
    expect(result[1].id).toBe(2); // then child
    expect(result[2].id).toBe(3); // then grandchild
  });

  it("flattens tree with multiple branches in depth-first order", () => {
    const tree: DepartmentTreeNode[] = [
      {
        id: 1,
        parentId: null,
        name: "본부",
        description: "본부",
        headCount: 10,
        children: [
          {
            id: 2,
            parentId: 1,
            name: "개발팀",
            description: "개발팀",
            headCount: 5,
            children: [
              { id: 4, parentId: 2, name: "프론트엔드팀", description: "프론트엔드팀", headCount: 3, children: [] },
            ],
          },
          {
            id: 3,
            parentId: 1,
            name: "영업팀",
            description: "영업팀",
            headCount: 4,
            children: [],
          },
        ],
      },
    ];

    const result = flattenDepartmentTree(tree);

    expect(result).toHaveLength(4);
    expect(result[0].id).toBe(1); // root
    expect(result[1].id).toBe(2); // first child
    expect(result[2].id).toBe(4); // first child's child
    expect(result[3].id).toBe(3); // second child
  });

  it("flattens multiple root trees", () => {
    const tree: DepartmentTreeNode[] = [
      {
        id: 1,
        parentId: null,
        name: "개발부",
        description: "개발부",
        headCount: 10,
        children: [{ id: 2, parentId: 1, name: "개발팀", description: "개발팀", headCount: 5, children: [] }],
      },
      {
        id: 3,
        parentId: null,
        name: "영업부",
        description: "영업부",
        headCount: 8,
        children: [],
      },
    ];

    const result = flattenDepartmentTree(tree);

    expect(result).toHaveLength(3);
    expect(result[0].id).toBe(1);
    expect(result[1].id).toBe(2);
    expect(result[2].id).toBe(3);
  });
});

describe("findDescendantDepartmentIds", () => {
  it("returns empty array when target is not found", () => {
    const tree: DepartmentTreeNode[] = [
      { id: 1, parentId: null, name: "본부", description: "본부", headCount: 10, children: [] },
    ];

    const result = findDescendantDepartmentIds(tree, 999);

    expect(result).toEqual([]);
  });

  it("returns only target id when target is leaf node", () => {
    const tree: DepartmentTreeNode[] = [
      {
        id: 1,
        parentId: null,
        name: "본부",
        description: "본부",
        headCount: 10,
        children: [{ id: 2, parentId: 1, name: "개발팀", description: "개발팀", headCount: 5, children: [] }],
      },
    ];

    const result = findDescendantDepartmentIds(tree, 2);

    expect(result).toEqual([2]);
  });

  it("returns target and all child ids when target has children", () => {
    const tree: DepartmentTreeNode[] = [
      {
        id: 1,
        parentId: null,
        name: "본부",
        description: "본부",
        headCount: 10,
        children: [
          {
            id: 2,
            parentId: 1,
            name: "개발팀",
            description: "개발팀",
            headCount: 5,
            children: [
              { id: 3, parentId: 2, name: "프론트엔드팀", description: "프론트엔드팀", headCount: 3, children: [] },
            ],
          },
        ],
      },
    ];

    const result = findDescendantDepartmentIds(tree, 2);

    expect(result).toEqual([2, 3]);
  });

  it("returns target and all descendants in deep nesting", () => {
    const tree: DepartmentTreeNode[] = [
      {
        id: 1,
        parentId: null,
        name: "본부",
        description: "본부",
        headCount: 10,
        children: [
          {
            id: 2,
            parentId: 1,
            name: "개발팀",
            description: "개발팀",
            headCount: 5,
            children: [
              {
                id: 3,
                parentId: 2,
                name: "프론트엔드팀",
                description: "프론트엔드팀",
                headCount: 3,
                children: [
                  {
                    id: 4,
                    parentId: 3,
                    name: "UI팀",
                    description: "UI팀",
                    headCount: 2,
                    children: [],
                  },
                ],
              },
            ],
          },
        ],
      },
    ];

    const result = findDescendantDepartmentIds(tree, 1);

    expect(result).toEqual([1, 2, 3, 4]);
  });

  it("returns target and all descendants with multiple branches", () => {
    const tree: DepartmentTreeNode[] = [
      {
        id: 1,
        parentId: null,
        name: "본부",
        description: "본부",
        headCount: 10,
        children: [
          {
            id: 2,
            parentId: 1,
            name: "개발팀",
            description: "개발팀",
            headCount: 5,
            children: [
              { id: 4, parentId: 2, name: "프론트엔드팀", description: "프론트엔드팀", headCount: 3, children: [] },
              { id: 5, parentId: 2, name: "백엔드팀", description: "백엔드팀", headCount: 2, children: [] },
            ],
          },
          {
            id: 3,
            parentId: 1,
            name: "영업팀",
            description: "영업팀",
            headCount: 4,
            children: [],
          },
        ],
      },
    ];

    const result = findDescendantDepartmentIds(tree, 2);

    expect(result).toEqual([2, 4, 5]);
  });

  it("returns empty array when tree is empty", () => {
    const result = findDescendantDepartmentIds([], 1);

    expect(result).toEqual([]);
  });

  it("finds target in second root tree", () => {
    const tree: DepartmentTreeNode[] = [
      {
        id: 1,
        parentId: null,
        name: "개발부",
        description: "개발부",
        headCount: 10,
        children: [],
      },
      {
        id: 2,
        parentId: null,
        name: "영업부",
        description: "영업부",
        headCount: 8,
        children: [{ id: 3, parentId: 2, name: "영업팀", description: "영업팀", headCount: 5, children: [] }],
      },
    ];

    const result = findDescendantDepartmentIds(tree, 2);

    expect(result).toEqual([2, 3]);
  });
});
