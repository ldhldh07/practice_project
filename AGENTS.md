# AGENTS Knowledge Base

## Purpose

- Keep architectural rules executable and reviewable by agents.
- Integrate proven patterns from the reference projects into one stable baseline.
- Prevent "works now but drifts later" decisions in FSD, state, validation, and error handling.

## How To Use This File

- Treat every section as a default policy unless a feature-specific `AGENTS.md` overrides it.
- For non-trivial changes, review this file before coding and before final review.
- When rules conflict, choose stricter boundary ownership over local convenience.

## Layer Contract (FSD)

- `pages`: route entry, URL reading, route-level guard composition only.
- `widgets`: compose multiple features; no direct entity business orchestration.
- `features`: user scenario orchestration, mutation flow, atom/query composition.
- `entities`: domain data contract, query hooks, atom model, pure/presentational UI.
- `shared`: framework-agnostic utility, API client, error/validation primitives, UI primitives.

## Layer Entry/Exit Criteria

- `pages`
  - owns route-level decisions (route params, guard redirects, page composition)
  - does not own business mutation/query logic
- `widgets`
  - owns page-level assembly only
  - should stay thin: no domain policy branching
- `features`
  - owns "user scenario" flow and cross-entity orchestration
  - may coordinate URL -> atom -> query flow
- `entities`
  - owns domain schema, keys, query hooks, atom graph, and presentational UI
  - no route coupling
- `shared`
  - owns reusable primitives and infrastructure
  - no domain assumptions

## Import Guardrails

- `pages` must not import `@/entities/**` directly. Prefer `widgets` and `features`.
- `widgets` must not import `@/entities/**` directly.
- `features` may import `@/entities/**` and `@/shared/**`.
- `entities` may import only `@/shared/**`.
- `shared` imports only `shared`.
- Always keep dependency direction one-way: `pages -> widgets -> features -> entities -> shared`.

## Hard Fail Signals (Must Fix)

- `pages` or `widgets` directly import entity internals for orchestration.
- A `feature` reads/writes route params in multiple places for the same scenario owner.
- Entity presenter UI imports router, query, or mutation hooks.
- Same semantic state appears in both URL params and atom without explicit owner.
- Query key uses non-stable object identity without explicit serialization/normalization.
- New external API response enters app without zod validation.
- UI layer performs low-level error taxonomy classification.

## Entity Anatomy Rules

- Recommended entity shape:
  - `api/*`: external I/O
  - `model/*.schema.ts`: zod schemas
  - `model/*.keys.ts`: query key factory
  - `model/*.atom.ts`: domain atoms
  - `model/*.types.ts`: derived TS types
  - `hooks/*`: query hooks and atom access wrappers
  - `ui/*`: props-only presenter UI
- Entity UI must not call router/query/mutation directly.
- Entity model can own domain constraints, but cannot own app flow decisions.
- Keep API response schema and inferred type in the same model scope.

## Hook Scope Policy (Mandatory)

- Keep one hook when concerns are tightly coupled to one user scenario.
- Split hook when independent concerns are mixed.
- Split candidates:
  - data fetch/cache policy
  - URL/query-param sync
  - global atom graph sync
  - event handler/presentation glue
- Do not split for file count. Split for scenario independence and testability.

### Hook Split Heuristic (Executable)

- Split if the concern can be reused without dragging unrelated state.
- Split if one concern changes more frequently than the others.
- Split if unit tests need different setup boundaries.
- Keep merged only when all concerns always move together in one scenario.

## Custom Hook Guardrails (Scenario-First)

- Keep a custom hook when it owns one user scenario end-to-end (state read/write + side effect + submit flow).
- Split when add/edit/delete flows diverge in dependencies, validation, or mutation contract.
- Do not create pass-through wrappers that only rename or re-export existing hooks without adding scenario meaning.
- Prefer semantic hooks named by user intent (`useAdd*Scenario`, `useEdit*Scenario`) over implementation names (`use*State`, `use*Actions`) when behavior is coupled.
- Keep UI containers thin: rendering + scenario hook call + presenter props wiring.
- Keep form submit behavior (`submit + close`, `submit + reset`) inside scenario hooks when the same behavior repeats in one flow.
- Avoid central mega-hooks that return unrelated actions for multiple dialogs/screens.

### Hook Anti-Patterns (Must Refactor)

- A hook returns unrelated state/action bundles for independent dialogs and each caller uses only half.
- A hook exists only to return `mutateAsync` functions without adding policy, orchestration, or domain constraints.
- A hook couples route concern and entity concern when only one page uses that route concern.

### Hook Good Patterns In This Repo

- Scenario orchestration split by concern: `src/features/department-tree/model/use-department-tree.ts`
- Add flow scenario hook: `src/features/employee-edit/model/edit-employee.hook.ts` (`useAddEmployeeDialogScenario`)
- Edit flow scenario hook: `src/features/employee-edit/model/edit-employee.hook.ts` (`useEditEmployeeDialogScenario`)
- Attendance add/edit scenario hooks: `src/features/attendance-edit/model/edit-attendance.hook.ts`

