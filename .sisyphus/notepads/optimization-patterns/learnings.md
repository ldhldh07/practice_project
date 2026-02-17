# Learnings

## Project Conventions

- FSD architecture: pages -> widgets -> features -> entities -> shared
- Entity hooks wrap Jotai atoms (useAtom/useSetAtom/useAtomValue)
- Query key factory in `employee.keys.ts`, queryOptions in `employee-load.query.ts`
- Container-presenter pattern: containers in features/ui, presenters in entities/ui
- URL params owned by page layer, injected via props/callbacks to features
- Optimistic updates already implemented in mutation hooks
- Routes already lazy-loaded via React.lazy in router.tsx
- README tone: Korean, first-person reflective, code-heavy with explanations

## Bundle Optimization: Manual Chunks Strategy

### Problem

- Initial build: `index-*.js` was 502.36 kB, triggering Vite's chunk size warning
- Single monolithic vendor bundle prevented effective code splitting

### Solution Applied

Implemented `build.rollupOptions.output.manualChunks` in `vite.config.ts` with 8 vendor groups:

1. **vendor-react** (183 kB): React + React DOM core
2. **vendor-query** (2.66 kB): TanStack Query
3. **vendor-form** (25.90 kB): React Hook Form + @hookform/resolvers
4. **vendor-jotai** (7.04 kB): Jotai state management
5. **vendor-router** (0 kB): React Router DOM (empty, tree-shaken)
6. **vendor-zod** (50.64 kB): Zod validation
7. **vendor-icons** (6.93 kB): Lucide React icons
8. **vendor** (220.20 kB): Catch-all for remaining node_modules

### Results

- ✅ No chunk exceeds 500 kB (largest: vendor 220.20 kB)
- ✅ Build warning eliminated
- ✅ Lazy routes still function (React.lazy already in place)
- ✅ Total gzip: ~161 kB → distributed across chunks

### Key Insight

Splitting by library/concern (not arbitrary size thresholds) enables:

- Parallel loading of independent vendor chunks
- Better cache invalidation (only changed vendor chunks bust)
- Clearer dependency visualization in DevTools
- Easier to identify which vendor is bloating the bundle

### Implementation Detail

Used `id.includes("node_modules/...")` pattern for stable, predictable chunk assignment. Order matters: check specific libraries first, then catch-all.

## TanStack Query Optimizations

### A. Pagination Flicker Prevention with `placeholderData`

#### Problem

When users change pagination (skip/limit), the UI flickers as query data clears while fetching new pages.

#### Solution Applied

Added `placeholderData: keepPreviousData` to `useEmployeesQuery`:

```ts
// src/features/employee-load/model/employees.query.ts
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export function useEmployeesQuery(params: EmployeesParams) {
  return useQuery({
    ...buildEmployeesQuery(params),
    placeholderData: keepPreviousData,
  });
}
```

#### Results

- ✅ Previous employee list stays visible while fetching next page
- ✅ Smooth pagination UX without loading spinners/empty states
- ✅ `isPlaceholderData` flag available for future UI enhancements

#### Key Insight (TanStack Query v5 Migration)

- **v4**: Used `keepPreviousData: true` option + `isPreviousData` flag
- **v5**: Replaced with `placeholderData: keepPreviousData` function + `isPlaceholderData` flag
- The `keepPreviousData` function is imported from `@tanstack/react-query` and receives previous data as argument

### B. Prefetch Before Navigate for Employee Detail

#### Problem

Clicking an employee row → navigate → fetch detail causes noticeable loading delay on detail page.

#### Solution Applied

1. Created reusable `buildEmployeeDetailQuery` in `employee-load.query.ts`:

```ts
export const buildEmployeeDetailQuery = (employeeId: number) =>
  queryOptions({
    queryKey: employeeQueryKeys.detail(employeeId),
    queryFn: () => employeeApi.getById(employeeId),
    enabled: employeeId > 0,
  });
```

2. Prefetch in `use-employee-browse.ts` before navigate (fire-and-forget):

```ts
const queryClient = useQueryClient();

const onSelect = (employee: Employee) => {
  setSelectedEmployee(employee);
  queryClient.prefetchQuery(buildEmployeeDetailQuery(employee.id)); // prefetch
  navigate(toDetailHref(employee.id)); // navigate immediately
};
```

3. Reused `buildEmployeeDetailQuery` in `use-employee-detail-load.ts`:

```ts
const query = useQuery(buildEmployeeDetailQuery(employeeId));
```

