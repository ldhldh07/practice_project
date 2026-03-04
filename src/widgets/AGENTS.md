# Widgets Layer Rules

## 책임

Feature + shared 조합으로 페이지 구성 단위를 만든다.
도메인 정책 분기 ❌ — 조합만, 얇게 유지.

## 현재 Widgets

| Widget                                         | 구성                                                                    |
| ---------------------------------------------- | ----------------------------------------------------------------------- |
| `employee-manager/employee-body-widget.tsx`    | DepartmentTreeContainer + EmployeeBrowsePanel + EmployeeFilterContainer |
| `employee-manager/employee-dialogs-widget.tsx` | EmployeeAdd/EditDialogContainer + AttendanceDialogsBySelectedEmployee   |

## Import 규칙

- widgets → `[features, shared]` 허용
- **`@/entities` import 금지** (no-restricted-imports로 lint 강제)
- entity 데이터가 필요하면 feature를 통해 간접 접근

```tsx
// ✅ feature container를 조합
import { DepartmentTreeContainer } from "@/features/department-tree";
import { EmployeeBrowsePanel } from "@/features/employee-browse";

// ❌ entity 직접 import — lint error
import { EmployeesTable } from "@/entities/employee";
```

## 패턴

- Widget은 feature container들을 조합하고, 라우트 관련 값은 page에서 props로 받는다
- 증거: `EmployeeBodyWidget`은 `toEmployeeDetailHref`를 props로 받아 navigate에 사용

```tsx
export function EmployeeBodyWidget({ toEmployeeDetailHref }: Props) {
  const navigate = useNavigate();
  return <EmployeeBrowsePanel onNavigate={(emp) => navigate(toEmployeeDetailHref(emp.id))} />;
}
```

## Anti-patterns

- widget에서 비즈니스 로직/mutation 직접 수행
- widget에서 `@/entities` 직접 import (lint error)
- widget이 두꺼워지면 feature로 분리 고려