## Data Ownership Policy (3-Layer State)

- Server state: TanStack Query in entity hooks.
- Domain cross-page state: Jotai atoms in entity models.
- Route-scoped view state: URL params in pages/route layer.
- Do not keep same semantic state in both URL and atom without an explicit sync owner.

### Decision Matrix: URL vs Atom vs Query

| State type                | Primary owner              | Place                 | Example                                |
| ------------------------- | -------------------------- | --------------------- | -------------------------------------- |
| Backend freshness/caching | Query                      | entity query hook     | employee list response                 |
| Cross-page domain draft   | Jotai atom                 | entity model          | selected employee, selected department |
| Route-scoped UI context   | URL params                 | page/route layer      | `departmentId`, paging/search params   |
| Multi-step flow gate      | derived atom + route guard | feature/page boundary | access to detail/confirm flow          |

Selection rule:

- If URL sharing/reload/back-forward must preserve it -> URL params.
- If it is app-domain memory across views -> atom.
- If source of truth is server and needs cache/invalidations -> query.

## Jotai Policy (Complex Domain)

- Use primitive atoms for source facts; use derived atoms for computed domain rules.
- Use write/action atoms for cascade updates (example: changing A resets B/C).
- Read/write split is recommended for perf-sensitive UIs:
  - read via `useAtomValue`
  - write via `useSetAtom` or write-only wrappers
- Prefer passing actions via props to presenter UI to avoid hidden subscriptions.
- Do not create a central mega-store abstraction unless the atom graph no longer stays composable.

### Atom Role Contract

- source atom
  - raw mutable facts from user flow or API hydration
  - no derived business formatting
- derived atom
  - pure computed rule/value from source atoms
  - no side effects
- action atom (write atom)
  - orchestrates cascades and normalization
  - may update multiple source atoms

### Jotai Evidence Examples In This Repo

- source atom: `src/entities/department/model/department-tree.atom.ts` (`departmentSourceAtom`, `selectedDepartmentIdAtom`)
- derived atom: `src/entities/department/model/department-tree.atom.ts` (`visibleDepartmentTreeAtom`, `selectedDepartmentDescendantsAtom`)
- action atom: `src/entities/department/model/department-tree.atom.ts` (`toggleDepartmentExpandAtom`, `selectDepartmentAtom`)
- read/write split in feature orchestration: `src/features/department-tree/model/use-department-tree.ts`

## Query Policy (TanStack)

- Query keys must be stable and explicit; avoid object-reference-only keys.
- Create query key factories in `entities/*/model/*keys.ts`.
- Prefer `queryOptions` extraction when the same query is used by both `useQuery` and `prefetchQuery`.
- Set `staleTime` by domain freshness, not one global number.
- Retry policy must be error-aware:
  - auth/validation/domain mismatch: no blind retry
  - network/transient: bounded retry

### Query Implementation Contract

- Export `build*Query` or `*QueryOptions` when reused across query + prefetch paths.
- Keep query key input normalized (`string`, `number`, explicit param objects with stable shape).
- Avoid retry loops for deterministic failures (400/401/validation/domain mismatch).

### Query Evidence Examples In This Repo

- key factory: `src/entities/employee/model/employee.keys.ts`
- queryOptions extraction: `src/features/employee-load/model/employee-load.query.ts`
- query usage: `src/features/employee-load/model/employees.query.ts`

### Retry Matrix (Default)

| Error class                 | Retry         |
| --------------------------- | ------------- |
| network/transport timeout   | bounded retry |
| 5xx transient server errors | bounded retry |
| auth (401/403)              | no retry      |
| validation/parse mismatch   | no retry      |
| domain rule violation       | no retry      |

## Zod Validation Policy (Trust Boundary)

- All external input/response enters through zod validation at boundary.
- Prefer `safeParse` + explicit error mapping when user-facing error semantics matter.
- `parse` is allowed in tightly controlled internal paths with clear fail-fast intent.
- Validation utility must throw typed app errors, not raw library errors, in feature-facing paths.
- Schema and inferred type stay co-located in entity model files.

### Validation Boundary Contract

- API response validation happens in entity API layer.
- Form/input validation happens in entity/feature form schema layer.
- Never pass `unknown` response payload directly to feature UI logic.

### Validation Evidence Examples In This Repo

- boundary validator utility: `src/shared/lib/validate.ts`
- schema usage in API calls: `src/entities/employee/api/employee.api.ts`
- schema co-location: `src/entities/employee/model/employee.schema.ts`

## Error Handling Policy

- Standardize error taxonomy:
  - transport/network
  - API/protocol
  - validation/parse
  - domain rule violation