#### Results

- ✅ Detail data likely cached before detail page mounts
- ✅ Reduced perceived loading time for detail page
- ✅ Zero code duplication (query config centralized in one place)
- ✅ Navigation not blocked (prefetch is fire-and-forget)

#### Key Insight

- **queryOptions pattern**: Enables reuse across `useQuery`, `useSuspenseQuery`, and `prefetchQuery`
- **Prefetch timing**: Fire before navigate, not after—gives network a head start
- **Feature boundary**: `buildEmployeeDetailQuery` lives in `employee-load` feature (not entity) because it combines entity API + keys with feature-level cache policy

### Pattern: queryOptions for Reusable Query Configs

Instead of duplicating query config across hooks/prefetch calls:

```ts
// ❌ Bad: Duplication
const query = useQuery({
  queryKey: employeeQueryKeys.detail(id),
  queryFn: () => employeeApi.getById(id),
  enabled: id > 0,
});

queryClient.prefetchQuery({
  queryKey: employeeQueryKeys.detail(id),
  queryFn: () => employeeApi.getById(id),
});
```

Centralize with `queryOptions`:

```ts
// ✅ Good: Single source of truth
export const buildEmployeeDetailQuery = (id: number) =>
  queryOptions({
    queryKey: employeeQueryKeys.detail(id),
    queryFn: () => employeeApi.getById(id),
    enabled: id > 0,
  });

// Reuse everywhere
const query = useQuery(buildEmployeeDetailQuery(id));
queryClient.prefetchQuery(buildEmployeeDetailQuery(id));
```

### Boundary Ownership

- **Entity layer** (`employee.keys.ts`): Query key factory (stable key structure)
- **Entity layer** (`employee.api.ts`): API calls (data fetching logic)
- **Feature layer** (`employee-load.query.ts`): `queryOptions` builders (cache policy + entity composition)
- **Feature layer** (`employees.query.ts`, `use-employee-detail-load.ts`): Query hooks (scenario-specific wrappers)

This keeps entity layer pure (data contracts) and feature layer responsible for cache orchestration.

## Mutation Flow: Fire-and-Forget Pattern with Optimistic Updates

### Problem

Dialog forms using `await mutateAsync(...)` block the dialog close until the server responds. With optimistic updates already implemented, the UI updates immediately via `onMutate`, but users still wait for the server before the dialog closes.

### Solution Applied

Replace `createModalFormHandler` + `await mutateAsync` with direct `form.handleSubmit` + `mutate` (fire-and-forget):

```ts
// ❌ Before: Await blocks dialog close
const handleSubmit = createModalFormHandler(
  form,
  () => setIsAddOpen(false),
  true,
)(async (data) => {
  await createMutation.mutateAsync(data); // blocks until server responds
});

// ✅ After: Fire-and-forget, close immediately
const handleSubmit = form.handleSubmit((data) => {
  createMutation.mutate(data); // fire-and-forget
  setIsAddOpen(false); // close immediately
  form.reset(); // reset form
});
```

### Results

