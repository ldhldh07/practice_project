# Entities Layer Rules

전체 정책은 루트 `AGENTS.md`의 "Entity Anatomy Rules" 참조.

## 책임

도메인 데이터 계약: 스키마, query hooks, atom model, 순수 UI.
비즈니스 흐름 결정 ❌ — entity는 "무엇"을 알지, "어떻게 쓸지"는 모른다.

## Entity 내부 구조 (model/ 단수형)

```
entity/
├── api/*.api.ts        # API 호출 + validateSchema
├── model/
│   ├── *.schema.ts     # Zod 스키마 + z.infer 타입
│   ├── *.keys.ts       # Query Key Factory
│   ├── *.atom.ts       # Jotai atom (source/derived/action)
│   ├── *.hook.ts       # atom 래핑 훅 + form 훅 (선택적)
│   ├── *.query.ts      # queryOptions + useQuery
│   ├── *.types.ts      # 추가 TS 타입
│   └── spec/           # 테스트 (co-location)
├── ui/                 # 순수 프레젠테이션
└── index.ts            # barrel export (public API)
```

## 현재 Entities

| Entity     | Atom 패턴            | 이유                                                                                    |
| ---------- | -------------------- | --------------------------------------------------------------------------------------- |
| department | **atom 직접 export** | atom 그래프 복잡 (source 4 + derived 3 + action 2), feature orchestration hook이 캡슐화 |
| employee   | **hook 래핑**        | atom 단순 (dialog open/close, 선택값), 여러 feature에서 동일하게 사용                   |
| attendance | **hook 래핑**        | employee와 동일한 이유                                                                  |

### Hook 래핑 vs Atom 직접 Export 판단 기준

- atom이 단순 (on/off, 단일 값) + 여러 feature에서 동일 사용 → **hook 래핑**
- atom 그래프 복잡 (source/derived/action 조합) + feature가 직접 조합 필요 → **atom 직접 export**
- pass-through 래퍼만 있는 무의미한 hook 금지

## 순수 UI 규칙 (ui/)

Entity UI = **Presenter** (feature UI = Container)

| 허용                                           | 금지                                       |
| ---------------------------------------------- | ------------------------------------------ |
| `useState`, `useRef`, `useMemo`, `useCallback` | `useMutation`, `useQueryClient`, `useAtom` |
| callback props (`onRowClick`, `onSubmit`)      | `useNavigate`, `useSearchParams`           |
| 조건부 렌더링, 스타일링                        | 직접 API 호출, query invalidation          |

```tsx
// ✅ entity UI — callback props로 외부 의존성 대체
function EmployeesTable({ employees, onSelect }: Props) { ... }
function EmployeeEditDialog({ open, onOpenChange, form, onSubmit, error }: Props) { ... }

// ❌ entity UI에서 금지
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
```

## Import 규칙

- entities → `[entities, shared]` 만 허용
- entity 간 import 허용 (예: attendance가 employee 타입 참조)
- features, widgets, pages import ❌

## Anti-patterns

- entity에서 feature/page import
- entity UI에 비즈니스 로직 훅 (useMutation, useQueryClient 등)
- pass-through 래퍼만 있는 의미 없는 hook
- API 응답을 zod 검증 없이 통과시키기
