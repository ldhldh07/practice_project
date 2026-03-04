# Features Layer Rules

전체 정책은 루트 `AGENTS.md`의 "Custom Hook Guardrails", "Hook Scope Policy" 참조.

## 책임

사용자 시나리오 오케스트레이션: mutation flow, cross-entity 조합, dialog/form 시나리오.

## Container-Presenter 패턴

- **feature/ui/** = Container — scenario hook 호출 + entity UI에 props 주입
- **entities/ui/** = Presenter — 순수 렌더링, callback props만 받음
- Container 파일명: `*-container.tsx` (kebab-case)

```tsx
// feature container — hook으로 시나리오 주입
export function EmployeeEditDialogContainer() {
  const { isEditOpen, setIsEditOpen, form, handleSubmit, error } = useEditEmployeeDialogFlow();
  return (
    <EmployeeEditDialog
      open={isEditOpen}
      onOpenChange={setIsEditOpen}
      form={form}
      onSubmit={handleSubmit}
      error={error}
    />
  );
}
```

## Scenario Hook 컨벤션

| 네이밍             | 용도                                    | 예시                                                    |
| ------------------ | --------------------------------------- | ------------------------------------------------------- |
| `use*DialogFlow`   | 다이얼로그 시나리오 (열기→폼→제출→닫기) | `useAddEmployeeDialogFlow`, `useEditEmployeeDialogFlow` |
| `use*` (동사/명사) | 일반 시나리오 오케스트레이션            | `useDepartmentTree`, `useEmployeeBrowse`                |

### Scenario Hook 구조

- 하나의 시나리오를 끝까지 책임 (상태 읽기 → 액션 → 사이드이펙트 → 반환)
- 관심사 독립 시 서브훅으로 분리 → 오케스트레이터 훅이 조합
  - 증거: `use-department-tree.ts` — `useDepartmentTreeSourceSync` + `useDepartmentTreeUrlSync` + `useDepartmentTreeState`
- mutation flow: `mutateAsync` + close-on-success + `mutation.reset()` on dialog open

## 현재 Features (8개)

| Feature            | 역할                                                |
| ------------------ | --------------------------------------------------- |
| `department-tree`  | 부서 트리 시나리오 (fetch + URL sync + 상태 바인딩) |
| `employee-browse`  | 직원 목록 탐색 + navigate                           |
| `employee-detail`  | 직원 상세 조회 + prefetch                           |
| `employee-filter`  | 직원 검색/필터 UI 컨테이너                          |
| `employee-edit`    | 직원 CRUD 다이얼로그 + mutation                     |
| `employee-dialogs` | 직원 다이얼로그 조합 (조합 전용)                    |
| `employee-load`    | 직원 데이터 로딩 쿼리 (queryOptions 재사용)         |
| `attendance-edit`  | 근태 CRUD 다이얼로그 + mutation                     |

## Import 규칙

- features → `[entities, shared]` 허용
- `@/features` barrel import **금지** (no-restricted-imports)
  - cross-feature 조합은 **widget/page 레이어**에서 수행
  - feature 간 순환 의존 원천 차단
- Cross-entity invalidation은 feature mutation에서 수행: `queryClient.invalidateQueries({ queryKey: entityKeys.all })`

## Mutation 파일 위치

- `model/*.mutation.ts` — feature 안에 위치 (entity가 아님)
- mutation은 시나리오 소유이므로 feature 책임

## 기존 Feature-Specific AGENTS.md

- `department-tree/AGENTS.md` — hook split 가이드, URL sync 규칙

## Anti-patterns

- Container에서 비즈니스 로직 직접 작성 (hook으로 추상화해야 함)
- feature에서 다른 feature를 `@/features/*`로 import
- entity에 mutation 로직 배치
- URL/라우팅 로직을 feature 안에서 직접 처리 (page에서 props로 전달)