- ✅ Dialog closes immediately after submit
- ✅ Optimistic update shows result instantly (via mutation's `onMutate`)
- ✅ Error rollback still works (mutation's `onError` restores previous state)
- ✅ No user-blocking wait for server response

### When to Use This Pattern

**Apply fire-and-forget when:**

- Mutation has optimistic updates (`onMutate` + `onError` rollback)
- UI feedback is instant (no need to wait for server confirmation)
- Error handling is managed by mutation hooks (not form-level)

**Keep `await mutateAsync` when:**

- No optimistic update exists
- Server response needed for next action (e.g., redirect with new ID)
- Form-level error messages required before closing

### Files Changed

- `src/features/employee-edit/model/edit-employee.hook.ts`
  - `useAddEmployeeDialogFlow`: create employee (fire-and-forget)
  - `useEditEmployeeDialogFlow`: update employee (fire-and-forget)
- `src/features/attendance-edit/model/edit-attendance.hook.ts`
  - `useAttendanceAddDialogFlow`: create attendance (fire-and-forget)
  - `useAttendanceEditDialogFlow`: update attendance (fire-and-forget)

### Key Insight

The pattern from op_practice: **"Don't await when optimistic update handles the UI. Close dialog immediately, let mutation settle in background."**

This decouples UI responsiveness from network latency. Users see instant feedback via optimistic updates, while the mutation resolves asynchronously. If it fails, `onError` rolls back the UI state.

## Read/Write Subscription Split Optimization

### Problem

Components using `useAtom(atom)` subscribe to BOTH read and write operations. When a component only needs to read the value (or only write), it still re-renders on both operations, causing unnecessary re-renders.

### Pattern

Jotai provides three subscription levels:

1. **`useAtom(atom)`** — read + write (returns `[value, setter]`)
2. **`useAtomValue(atom)`** — read-only (returns `value`)
3. **`useSetAtom(atom)`** — write-only (returns `setter`)

**Rule**: Use the most restrictive subscription that matches your needs.

### Solution Applied

#### A. Created Read-Only Entity Hooks

Added read-only variants to entity hooks that follow the naming pattern:

```ts
// src/entities/employee/model/employee.hook.ts
export function useSelectedEmployeeValue(): Employee | null {
  return useAtomValue(selectedEmployeeAtom);
}

// src/entities/attendance/model/attendance.hook.ts
export function useSelectedAttendanceValue(): Attendance | null {
  return useAtomValue(selectedAttendanceAtom);
}
```

#### B. Replaced Read-Only Usage Patterns

Fixed 8 files where components destructured only `[value]` from `useAtom`:

**Before:**

```tsx
const [selectedEmployee] = useSelectedEmployee(); // subscribes to read+write
const [selectedAttendance] = useSelectedAttendance(); // subscribes to read+write
const [expandedIds] = useAtom(expandedDepartmentIdsAtom); // subscribes to read+write
```

**After:**

```tsx
const selectedEmployee = useSelectedEmployeeValue(); // subscribes to read-only
const selectedAttendance = useSelectedAttendanceValue(); // subscribes to read-only
const expandedIds = useAtomValue(expandedDepartmentIdsAtom); // subscribes to read-only
```

### Files Changed

1. **Entity hooks** (added read-only variants):
   - `src/entities/employee/model/employee.hook.ts` → added `useSelectedEmployeeValue`
   - `src/entities/attendance/model/attendance.hook.ts` → added `useSelectedAttendanceValue`

2. **Entity barrel exports**:
   - `src/entities/employee/index.ts` → exported `useSelectedEmployeeValue`
   - `src/entities/attendance/index.ts` → exported `useSelectedAttendanceValue`

3. **Feature files** (replaced read-only usage):
   - `src/features/attendance-edit/ui/attendance-dialogs-by-selected-employee.tsx`
   - `src/features/employee-edit/model/edit-employee.hook.ts`
   - `src/features/attendance-edit/model/edit-attendance.hook.ts`
   - `src/features/employee-detail/ui/employee-detail-dialog-container.tsx`
   - `src/features/employee-detail/ui/employee-detail-panel.tsx`
   - `src/features/department-tree/model/use-department-tree.ts` (expandedIds only)

### Results

- ✅ Components now subscribe only to the operations they actually use
- ✅ Reduced unnecessary re-renders when atom value doesn't change but setter reference changes
- ✅ Clearer intent: code explicitly declares read-only vs read-write usage
- ✅ Zero behavioral changes (pure optimization)
- ✅ Build passes, no type errors

### Detection Heuristic

Search for these patterns to find optimization candidates:

```bash
# Find destructuring that only reads
grep -r "const \[.*\] = useAtom(" src/

# Find destructuring that only writes (should use useSetAtom)
grep -r "const \[, .*\] = useAtom(" src/
```

**Criteria for split:**

- `const [value] = useAtom(...)` → use `useAtomValue(...)` instead
- `const [, setter] = useAtom(...)` → use `useSetAtom(...)` instead
- `const [value, setter] = useAtom(...)` where both are used → keep `useAtom`

### Naming Convention

Follow the established entity hook naming pattern:

- **Read+Write**: `useSelectedEmployee` → returns `[Employee | null, setter]`
- **Read-Only**: `useSelectedEmployeeValue` → returns `Employee | null`
- **Write-Only**: `useSetSelectedEmployee` → returns `setter`

This pattern already existed for dialog state (e.g., `useEmployeeDetailDialog` vs `useSetEmployeeDetailDialog`), now consistently applied to domain state atoms as well.

### Key Insight

This optimization aligns with the Jotai atomic state philosophy:

- **Granular subscriptions** reduce re-render scope
- **Explicit intent** makes dependencies clear at call-site
- **Entity layer** provides the subscription primitives
- **Feature layer** uses the appropriate subscription level for each scenario

Combined with the existing read/write split for dialog atoms, the codebase now has a consistent pattern for subscription optimization across all entity state.
