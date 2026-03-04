# Integrated FSD Jotai Review

FSD, Jotai, TanStack Query, Zod, Error handling, and domain dependency review checklist.

## Purpose

- Catch architecture drift before merge.
- Review changes with the same criteria every time.
- Focus on separation of concerns over local implementation detail.

## Scope

- Use for any non-trivial frontend change.
- Mandatory when changes include at least one of:
  - new feature flow
  - new entity API boundary
  - atom graph changes
  - query key/invalidation changes
  - error mapping or retry behavior
  - new Container / Presenter pair
  - new scenario hook

## Step-by-step Review

### 1. Layer and dependency direction

- Verify each file role matches layer contract.
- Reject direct `pages -> entities` and `widgets -> entities` imports.
- Reject cross-entity orchestration outside `features`.
- Reject `@/features` barrel import inside features (cross-feature).
- Pass: imports follow `pages -> [widgets, features, shared]`, `widgets -> [features, shared]`, `features -> [entities, shared]`.
- Fail: page/widget owns mutation orchestration logic, or widget/page imports `@/entities`.

### 2. Project conventions check

- `model/` directory (singular, NOT `models/`).
- Container file naming: `*-container.tsx` (kebab-case).
- Scenario hook naming: `use*DialogFlow` for dialog scenarios, `use*` (verb/noun) for general orchestration.
- Entity barrel export (`index.ts`): check hook wrapping vs atom direct export is intentional (see step 8).
- Fail: `models/` directory, PascalCase container filenames, `use*Scenario` without `DialogFlow` suffix for dialog hooks.

### 3. State ownership (server/domain/route)

- Check same semantic state is not duplicated across URL and atom.
- Verify URL state is route-scoped and read at page/router boundary.
- Verify cross-page domain state is in entity atoms.
- Pass: URL owner is single location, atom owner is single location.
- Fail: same state copied in URL + atom without named sync owner.

### 4. Jotai graph quality

- Check source atoms, derived atoms, and action atoms are separated by role.
- For cascade behavior, prefer explicit write atoms over ad-hoc `set` chains in UI.
- For perf-sensitive UI, prefer read/write split (`useAtomValue`, `useSetAtom`).
- Pass: write atom handles cascade/reset and presenter receives handlers via props.
- Fail: UI component performs cross-atom cascade updates inline.

### 5. Query design and cache policy

- Query keys are stable and explicit primitive tuples.
- Shared query usage uses exported `queryOptions` when prefetch is also needed.
- Retry is error-aware (no retry for auth/validation/domain mismatch).
- Invalidation scope is minimal but sufficient.
- Pass: key factory exists and options are reusable.
- Fail: object-identity key drift or broad invalidation without reason.

### 6. Zod trust boundary

- Every external response/input is validated at boundary.
- If user-facing semantics matter, use `safeParse` and map to typed app errors.
- Avoid leaking raw `ZodError` past data layer.
- Pass: schema + `validateSchema()` call pair is visible in entity API layer.
- Fail: `unknown` payload reaches feature/UI logic.

### 7. Error taxonomy and declarative consumption

- Error codes are centralized in `shared/lib/errors/error-codes.ts`.
- Unknown external failures are normalized near API/data layer.
- Error classification uses `isExpectedError()` — code-based allowlist (`EXPECTED_ERROR_CODES: ReadonlySet`):
  - Expected (domain codes like `EMPLOYEE_DUPLICATE_EMAIL`, plus `BAD_REQUEST`/`NOT_FOUND`/`CONFLICT`) → inline error banner inside dialog/form.
  - Unexpected (codes not in allowlist — network/5xx/unknown) → `MutationCache.onError` global toast.
  - Safe default: new error codes automatically fall to unexpected → ErrorBoundary/toast. No silent failure.
- Server response body `code` field is parsed by `extractServerErrorCode` in `client.ts` and set on `ApiError.code`.
- TanStack Query `Register.defaultError = ApiError` provides global error type inference.
- Mutation flow follows declarative pattern:
  - `mutateAsync` + close-on-success (dialog closes only on success).
  - `mutation.reset()` on dialog open (prevents stale error display).
- Pass: UI consumes typed error state only, follows declarative pattern.
- Fail: UI branches on HTTP status/protocol details directly, or silently swallows errors.

### 8. Hook wrapping vs Atom direct export

