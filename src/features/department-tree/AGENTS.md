# Department Tree Feature Rules

## Scope

- This slice owns the department tree user scenario.
- Keep orchestration here, keep entity UI primitive.

## Hook Boundary Rules

- `useDepartmentTree` can orchestrate one scenario end-to-end.
- Split when the following become independently reusable:
  - department fetch + source atom hydration
  - URL department param sync
  - tree interaction handlers (select/expand/search)

## Recommended Split Targets (When Needed)

- `useDepartmentTreeSourceSync`: query + source atom hydration.
- `useDepartmentTreeUrlSync`: URL param to selected department sync.
- `useDepartmentTreeState`: search/selection/expand atom bindings.

## Must Keep

- UI rendering concerns in `ui/department-tree-container.tsx`.
- Business orchestration in `model/*`.

## Must Avoid

- Duplicating URL sync logic in widget/page layer.
- Moving query/mutation logic back into entities.