- Keep error code constants centralized in shared.
- Convert unknown external failures into typed app errors near the data layer.
- UI layer handles rendering and user messaging only; avoid low-level classification in UI.
- Keep retry, redirect, and invalidate behaviors policy-driven by error type/code.

### Error Taxonomy Contract

- transport/network
  - connectivity, timeout, unavailable
  - mapped near API client/boundary
- API/protocol
  - HTTP status/code mismatch, response contract errors
- validation/parse
  - zod mismatch, malformed payload
- domain rule
  - business invariant violation

### Error Evidence Examples In This Repo

- centralized codes/messages: `src/shared/lib/errors/error-codes.ts`
- typed error classes: `src/shared/lib/errors/errors.ts`
- API boundary throw mapping: `src/shared/lib/validate.ts`

## Domain Dependency Management

- Prefer feature-level orchestration instead of cross-entity direct coupling.
- Cross-entity invariants are implemented as:
  - feature write atom/action
  - feature mutation flow
  - route guard preconditions
- For multi-step flows, compose guards from derived atoms and place route redirects at page/router boundary.
- If one change requires edits across many features, extract a shared domain primitive first.

### Orchestration Placement Rules

- Keep composition at widget/page level.
- Keep scenario branch and mutation sequencing at feature level.
- Keep domain read/write primitive and invariants at entity level.

### Current Repo Example

- widget-level dialog composition: `src/widgets/employee-manager/ui/employee-dialogs-widget.tsx`
- feature-level selected employee attendance orchestration: `src/features/attendance-edit/ui/attendance-dialogs-by-selected-employee.tsx`

## PR Review Checklist (Mandatory)

- Architecture
  - pass: each file role matches layer contract
  - fail: widget/page contains business orchestration
- State ownership
  - pass: server/domain/route states have single owner
  - fail: duplicated source of truth without sync owner
- Query
  - pass: stable keys + intentional invalidation + retry policy
  - fail: broad invalidation or object-identity key drift
- Validation
  - pass: external inputs/responses are validated at boundary
  - fail: raw response enters feature/UI logic
- Error handling
  - pass: typed, centralized mapping used consistently
  - fail: UI branches on low-level transport/protocol details
- Hook scope
  - pass: hook responsibilities align to one scenario or explicit split
  - fail: unrelated concerns bundled without reason

## Verification Evidence Checklist (What To Show)

- Layer boundary evidence: import graph in changed files (`pages`, `widgets`, `features`, `entities`).
- State owner evidence: URL reader location + atom declarations + query hook usage path.
- Query evidence: key factory + options extractor + invalidation call sites.
- Validation evidence: schema file + boundary validate call.
- Error evidence: centralized code map + error class usage site.
- Hook scope evidence: hook file responsibilities and named split helpers.

## Code Review Skill Entry

- Skill file: `.opencode/skills/integrated-fsd-jotai-review/SKILL.md`
- Usage intent: run this checklist before merge on any non-trivial feature.

## Search Mode Playbook

- Use parallel `explore` agents for codebase scans.
- Use parallel `librarian` agents for external docs/examples.
- Run direct `grep` and AST search for exhaustive confirmation.
- Never conclude from first match; collect all occurrences first.

## Analyze Mode Playbook

- Gather context first, then judge.
- For conventional complexity: consult `oracle`.
- For unconventional redesign: consult `artistry`.
- Synthesize findings into facts, options, recommendation.

## Reference Pattern Sources

- `weather`: hook split policy, read/write atom optimization, URL vs atom ownership.
- `exchange_practice`: typed error taxonomy, zod safeParse mapping, query retry by error type.
- `op_practice`: trust-boundary zod + app-error wrapping, route-guard flow ownership.
- `vineyard_backoffice`: AGENTS operationalization, strict layer role documentation, API error normalization.
- `toss-train-reservation`: 3-layer state ownership, action-atom cascades, queryOptions + prefetch pattern.

## Hidden Agent Reference Repos

- `train_reservation` feature branch reference
  - remote: `https://github.com/ldhldh07/train_reservation`
  - local expected path: `/Users/doohyun/Desktop/train_reservation`
- `photo_app` reference
  - remote: `https://github.com/ldhldh07/photo_app`
  - local expected path: `/Users/doohyun/Desktop/photo_app`
- `exchange_app` reference
  - remote: `https://github.com/ldhldh07/exchage_app`
  - local fallback path: `/Users/doohyun/Desktop/exchange_practice`
- `weather_app` reference
  - remote: `https://github.com/ldhldh07/weather_app`
  - local path: `/Users/doohyun/Desktop/weather`
- `op_practice` routing/constants reference
  - local path: `/Users/doohyun/Desktop/op_practice`

## Definition of Done

- Lint passes.
- Build passes.
- Layer guardrails remain intact.
- Changed hooks follow scope policy.
- New/changed API boundaries include zod validation.
- New error flows map to shared error taxonomy.
- Review evidence can be pointed to concrete files/symbols, not only prose.