- **Hook wrapping** (employee, attendance pattern): atom is simple (on/off, single value), used identically across multiple features → entity exports `use*()` hooks that hide jotai.
- **Atom direct export** (department pattern): atom graph is complex (source/derived/action composition), feature orchestration hook already capsulates → entity exports atoms directly.
- Reject pass-through wrappers that only rename `useAtom(someAtom)` without adding policy or abstraction value.
- Pass: chosen pattern matches complexity criteria above.
- Fail: complex atom graph wrapped in 7+ trivial hooks, or simple atom exposed raw without wrapping.

### 9. Container-Presenter boundary

- Feature UI (`*-container.tsx`) calls scenario hook + wires props to entity UI.
- Entity UI is pure presenter: no `useMutation`, `useQueryClient`, `useNavigate`, `useAtom`.
- Entity UI allows: `useState`, `useRef`, `useMemo`, `useCallback`.
- External context dependencies replaced with callback props (`useNavigate` → `onRowClick`).
- Pass: Container is thin (hook call + JSX), Presenter has zero business imports.
- Fail: Container has inline business logic, or Presenter imports mutation/query/navigation.

### 10. Custom hook scope (scenario-first)

- Keep hook when it owns one user scenario end-to-end.
- Split add/edit/delete when dependencies or contracts diverge.
- Split sub-hooks when concerns are independently reusable (fetch, URL sync, state binding).
- Reject pass-through wrappers that only re-expose `useAtom`/`mutateAsync` without policy.
- Pass: semantic scenario hook (`use*DialogFlow`) and thin container wiring.
- Fail: mega-hook returning unrelated state/action bundles used partially by callers.

### 11. Complex domain dependency management

- Cross-entity invariant logic stays in feature orchestration.
- Multi-step route flows use derived guard conditions at route boundary.
- If multiple features share repeated domain logic, request extraction to shared primitive.
- Pass: feature orchestrates, entity stays reusable primitive.
- Fail: entity directly orchestrates app-level flow.

## Automated Validation (Run Before Report)

Run these commands and include results in the review:

```bash
# 1. ESLint boundaries + no-restricted-imports
npx eslint src/ --no-warn-ignored 2>&1 | head -50

# 2. TypeScript type check
npx tsc --noEmit 2>&1 | tail -20

# 3. Check for models/ (should be model/)
find src -type d -name "models" 2>/dev/null

# 4. Check entity UI for forbidden imports
grep -rn "useMutation\|useQueryClient\|useNavigate\|useSearchParams" src/entities/*/ui/ 2>/dev/null

# 5. Check widgets/pages for @/entities imports
grep -rn "@/entities" src/widgets/ src/pages/ 2>/dev/null

# 6. Check features for @/features barrel imports
grep -rn '"@/features"' src/features/ 2>/dev/null
```

## Evidence to Capture (Mandatory)

- Layer evidence: changed file import graph (`pages/widgets/features/entities/shared`).
- Convention evidence: file naming, directory naming, hook naming.
- State evidence: URL reader path + atom declaration path + query hook path.
- Query evidence: key factory and `queryOptions`/prefetch call sites.
- Validation evidence: schema definition and boundary `validateSchema()` call.
- Error evidence: `isExpectedError()` usage, `mutation.reset()` on open, close-on-success flow.
- Hook evidence: wrapping vs direct export justification, scenario hook structure.

## Fast Fail Conditions

- Direct layer rule violation (page/widget → entity import).
- `@/features` barrel import inside features.
- Entity UI calls query/router/mutation directly.
- Duplicate source of truth for same state (URL + atom) without clear owner.
- Unstable query key using object references.
- Missing zod validation on new external API surface.
- UI-layer ad-hoc error classification logic.
- `models/` directory (must be `model/`).

## Review Output Format

Use this report template:

```md
## Architecture Review

### Automated Checks

- [ ] ESLint boundaries: pass/fail
- [ ] TypeScript: pass/fail
- [ ] Convention checks: pass/fail

### Blockers

- [ ] item

### Must Fix

- [ ] item

### Good

- item

### Follow-ups

- item
```

## Notes

- This checklist is policy-oriented. Keep feedback tied to layer role and ownership boundaries.
- Prefer small, reversible corrections over broad rewrites.
- Reference layer-specific AGENTS.md files (`src/entities/AGENTS.md`, `src/features/AGENTS.md`, etc.) for detailed rules.
