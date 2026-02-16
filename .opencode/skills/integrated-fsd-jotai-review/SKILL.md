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

## Step-by-step Review

1. Layer and dependency direction
   - Verify each file role matches layer contract.
   - Reject direct `pages -> entities` and `widgets -> entities` imports.
   - Reject cross-entity orchestration outside `features`.
   - Pass: imports follow `pages -> widgets -> features -> entities -> shared`.
   - Fail: page/widget owns mutation orchestration logic.

2. State ownership (server/domain/route)
   - Check same semantic state is not duplicated across URL and atom.
   - Verify URL state is route-scoped and read at page/router boundary.
   - Verify cross-page domain state is in entity atoms.
   - Pass: URL owner is single location, atom owner is single location.
   - Fail: same state copied in URL + atom without named sync owner.

3. Jotai graph quality
   - Check source atoms, derived atoms, and action atoms are separated by role.
   - For cascade behavior, prefer explicit write atoms over ad-hoc `set` chains in UI.
   - For perf-sensitive UI, prefer read/write split (`useAtomValue`, `useSetAtom`).
   - Pass: write atom handles cascade/reset and presenter receives handlers via props.
   - Fail: UI component performs cross-atom cascade updates inline.

4. Query design and cache policy
   - Query keys are stable and explicit primitive tuples.
   - Shared query usage uses exported `queryOptions` when prefetch is also needed.
   - Retry is error-aware (no retry for auth/validation/domain mismatch).
   - Invalidation scope is minimal but sufficient.
   - Pass: key factory exists and options are reusable.
   - Fail: object-identity key drift or broad invalidation without reason.

5. Zod trust boundary
   - Every external response/input is validated at boundary.
   - If user-facing semantics matter, use `safeParse` and map to typed app errors.
   - Avoid leaking raw `ZodError` past data layer.
   - Pass: schema + validate call pair is visible in boundary layer.
   - Fail: `unknown` payload reaches feature/UI logic.

6. Error taxonomy and handling
   - Error codes are centralized in shared constants.
   - Unknown external failures are normalized near API/data layer.
   - UI only renders already-classified error states.
   - Redirect/retry/invalidate behavior is code/type-driven and deterministic.
   - Pass: UI consumes typed error state only.
   - Fail: UI branches on HTTP status/protocol details directly.

7. Complex domain dependency management
   - Cross-entity invariant logic stays in feature orchestration.
   - Multi-step route flows use derived guard conditions at route boundary.
   - If multiple features share repeated domain logic, request extraction to shared primitive.
   - Pass: feature orchestrates, entity stays reusable primitive.
   - Fail: entity directly orchestrates app-level flow.

8. Custom hook scope (scenario-first)
   - Keep hook when it owns one user scenario end-to-end.
   - Split add/edit/delete when dependencies or contracts diverge.
   - Reject pass-through wrappers that only re-expose `useAtom`/`mutateAsync` without policy.
   - Pass: semantic scenario hook (`useAdd*Scenario`, `useEdit*Scenario`) and thin container wiring.
   - Fail: mega-hook returning unrelated state/action bundles used partially by callers.

## Evidence to Capture (Mandatory)

- Layer evidence: changed file import graph (`pages/widgets/features/entities/shared`).
- State evidence: URL reader path + atom declaration path + query hook path.
- Query evidence: key factory and `queryOptions`/prefetch call sites.
- Validation evidence: schema definition and boundary validate call.
- Error evidence: error code map and typed error class usage path.
- Hook evidence: split helpers and responsibility names in hook files.

## Fast Fail Conditions

- Direct layer rule violation.
- Entity UI calls query/router/mutation directly.
- Duplicate source of truth for same state (URL + atom) without clear owner.
- Unstable query key using object references.
- Missing zod validation on new external API surface.
- UI-layer ad-hoc error classification logic.

## Review Output Format

Use this report template:

```md
## Architecture Review

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
