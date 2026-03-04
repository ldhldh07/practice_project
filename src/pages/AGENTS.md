# Pages Layer Rules

## 책임

라우트 엔트리, URL 파싱, widget/feature 조합.
비즈니스 로직 ❌ — page는 "무엇을 보여줄지"만 결정한다.

## 현재 Pages

| Page                | 역할                                          |
| ------------------- | --------------------------------------------- |
| `employee-manager/` | 직원 관리 메인 (위젯 조합 + 라우트 설정 전달) |
| `employee-detail/`  | 직원 상세 (URL param 파싱 + feature 조합)     |
| `not-found/`        | 404 페이지                                    |

## Page 내부 구조

```
page/
├── *Page.tsx     # PascalCase 컴포넌트 (라우트 엔트리)
├── route.ts      # 라우트 경로 상수 + 타이틀
└── index.ts      # barrel export
```

## Import 규칙

- pages → `[widgets, features, shared]` 허용
- **`@/entities` import 금지** (no-restricted-imports로 lint 강제)
- 라우트 경로 상수는 `@/shared/config/routes`에서 가져옴

## URL/라우팅 소유권

- **URL param 파싱은 page 책임** — `useParams`, `useSearchParams` 사용 후 feature에 값으로 전달
- **라우트 href 생성은 shared/config 책임** — `getEmployeeDetailHref(id)`
- feature는 라우트 구현을 직접 알지 않음 — props/콜백으로 전달

```tsx
// ✅ page에서 URL 파싱 후 feature에 전달
export function EmployeeDetailPage() {
  const { employeeId } = useParams<{ employeeId: string }>();
  return <EmployeeDetailSection employeeId={Number(employeeId)} backToRoute={EMPLOYEE_MANAGER_ROUTE} />;
}

// ✅ page에서 라우트 href를 widget에 전달
export function EmployeeManagerPage() {
  return <EmployeeBodyWidget toEmployeeDetailHref={getEmployeeDetailHref} />;
}
```

## route.ts 컨벤션

```ts
export { EMPLOYEE_MANAGER_ROUTE } from "@/shared/config/routes";
export const EMPLOYEE_MANAGER_TITLE = "직원 관리";
```

- 라우트 경로는 shared에서 re-export
- 페이지 타이틀은 route.ts에서 상수로 관리

## Anti-patterns

- page에서 `@/entities` 직접 import (lint error)
- page에서 mutation 직접 호출 — feature에 위임
- page에서 URL 동기화 로직을 feature에 복제
- 비즈니스 분기/조건 로직을 page에 작성
