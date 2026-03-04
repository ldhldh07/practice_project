# Practice

## 소개

해당 프로젝트는 현재 시점에서 가지고 있는 기준을 적용하고자 제작되었습니다.

프로젝트의 방향성은 다음과 같습니다 :

- FSD 아키텍처 - 레이어별 관심사 분리와 단방향 의존성
- 커스텀 훅 기반 - 상태, setter 배열 반환 패턴을 따르는 일관된 상태 관리
- 아키텍처와 호환성을 고려한 도구 - Jotai, TanStack Query, React Hook Form
- zod를 통한 API 응답 타입 안전성
- 조직도/구성원/근태를 함께 다루는 도메인 흐름과 에러 처리 일관성

## FSD를 기반으로 한 이유

FSD 아키텍처를 기반으로 했지만, FSD 구현은 목적보다는 수단에 가깝습니다.

레이어, 슬라이스, 세그먼트를 통해 수직적, 수평적으로 코드를 분리하면서 그 기준을 세우고자 했습니다.

- 응집도를 높이고, 결합도를 낮추는
- 일관성 있는 관심사 분리

FSD의 규칙을 정확히 지키기 보다는 큰 방향성에 맞춰 스스로의 구조를 만들고, 추상화 레이어에 대한 이해를 반영하고자 했습니다.

## 폴더구조

```
src/
├── app/                             # 애플리케이션 설정
│   └── ui/
│       ├── layout.tsx               # 전체 레이아웃 + ErrorBoundary
│       └── query-provider.tsx       # TanStack Query 설정 + MutationCache
│
├── pages/                           # 페이지 컴포넌트
│   ├── employee-manager/            # 직원 관리 페이지
│   ├── employee-detail/             # 직원 상세 페이지
│   └── not-found/                   # 404 페이지
│
├── widgets/                         # 페이지 구성 단위
│   └── employee-manager/ui/
│       ├── employee-body-widget.tsx    # 본문 위젯
│       ├── employee-dialogs-widget.tsx # 다이얼로그 위젯
│       └── employee-header-widget.tsx  # 헤더 위젯
│
├── features/                        # 사용자 시나리오 (비즈니스 로직)
│   ├── department-tree/             # 부서 트리 기능
│   ├── employee-browse/             # 직원 목록 탐색
│   ├── employee-detail/             # 직원 상세 조회
│   ├── employee-filter/             # 직원 필터/검색 기능
│   ├── employee-edit/               # 직원 편집 기능
│   ├── employee-dialogs/            # 직원 다이얼로그 조합
│   ├── employee-load/               # 직원 데이터 로딩 쿼리
│   └── attendance-edit/             # 근태 편집 기능
│
├── entities/                        # 비즈니스 엔티티 (순수 데이터)
│   ├── department/                  # 부서 엔티티
│   ├── employee/                    # 직원 엔티티
│   │   ├── api/employee.api.ts      # 직원 API
│   │   ├── model/
│   │   │   ├── employee.hook.ts     # 직원 훅
│   │   │   ├── employee.keys.ts     # Query Key
│   │   │   └── employee.schema.ts   # Zod 스키마
│   │   └── ui/                      # 순수 UI (비즈니스 로직 ❌, 사이드 이펙트 ❌, 외부 의존성 ❌)
│   └── attendance/                  # 근태 엔티티
│
└── shared/                          # 공통 유틸리티
    ├── api/client.ts                # HTTP 클라이언트 (타입화된 에러 throw)
    ├── config/                      # 라우트, 환경 설정
    ├── lib/
    │   ├── validate.ts              # API 검증 유틸
    │   └── errors/                  # 에러 코드/타입/분류
    ├── types/                       # 공통 타입 정의
    └── ui/                          # 공통 UI 컴포넌트
```

최상위 이름을 도메인으로 통일하여 유지하고 **중복 확장자**를 통해 의미를 부여하는 방식

- fsd에서 폴더 뎁스가 깊어지는 단점을 보완하고자 함
- 경로/파일명으로 어떤 코드가 있을지 예측 가능하다

## 핵심 로직

### 1. 기본 컴포넌트 코드 구조

핵심 로직이 담겨있는 features 레이어의 ui 세그먼트의 파일 구조는 다음과 같이 구성되어 있습니다.

- Custom Hook
- computed value
- handlers
- ui

```ts
import { EmployeeEditDialog } from "@/entities/employee";

import { useEditEmployeeDialogFlow } from "../model/edit-employee.hook";

export function EmployeeEditDialogContainer() {
  // Custom Hook으로 추상화된 비즈니스 로직
  const { isEditOpen, setIsEditOpen, form, handleSubmit } = useEditEmployeeDialogFlow();

  // entities의 컴포넌트
  return <EmployeeEditDialog open={isEditOpen} onOpenChange={setIsEditOpen} form={form} onSubmit={handleSubmit} />;
}
```

1. 비즈니스 로직은 추상화하여 구체적인 동작은 숨겨둔 채로 Custom Hook을 호출합니다.
   - 유지 보수시 이 코드는 수정하지 않아도 됩니다.

2. 핸들러 함수는 UI와 밀접하게 연결된 코드이기 때문에 UI 영역 상단에 위치하여 응집도를 높여줍니다.

3. UI은 엔터티에서 순수하게 UI만 그린 컴포넌트를 호출해서 비즈니스 로직을 주입합니다 (container-presenter 패턴)

### 2. entity와 feature의 역할 경계

각 모델, UI, 훅별로 entity와 feature를 구분하는 것에 가장 세밀한 기준 설정이 요구됩니다.

기본 골자는 다음과 같습니다 :

- feature는 유즈 케이스 관점에서 사용자 시나리오의 동작에 대응한다
- UI는 비즈니스 로직이 추상화가 되어있어야 한다.
- hook은 ui 상태나 사이드 이펙트를 유발하는 동작을 포함한다
- entity는 직접적으로 데이터를 다룬다
  - 외부 라이브러리의 의존성을 가지는 경우 entity 레이어에 격리한다
  - ui는 순수하게 ui만을 그린다 — 비즈니스 로직 ❌, 사이드 이펙트 ❌, 외부 의존성 ❌
    - React 내장 훅 허용 (`useState`, `useRef`, `useMemo`, `useCallback`)
    - 외부 context 훅은 callback props로 대체 (`useNavigate` → `onRowClick` 등)
    - 비즈니스 로직 훅 금지 (`useMutation`, `useQueryClient`, `useAtom` 등)

```typescript
// before
import { useAtom } from "jotai"; // features가 외부 라이브러리 직접 의존

export function EmployeeEditDialogContainer() {
  const [isEditOpen, setIsEditOpen] = useAtom(isEditEmployeeDialogOpenAtom); // 직접 사용
  const [selectedEmployee, setSelectedEmployee] = useAtom(selectedEmployeeAtom);
}
```

이 경우에는 features에서 useAtom에 의존성을 가지며, 만약 다른 상태 라이브러리로 교체를 할 때 이 코드를 수정해야 한다

```ts
// after
import { useSelectedEmployee, useEditEmployeeDialog } from "@/entities/employee";

export const useSelectedEmployee = () => {
  return useAtom(selectedEmployeeAtom); // jotai 구현 숨김
};

export const useEditEmployeeDialog = () => {
  return useAtom(isEditEmployeeDialogOpenAtom); // jotai 구현 숨김
};
```

```ts
import { useSelectedEmployee, useEditEmployeeDialog } from "@/entities/employee";

export function EmployeeEditDialogContainer() {
  const [selectedEmployee, setSelectedEmployee] = useSelectedEmployee(); // 구현이 숨겨져 있음 -> 수정하지 않아도 된다
  const [isEditOpen, setIsEditOpen] = useEditEmployeeDialog();
  const updateMutation = useUpdateEmployeeMutation();

  const handleSubmit = async (data) => {
    if (!selectedEmployee) return;
    await updateMutation.mutateAsync({ employeeId: selectedEmployee.id, params: data });
    setIsEditOpen(false);
  };
}
```

추후 기술 변경할 때나 동작이 바뀔 때 하위 레이어인 entity에서 수정하기만 하면 되도록 추상화

### 3. 단방향 의존성과 추상화 레이어

```typescript
import { DepartmentTreeContainer } from "@/features/department-tree";
import { EmployeeBrowsePanel } from "@/features/employee-browse";
import { CardContent } from "@/shared/ui/card";

export function EmployeeBodyWidget() {
  return (
    <CardContent>
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-4 min-h-[680px]">
        <div className="border rounded-md bg-gray-50 p-2">
          <DepartmentTreeContainer />
        </div>
        <EmployeeBrowsePanel />
      </div>
    </CardContent>
  );
}

```

**의존성 역전 금지**: FSD에서는 하위 레이어에서 상위 레이어를 import하는 의존성 역전을 금지한다

의존성을 역전하지 않도록 하다보면 자연스럽게 단계적인 추상화 레이어 구성이 된다

- 추상화 단계를 고민하는 인지 부하를 감소할 수 있다

### 4. Custom Hook 추상화의 기준

비즈니스 로직을 Custom Hook으로 추상화할 때, 이름보다 중요한 것은 "범위를 어디까지 둘지"에 대한 기준이었습니다.

가장 크게 범위를 잡자면 하나의 컴포넌트에 있는 모든 동작을 하나의 커스텀 훅으로 묶을 수 있습니다.

가장 작게 범위를 잡자면 모든 비즈니스 로직을 파편화하여 개별로 호출합니다.

그 중간의 범위를 잡기 위해 아래의 기준으로 커스텀 훅 범위를 설정했습니다.

1. 유저 시나리오 관점에서 함께 움직이는가?
   - 유저 입장에서 하나의 시나리오라면 우선 함께 묶습니다.
2. 독립적인 관심사가 섞였는가?
   - 각 훅이 서로에게 의존성이 없고 독립적으로 재사용될 수 있으면 분리합니다.
3. 추상화의 실익이 있는가?
   - 파일만 분리하는 추출이 아니라, 구현을 숨겨 변경 비용을 낮추는 추상화인지 확인합니다.

이번 프로젝트에서는 실제로 훅을 만들 때 아래 질문을 반복했습니다.

1. 이 훅이 "하나의 사용자 동작"을 끝까지 책임지는가?
2. 라우팅 책임까지 끌고 들어와서 경계를 흐리지는 않는가?
3. 구현체를 바꿨을 때 사용처 수정 범위를 줄여주는가?

#### 관심사 독립성에 따른 분리

하나의 시나리오 안에서도 재사용 가능성과 변경 주기가 다른 관심사는 분리합니다.

```ts
// src/features/department-tree/model/use-department-tree.ts
function useDepartmentTreeSourceSync() {
  const setDepartmentSource = useSetAtom(departmentSourceAtom);

  const query = useQuery({
    queryKey: departmentQueryKeys.list(),
    queryFn: () => departmentApi.getList(),
  });

  useEffect(() => {
    if (!query.data) return;
    setDepartmentSource(query.data);
  }, [query.data, setDepartmentSource]);
}

function useDepartmentTreeUrlSync(departmentId: number | undefined, setSelectedId: (id: number | null) => void) {
  useEffect(() => {
    if (!departmentId) return;
    setSelectedId(departmentId);
  }, [departmentId, setSelectedId]);
}

function useDepartmentTreeState() {
  const tree = useAtomValue(visibleDepartmentTreeAtom);
  const [search, setSearch] = useAtom(departmentTreeSearchAtom);
  const [selectedId, setSelectedId] = useAtom(selectedDepartmentIdAtom);
  const [expandedIds] = useAtom(expandedDepartmentIdsAtom);
  const toggleExpand = useSetAtom(toggleDepartmentExpandAtom);

  return { tree, search, setSearch, selectedId, setSelectedId, expandedIds, toggleExpand };
}

export function useDepartmentTree() {
  const { params } = useEmployeeSearchParams();
  const state = useDepartmentTreeState();

  useDepartmentTreeSourceSync();
  useDepartmentTreeUrlSync(params.departmentId, state.setSelectedId);

  return state;
}
```

이렇게 분리하면:

- 데이터 fetch, URL 동기화, UI 상태 바인딩의 수정 포인트가 분리됩니다.
- 훅 내부 테스트 경계를 관심사 단위로 나누기 쉬워집니다.
- 상위 컨테이너는 `useDepartmentTree()`만 호출해도 전체 시나리오를 사용할 수 있습니다.

#### 유저 시나리오 단위 오케스트레이션

시나리오 관점에서 함께 움직이는 상태/액션은 훅 하나로 묶고,
그 훅이 "사용자 동작의 시작부터 종료까지"를 책임지도록 두는 방식을 선호했습니다.

예를 들어 직원 편집 시나리오에서는,

- 다이얼로그 상태
- 현재 선택된 직원
- submit 후 invalidate

가 한 덩어리로 움직입니다.

그래서 컨테이너는 세부 구현보다 시나리오 호출만 유지하고,
실제 구현 변경은 feature/model 내부에서 해결하는 방향으로 가져갔습니다.

#### URL/라우팅 책임의 분리

URL과 라우팅은 page의 책임으로 두고, feature는 라우트 구현을 직접 알지 않게 구성했습니다.

```tsx
// src/pages/employee-manager/EmployeeManagerPage.tsx
import { getEmployeeDetailHref } from "@/shared/config/routes";
import { EmployeeBodyWidget } from "@/widgets/employee-manager";

export function EmployeeManagerPage() {
  return <EmployeeBodyWidget toEmployeeDetailHref={getEmployeeDetailHref} />;
}
```

```tsx
// src/features/employee-browse/model/use-employee-browse.ts
type UseEmployeeBrowseParams = {
  toDetailHref: (employeeId: number) => string;
};

export function useEmployeeBrowse({ toDetailHref }: Readonly<UseEmployeeBrowseParams>) {
  const navigate = useNavigate();

  const onSelect = (employee: Employee) => {
    navigate(toDetailHref(employee.id));
  };

  return { onSelect };
}
```

이렇게 하면 route 구조가 바뀌어도 page/route 계층에서만 수정하면 되고, feature의 재사용성과 독립성을 유지할 수 있습니다.

#### 추출과 추상화의 차이

- **추출**: 코드를 파일로 옮기는 것
- **추상화**: 사용처에서 구현 세부사항을 몰라도 되게 만드는 것

커스텀 훅은 구현체 변경 시 사용처를 덜 바꾸기 위한 목적일 때만 유지합니다.

#### 정리

- **유저 시나리오 기반으로 묶되**, 독립적인 시나리오는 억지로 하나로 합치지 않습니다.
- **관심사가 독립적이면 서브훅으로 분리**하여 오케스트레이터 훅이 조합하도록 합니다.
- **URL/라우팅 책임은 page에서 소유**하고 feature에는 값/콜백으로 전달합니다.

### 5. UI 분리의 기준

```ts
function Table({ children })
function TableRow({ children, onClick })
function TableCell({ children })

function EmployeesTable({ employees, onSelect }) {
  return (
    <Table>
      {employees.map(employee => (
        <TableRow key={employee.id} onClick={() => onSelect(employee)}>
          <TableCell>{employee.name}</TableCell>
          <TableCell>{employee.email}</TableCell>
        </TableRow>
      ))}
    </Table>
  );
}
```

1. 단순히 자주 쓸 것 같은 컴포넌트라고 분리하지 않습니다.
   - 다양한 데이터, 인터페이스에 맞추기 위해 컴포넌트가 많은 분기로 복잡도가 높아진다.

2. 컴포넌트를 공통으로 사용(shared)하는 것은 엄격하게 해야한다
   - 모양 뿐 아니라 같은 도메인 같은 인터페이스일 때 공통 컴포넌트화 해야한다.

3. 이런 고민을 해결할 때 FSD 레이어에 맞춰서 한다고 생각하니 더 엄격하게 분리가 가능했다

## 고민

### 1. 라이브러리 선택 기준

1. **커스텀 훅 기반 아키텍처**와의 조화

2. **useState 패턴** 일관성 유지

3. **현대적 React 패턴**과의 시너지

추구해온 현대적 리액트 형태와 가장 호환이 잘되는 조합으로 상태 관리 툴을 선택했습니다

#### jotai

기본적으로는 중앙 store에 모든 상태를 밀어 넣기보다, 상태를 쪼개서 관심사 단위로 다루는 쪽이 컴포넌트 중심의 관심사 분리라는 방향성과 잘 맞았습니다.

- `useState`와 유사한 사용성으로 컨테이너 코드 흐름을 유지하기 쉽고
- atom 단위 구독으로 필요한 상태만 반응시키기 쉽습니다.

복잡한 데이터 관리 흐름에서 특히 Jotai 위주로 가져간 이유는,

- 화면 단위가 아니라 상태 단위(atom)로 책임을 쪼갤 수 있고
- 각 컴포넌트가 필요한 atom만 읽고/쓰도록 만들기 쉽기 때문입니다.

즉, "전역 상태를 한 덩어리로 관리"하기보다 "컴포넌트 관심사에 맞춰 상태를 원자화"해서,
조직도 선택/검색/펼침 같은 서로 다른 관심사를 features와 entities 경계 안에서 분리하기 좋았습니다.

```ts
// src/entities/department/model/department-tree.atom.ts
export const departmentSourceAtom = atom<Department[]>([]); // source
export const selectedDepartmentIdAtom = atom<number | null>(null); // source
export const expandedDepartmentIdsAtom = atom<Set<number>>(new Set<number>()); // source
export const departmentTreeSearchAtom = atom(""); // source

export const visibleDepartmentTreeAtom = atom((get) => {
  // derived
  const tree = get(departmentTreeAtom);
  const keyword = get(departmentTreeSearchAtom).trim().toLowerCase();
  if (!keyword) return tree;

  const filterTree = (nodes: typeof tree): typeof tree => {
    return nodes
      .map((node) => ({ ...node, children: filterTree(node.children) }))
      .filter((node) => node.name.toLowerCase().includes(keyword) || node.children.length > 0);
  };

  return filterTree(tree);
});

export const toggleDepartmentExpandAtom = atom(null, (get, set, id: number) => {
  // action
  const next = new Set(get(expandedDepartmentIdsAtom));
  if (next.has(id)) next.delete(id);
  else next.add(id);
  set(expandedDepartmentIdsAtom, next);
});
```

```ts
// src/features/department-tree/model/use-department-tree.ts
// source sync / url sync / state binding을 분리해서 조합
useDepartmentTreeSourceSync();
const state = useDepartmentTreeState();
useDepartmentTreeUrlSync(params.departmentId, state.setSelectedId);
```

또한 읽기/쓰기 분리를 통해 불필요한 구독을 줄이는 기준도 유지했습니다.

```ts
const tree = useAtomValue(visibleDepartmentTreeAtom); // read
const toggleExpand = useSetAtom(toggleDepartmentExpandAtom); // write
```

#### tanstack query

서버 상태는 결국 "최신성 + 캐시 + 무효화"의 문제라서, 별도 수동 store를 키우기보다 Query 레이어에서 일관되게 관리하는 쪽이 안정적이었습니다.

- 상태를 직접 조작하기보다 query key와 옵션을 선언
- invalidate 기준을 mutation 결과에 맞춰 설정
- stale/gc를 도메인 특성으로 조정

추가적으로 복잡한 흐름에서 상태 위치를 섞지 않기 위해 아래 기준을 같이 적용했습니다.

| 상태 종류      | 소유 레이어       | 이유                                              |
| -------------- | ----------------- | ------------------------------------------------- |
| 서버 상태      | entity query hook | 캐싱/최신성/무효화 정책을 데이터 경계에 두기 위해 |
| 도메인 상태    | entity atom model | 페이지를 넘어 공유되는 선택값/초안 상태이기 때문  |
| 라우트 뷰 상태 | page + URL params | 히스토리/새로고침/공유 링크의 기준이 URL이기 때문 |

```ts
// src/entities/employee/model/employee.query.ts
export const buildEmployeesQuery = (params: EmployeesParams) =>
  queryOptions({
    queryKey: employeeQueryKeys.list(params),
    queryFn: () => employeeApi.getList(params),
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  });

export function useEmployeesQuery(params: EmployeesParams) {
  return useQuery(buildEmployeesQuery(params));
}
```

```ts
// src/features/employee-edit/model/employee.mutation.ts
await queryClient.invalidateQueries({ queryKey: employeeQueryKeys.all });
```

이렇게 나누면 "복잡하니까 상태관리 도구를 하나 더 추가"하는 방향보다,
현재 도구 안에서 책임을 분리하는 쪽이 유지보수성이 더 좋았습니다.

또한 쿼리 재시도는 일괄 숫자 설정보다 에러 성격으로 판단하는 게 더 안전했습니다.

- 네트워크/일시적 서버 오류: 제한적 재시도
- 검증 실패/도메인 규칙 위반/인증 오류: 재시도하지 않음

이 프로젝트에서는 query마다 `retry`를 과하게 커스텀하기보다, 우선 실패를 타입화해서 경계에서 처리하고 필요한 경우에만 정책을 분기하도록 가져갔습니다.

#### URL 파라미터 소유권 기준

페이지에 종속되는 뷰 상태는 URL에 두고, 도메인 상태는 atom에 두는 기준도 함께 유지했습니다.

```ts
// src/entities/employee/model/employee-search-params.ts
export function useEmployeeSearchParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const params: EmployeeSearchParams = {
    limit: Number(searchParams.get("limit") || DEFAULTS.limit),
    skip: Number(searchParams.get("skip") || DEFAULTS.skip),
    search: searchParams.get("search") || undefined,
    departmentId: searchParams.get("departmentId") ? Number(searchParams.get("departmentId")) : undefined,
    status: searchParams.get("status") || undefined,
    sortBy: (searchParams.get("sortBy") as EmployeeSortBy | null) || DEFAULTS.sortBy,
    order: (searchParams.get("order") as SortOrder | null) || DEFAULTS.order,
  };

  const setParams = (next: Partial<EmployeeSearchParams>) => {
    const merged = { ...params, ...next };
    const query = new URLSearchParams();
    Object.entries(merged).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;
      query.set(key, String(value));
    });
    setSearchParams(query);
  };

  return { params, setParams };
}
```

이 방식은 뒤로가기/앞으로가기, 새로고침, URL 공유까지 자연스럽게 가져갈 수 있어서
필터/정렬 같은 route-scoped 상태에는 특히 유리했습니다.

### 2. 런타임 API 검증

```ts
// src/entities/employee/model/employee.schema.ts
export const employeeSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  position: z.string(),
  departmentId: z.number(),
  hireDate: z.string(),
  status: z.enum(["active", "onLeave", "resigned"]),
});
```

신뢰할 수 없는 외부 영역의 정보를 신뢰할 수 있는 애플리케이션 내부로 들여보내기 위해서는 검증이 필요합니다.

API 응답 또한 신뢰할 수 없는 영역의 정보이므로 경계에서 검증해야 합니다.

- **타입 기반 검증**: 컴파일 타임 검증만 제공하므로 런타임 입력 자체를 막지는 못합니다.
- **Zod 검증**: 런타임에서 실제 payload 형태를 검증하고 스펙 이탈을 즉시 감지할 수 있습니다.

여기서 중요한 건 검증을 "한 번만" 하는 게 아니라,
신뢰 경계에서 일관되게 처리하는 방식입니다.

```ts
// src/shared/lib/validate.ts
export const validateSchema = <T extends z.ZodTypeAny>(schema: T, data: unknown, errorMessage: string): z.infer<T> => {
  const result = schema.safeParse(data);

  if (!result.success) {
    throw new ValidationError(errorMessage, result.error.issues);
  }

  return result.data;
};
```

```ts
// src/entities/employee/api/employee.api.ts
async getList(params: EmployeesParams): Promise<EmployeesResponse> {
  const data = await http.get("/employees", { params });
  return validateSchema(employeesResponseSchema, data, "직원 목록 응답 검증 실패");
}
```

즉, 외부 응답은 `safeParse`로 검증하고,
실패 시에는 zod 에러를 그대로 UI로 올리지 않고 앱에서 다루는 에러 타입으로 변환해서 전달합니다.

이렇게 해두면 UI는 "어떤 문구를 보여줄지"에 집중할 수 있고,
검증/분류 로직은 데이터 레이어에 모여서 수정 포인트가 줄어듭니다.

추가로, 검증 실패를 다루는 위치를 고정해두면 동일한 API를 여러 화면에서 쓰더라도
실패 기준이 흔들리지 않습니다.

- API layer: `validateSchema` 호출
- shared validation: `safeParse` + `ValidationError`
- UI layer: 에러 표현만 담당

### 3. 복잡한 상태를 단순하게 유지하는 방법

조직도/직원/근태처럼 상태가 늘어나는 화면에서는,
처음에는 "한 군데로 다 모아서 관리하면 편하지 않을까"라는 생각을 하게 됩니다.

하지만 실제로는 중앙 store를 키우기보다 책임을 먼저 분해하는 편이 안정적이었습니다.

1. entity는 상태 primitive(source/derived/action atom)를 소유
2. feature는 시나리오 오케스트레이션만 담당
3. page는 URL/라우팅 맥락만 소유

이 기준을 지키면 상태가 많아져도 수정 범위가 예측 가능해졌습니다.

특히 "한 화면에서 여러 종류의 상태를 다루는" 상황에서 아래처럼 owner를 분리해 두면,
요구사항이 바뀌었을 때 어디를 고쳐야 하는지가 선명해집니다.

이 기준은 라이브러리 선택 기준에서 정리한 상태 소유권 테이블과 같으며,
실제 코드에서는 `useEmployeesQuery`(서버 상태), `departmentSourceAtom`(도메인 상태), `useEmployeeSearchParams`(라우트 뷰 상태)로 대응됩니다.

### 4. Jotai 원자성(atomic) 활용 기준

원자성의 장점은 "상태를 잘게 나눈다" 자체보다,
필요한 atom만 구독해서 리렌더 범위를 줄일 수 있다는 점입니다.

- source atom: 원본 데이터
- derived atom: 파생 규칙 계산
- action atom: cascade 업데이트

```ts
// src/entities/department/model/department-tree.atom.ts
export const departmentSourceAtom = atom<Department[]>([]); // source
export const departmentTreeAtom = atom((get) => buildDepartmentTree(get(departmentSourceAtom))); // derived
export const selectedDepartmentDescendantsAtom = atom((get) => {
  const selectedId = get(selectedDepartmentIdAtom);
  if (!selectedId) return [] as number[];
  return findDescendantDepartmentIds(get(departmentTreeAtom), selectedId);
});
```

특히 읽기/쓰기 분리(`useAtomValue`, `useSetAtom`)를 적용하면,
setter만 필요한 곳에서 불필요한 구독을 줄일 수 있어 체감 성능이 좋아졌습니다.

### 5. 에러 관리 기준

에러 처리는 "어디서 분류하고 어디서 보여줄지"를 고정하는 게 핵심이었습니다.

- 데이터 레이어: 에러 분류/코드 매핑/재시도 정책 판단
- UI 레이어: 에러 상태 표현(문구, fallback, 버튼)

이 프로젝트에서는 다음 분류를 기본으로 두고 처리했습니다.

- transport/network
- API/protocol
- validation/parse
- domain rule

```ts
// src/shared/lib/errors/error-codes.ts
export const ERROR_CODES = {
  BAD_REQUEST: "BAD_REQUEST",
  NOT_FOUND: "NOT_FOUND",
  UNAUTHORIZED: "UNAUTHORIZED",
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  RESPONSE_PARSE_ERROR: "RESPONSE_PARSE_ERROR",
  NETWORK_ERROR: "NETWORK_ERROR",
  TIMEOUT: "TIMEOUT",
} as const;
```

```ts
// src/shared/lib/errors/errors.ts
export class ApiError extends BaseError {
  readonly statusCode?: number;
  readonly data?: unknown;
}

export class ValidationError extends Error {
  readonly issues: ZodIssue[];
}

export const AppError = {
  isApi: (error: unknown): error is ApiError => error instanceof ApiError,
  isValidation: (error: unknown): error is ValidationError => error instanceof ValidationError,
  fromCode: (code: string, message: string, statusCode?: number, data?: unknown): Error => {
    switch (code) {
      case ERROR_CODES.BAD_REQUEST:
        return new BadRequestError(message, data);
      case ERROR_CODES.NOT_FOUND:
        return new NotFoundError(message);
      default:
        return new ApiError(message, code, statusCode, data);
    }
  },
} as const;
```

이렇게 분리해두면, 동일한 에러 기준을 여러 화면에서 재사용할 수 있고
UI 코드에 저수준 에러 분기(`if status === 401`)가 퍼지는 걸 막을 수 있었습니다.

추가로, 에러를 소비하는 UI 레벨에서는 선언적 패턴으로 처리합니다.

- **예상 가능한 에러** (400, 404, 409): 다이얼로그 내부에 인라인 에러 배너로 표시
- **예상 불가능한 에러** (네트워크, 5xx): `MutationCache.onError`에서 전역 토스트로 표시
- **mutation flow**: `mutateAsync` + close-on-success 패턴으로 성공 시에만 다이얼로그를 닫고, 실패 시 에러를 다이얼로그 안에서 확인 가능
- **stale error 방지**: 다이얼로그가 열릴 때 `mutation.reset()`으로 이전 에러 초기화

### 6. 페이지네이션 깜빡임 방지

페이지 전환 시 이전 데이터가 사라지면서 빈 화면이 깜빡이는 문제를
`placeholderData`로 해결했습니다.
새 데이터가 도착하기 전까지 이전 데이터를 유지하고,
`isFetching` 상태로 전환 중임을 표현하는 방식입니다.

### 7. navigate 전 prefetch

목록에서 상세로 이동할 때, navigate 직전에 `prefetchQuery`를 fire-and-forget으로 호출합니다.
`queryOptions` 패턴으로 쿼리 설정을 한 곳에서 관리하면
prefetch와 useQuery가 동일 설정을 재사용할 수 있어서 일관성이 유지됩니다.

### 8. 읽기/쓰기 구독 분리

`useAtom`으로 읽기/쓰기를 함께 구독하면, setter를 안 쓰는 곳에서도 불필요한 리렌더가 발생합니다.
entity hook에 `useAtomValue` 기반의 read-only 훅을 분리하여
setter가 필요 없는 feature에서는 읽기 전용 구독만 유지하도록 했습니다.

### 9. 비동기 대기 전략

다이얼로그 mutation에서 `await mutateAsync` 대신 `mutate`(fire-and-forget)를 사용했습니다.
서버 응답을 기다리지 않고 즉시 닫히므로 UX 반응성이 향상되고,
에러는 `onError` 콜백에서 롤백 처리합니다.

### 10. 번들 청크 최적화

단일 vendor 청크가 500KB를 초과하여 `manualChunks`로 라이브러리별 독립 청크를 분리했습니다.
변경 빈도가 다른 코드를 같은 파일에 넣으면 한 줄 고쳐도 전체를 다시 받아야 하므로,
react, query, form, jotai, zod, icons를 독립 청크로 분리하여 캐시 히트율을 높였습니다.

### 11. Entity Hook 래핑과 직접 Atom Export의 트레이드오프

이 프로젝트를 진행하면서 entity 레이어에서 atom을 다루는 방식에 일관성이 없다는 걸 발견했습니다.

employee와 attendance는 `*.hook.ts`에서 atom을 래핑하여 jotai 의존성을 숨기지만,
department는 atom을 barrel export에서 직접 노출하여 feature가 `useAtom`, `useAtomValue`, `useSetAtom`을 직접 호출합니다.

#### Employee/Attendance 패턴: Hook 래핑

```ts
// src/entities/employee/model/employee.hook.ts
export function useSelectedEmployee(): [Employee | null, (employee: Employee | null) => void] {
  return useAtom(selectedEmployeeAtom);
}

export function useSelectedEmployeeValue(): Employee | null {
  return useAtomValue(selectedEmployeeAtom);
}
```

```ts
// src/entities/employee/index.ts
export { useSelectedEmployee, useSelectedEmployeeValue } from "./model/employee.hook";
```

이 방식의 장점은 명확합니다.

- feature에서 jotai를 직접 import하지 않음
- 상태 라이브러리를 다른 것으로 교체할 때 entity hook만 수정하면 됨
- 구현 세부사항이 완전히 숨겨짐

#### Department 패턴: Atom 직접 Export

```ts
// src/entities/department/index.ts
export {
  departmentSourceAtom,
  selectedDepartmentIdAtom,
  expandedDepartmentIdsAtom,
  departmentTreeSearchAtom,
  visibleDepartmentTreeAtom,
  toggleDepartmentExpandAtom,
  selectDepartmentAtom,
} from "./model/department-tree.atom";
```

```ts
// src/features/department-tree/model/use-department-tree.ts
const tree = useAtomValue(visibleDepartmentTreeAtom);
const [search, setSearch] = useAtom(departmentTreeSearchAtom);
const toggleExpand = useSetAtom(toggleDepartmentExpandAtom);
```

이 방식은 feature가 jotai에 직접 의존하지만,
department atom 그래프 자체가 도메인 로직을 표현하고 있습니다.

#### 왜 이 차이가 정당한지

처음에는 "일관성을 위해 department도 hook으로 래핑해야 하나"라고 생각했습니다.

하지만 실제로 department를 hook으로 감싸면 어떻게 될지 생각해보니,
7~8개 atom 각각에 대해 다음과 같은 pass-through 래퍼가 늘어나게 됩니다.

```ts
// 이렇게 되면 너무 많은 래퍼가 생김
export function useDepartmentSource() {
  return useAtomValue(departmentSourceAtom);
}
export function useSelectedDepartmentId() {
  return useAtom(selectedDepartmentIdAtom);
}
export function useExpandedDepartmentIds() {
  return useAtom(expandedDepartmentIdsAtom);
}
export function useDepartmentTreeSearch() {
  return useAtom(departmentTreeSearchAtom);
}
export function useVisibleDepartmentTree() {
  return useAtomValue(visibleDepartmentTreeAtom);
}
export function useToggleDepartmentExpand() {
  return useSetAtom(toggleDepartmentExpandAtom);
}
export function useSelectDepartment() {
  return useSetAtom(selectDepartmentAtom);
}
```

이 래퍼들은 구현을 숨기는 추상화가 아니라 단순 이름 변경에 가깝습니다.

더 중요한 건, feature orchestration hook(`useDepartmentTree`)이 이미 atom 조합을 캡슐화하고 있다는 점입니다.

```ts
// src/features/department-tree/model/use-department-tree.ts
export function useDepartmentTree() {
  const { params } = useEmployeeSearchParams();
  const state = useDepartmentTreeState(); // atom 조합을 여기서 캡슐화

  useDepartmentTreeSourceSync();
  useDepartmentTreeUrlSync(params.departmentId, state.setSelectedId);

  return state;
}
```

feature 레이어에서 이미 atom 조합을 오케스트레이션하고 있으므로,
entity hook 래핑의 실익이 적었습니다.

#### 기준 정리

이 경험을 통해 다음과 같은 기준을 세웠습니다.

**Hook 래핑이 유리한 경우:**

- atom이 단순함 (다이얼로그 open/close, 단일 선택값)
- 여러 feature에서 동일한 방식으로 사용됨
- 상태 라이브러리 교체 가능성이 높음

**Atom 직접 Export가 유리한 경우:**

- atom 그래프가 복잡함 (source/derived/action 조합)
- feature orchestration에서 직접 조합해야 함
- entity 레이어에서 이미 도메인 로직을 표현하고 있음

핵심은 "추상화의 실익이 있는가"입니다.

단순히 "구현을 숨기기 위해" hook을 만드는 것보다,
"변경 비용을 줄이거나 재사용성을 높이는" 추상화만 유지하는 게 더 실용적이었습니다.

이 프로젝트에서는 employee/attendance처럼 단순한 상태는 hook으로 래핑하고,
department처럼 복잡한 atom 그래프는 직접 export하는 방식으로 가져갔습니다.

### 12. 스펙 기반 개발과 의존성 탐색

이 프로젝트를 진행하면서 코드와 요구사항이 분리되면 자연스럽게 드리프트가 생긴다는 걸 경험했습니다.

기능을 추가할 때마다 "이게 정확히 뭐였더라"를 다시 찾아야 했고,
변경 영향도를 파악할 때 "어떤 화면이 이 데이터를 쓰지"를 일일이 grep해야 했습니다.

이 문제를 해결하기 위해 `specs/` 폴더에 스펙 문서를 코드 옆에 두기로 했습니다.

#### 스펙 문서를 코드 옆에 두는 이유

vineyard_backoffice 프로젝트에서 본 패턴을 참고했는데,
스펙 파일에 frontmatter(id, doc_type, depends_on)를 두면 기계적으로 탐색할 수 있다는 게 핵심이었습니다.

```markdown
---
id: Employee
title: "직원"
doc_type: data
source: manual
depends_on: [Department]
tags: ["employee", "직원", "인사", "관리"]
---

### 직원

- **목적**

직원의 기본 정보를 관리한다.

- **핵심 필드**

- `id` — 고유 식별자
- `name` — 직원명
- `email` — 이메일 (로그인/연락용)
- `phone` — 전화번호
- `position` — 직급/직책
- `departmentId` — 소속 부서 ID (FK → Department)
- `hireDate` — 입사일
- `status` — 재직 상태 (`active` | `onLeave` | `resigned`)
```

이렇게 frontmatter를 두면 스펙 간 의존성을 명시적으로 관리할 수 있고,
나중에 자동화 도구가 이 정보를 읽어서 정합성을 검증할 수 있습니다.

#### TOON 포맷 인덱스의 장점

`specs/SPEC-INDEX.md`에서 전체 스펙을 한눈에 검색할 수 있도록 TOON 포맷으로 정리했습니다.

```markdown
specs[15]{path,id,type,deps,status,desc}:
data-definition/department.md,Department,data,[],stable,부서;조직도;트리;자기참조
data-definition/employee.md,Employee,data,[Department],stable,직원;기본;정보;관리
data-definition/attendance.md,Attendance,data,[Employee],stable,근태;출퇴근;기록;관리
feature-definition/1-1-직원-목록-조회.md,1-1-직원-목록-조회,feature,[Employee,Department],stable,직원;목록;검색;필터;정렬
feature-definition/1-2-직원-상세-조회.md,1-2-직원-상세-조회,feature,[Employee,Attendance],stable,직원;상세;근태;이력
...
screen-definition/EMP-MANAGER.md,EMP-MANAGER,screen,[1-1-직원-목록-조회,4-1-부서-트리-조회],stable,직원;관리;메인;화면
```

이 포맷의 장점은:

- 전체 스펙을 한 파일에서 검색 가능
- 각 스펙의 ID, 타입, 의존성, 상태를 컬럼으로 구조화
- 에이전트나 자동화 도구가 파싱하기 쉬운 형태
- 새 스펙 추가 시 한 줄만 추가하면 인덱스 갱신 완료

#### 의존성 그래프의 역할

`specs/dependency-graph.json`에서 스펙 간 의존 관계를 명시적으로 관리합니다.

```json
{
  "nodes": [
    { "id": "Employee", "file": "data-definition/employee.md", "doc_type": "data" },
    { "id": "Attendance", "file": "data-definition/attendance.md", "doc_type": "data" }
  ],
  "edges": [
    { "from": "Employee", "to": "Department", "confidence": "high" },
    { "from": "Attendance", "to": "Employee", "confidence": "high" },
    { "from": "1-1-직원-목록-조회", "to": "Employee", "confidence": "high" },
    { "from": "1-1-직원-목록-조회", "to": "Department", "confidence": "high" }
  ]
}
```

이 그래프를 통해:

- Employee 필드가 바뀌면 어떤 feature와 화면이 영향받는지 추적 가능
- 부서 삭제 정책을 바꾸면 Attendance까지 연쇄적으로 영향받는 범위를 파악 가능
- 새 기능 추가 시 기존 스펙과의 의존성을 명시적으로 선언

#### 3계층 스펙 구조

스펙을 3계층으로 나누어 관리합니다.

**data-definition**: 엔티티 데이터 계약

- 필드 정의, FK 관계, 운영 규칙
- 예: Employee는 Department를 참조하고, 삭제하지 않으며 상태로 관리

**feature-definition**: 기능 단위 정의

- 유저 시나리오, 입출력, 구현 참조
- 예: "1-1-직원-목록-조회"는 Employee와 Department를 조회하고, 검색/필터/정렬 지원

**screen-definition**: 화면 단위 정의

- 레이아웃, 구성 컴포넌트, 접근 역할
- 예: EMP-MANAGER는 "1-1-직원-목록-조회"와 "4-1-부서-트리-조회" 기능을 조합

이 계층 구조를 유지하면 변경 영향도를 계층별로 추적할 수 있습니다.

#### 코드와 스펙의 정합성

스펙 문서를 코드 옆에 두면 정합성 검증이 가능해집니다.

예를 들어, Employee 스펙에서 정의한 필드:

```markdown
- `id` — 고유 식별자
- `name` — 직원명
- `email` — 이메일
- `phone` — 전화번호
- `position` — 직급/직책
- `departmentId` — 소속 부서 ID (FK → Department)
- `hireDate` — 입사일
- `status` — 재직 상태 (`active` | `onLeave` | `resigned`)
```

이것이 실제 zod 스키마와 일치하는지 확인할 수 있습니다.

```ts
// src/entities/employee/model/employee.schema.ts
export const employeeSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  position: z.string(),
  departmentId: z.number(),
  hireDate: z.string(),
  status: z.enum(["active", "onLeave", "resigned"]),
});
```

또한 feature-definition의 구현 참조가 실제 feature 폴더와 대응하는지도 확인할 수 있습니다.

앞으로 이 정보를 바탕으로 자동 정합성 검증(LINT-REPORT 같은)으로 확장할 수 있습니다.

#### 스펙 기반 개발의 실익

이 방식을 도입한 결과:

- 새 기능 추가 시 먼저 스펙을 작성하고 의존성을 선언
- 코드 리뷰 시 "이 변경이 어떤 스펙을 영향시키는가"를 명확하게 파악
- 팀원이 프로젝트에 합류했을 때 스펙 인덱스에서 전체 구조를 빠르게 이해 가능
- 요구사항 변경 시 영향받는 스펙과 코드를 체계적으로 추적

특히 "이 필드를 삭제해도 되나"라는 질문이 생겼을 때,
의존성 그래프에서 즉시 "Attendance가 이 필드를 참조하니까 안 된다"는 답을 얻을 수 있었습니다.

이 프로젝트에서는 스펙을 수동으로 관리하고 있지만,
향후 Notion 동기화나 자동 생성으로 확장할 수 있는 기반을 마련했습니다.

### 13. 테스트 전략과 검증 경계

테스트를 작성하면서 가장 먼저 부딪힌 질문은 "무엇을 테스트하고 무엇을 테스트하지 않을지"였습니다.

처음에는 커버리지를 높이는 방향으로 접근했는데,
막상 작성하다 보니 이미 TypeScript 컴파일러와 Zod 스키마가 검증하고 있는 내용을
테스트로 다시 확인하는 경우가 생겼습니다.
이 중복을 줄이는 것이 테스트 전략의 핵심이었습니다.

TypeScript와 Zod가 빌드 타임에 이미 검증하는 영역(스키마 매칭, 타입 계약, import 경계)은 테스트에서 제외하고,
런타임에서만 확인할 수 있는 영역에 집중했습니다.

- **단위테스트**: 순수 함수의 동작 정확성 (트리 변환, 텍스트 분할, 에러 분류)
- **통합테스트**: atom 파생 체인의 연쇄 동작, API 경계에서의 에러 변환 체인

테스트 파일은 FSD co-location 원칙에 따라 각 세그먼트 안에 `spec/` 폴더를 두어 배치했습니다.
파일 이동 시 테스트도 함께 이동하고, 세그먼트 삭제 시 테스트도 함께 삭제되어
소스와 테스트 사이의 드리프트가 생기지 않습니다.

"테스트를 많이 작성하는 것"보다 "검증 도구별 역할을 나누는 것"이 유지보수에 더 효과적이었습니다.

### 14. 서버 SSOT와 클라이언트 도메인 로직의 경계

HR 서비스의 프론트엔드를 개발하면서 가장 중요한 판단 중 하나는 "도메인 로직을 어디서 실행할 것인가"였습니다.

급여 계산, 상태 전이, 권한 정책처럼 복잡한 도메인에서는 프론트가 도메인 규칙을 직접 판단하지 않고,
서버 응답을 해석하여 UI로 전환하는 것이 원칙입니다.
서버가 단일 진실 공급원(Single Source of Truth)으로서 도메인 계산을 수행하고,
클라이언트는 그 결과를 받아 렌더링에만 집중하는 구조입니다.

#### 현재 프로젝트에서 클라이언트가 수행하는 도메인 계산

이 프로젝트에서는 두 가지 도메인 계산을 클라이언트에서 직접 수행하고 있습니다.

1. **flat 부서 배열 → 트리 구조 변환** (`buildDepartmentTree`)
2. **선택 부서의 하위 부서 ID 계산 → 직원 필터링** (`findDescendantDepartmentIds` + `selectedDepartmentDescendantsAtom`)

```ts
// 1. 서버에서 flat 배열을 받아 클라이언트가 트리로 변환
export const departmentTreeAtom = atom((get) => {
  return buildDepartmentTree(get(departmentSourceAtom));
});

// 2. 선택 부서의 하위 부서를 클라이언트가 계산하여 직원 목록 필터링에 사용
export const selectedDepartmentDescendantsAtom = atom((get) => {
  const selectedId = get(selectedDepartmentIdAtom);
  if (!selectedId) return [];
  return findDescendantDepartmentIds(get(departmentTreeAtom), selectedId);
});
```

이 파생 atom들은 `useDepartmentTree()`를 통해 feature 레이어에 노출되고,
`useEmployeeListQuery()`에서 `selectedDescendants`를 `departmentIds`로 전달하는 방식으로 직원 필터링에 활용됩니다.

#### 왜 실제 서비스에서는 서버가 이 계산을 담당해야 하는지

실제 HR 서비스에서는 이 로직을 서버가 수행해야 하는 이유가 명확합니다.

**데이터 의존성 일관성**: 부서 트리 구조가 바뀌면 급여, 근태, 평가에 연쇄적으로 영향을 줍니다.
서버가 계산을 담당해야 여러 도메인에 걸친 정합성이 깨지지 않습니다.

**정책 변화 흡수**: 부서 이동이나 조직 개편은 정책적 결정입니다.
프론트가 트리를 재구성하면 정책이 바뀔 때마다 클라이언트 코드를 수정해야 합니다.

**서버 계약 모델**: 이상적으로는 서버가 `allowedActions`, `capabilities` 같은 계약을 응답에 포함하고,
프론트는 "해석과 렌더링"만 담당하는 구조가 됩니다.

서버가 트리를 직접 내려주는 구조로 전환하면 클라이언트 코드는 다음처럼 단순해집니다.

```ts
// Before: 클라이언트가 도메인 계산
const departmentTreeAtom = atom((get) => buildDepartmentTree(get(departmentSourceAtom)));
const selectedDepartmentDescendantsAtom = atom((get) => {
  return findDescendantDepartmentIds(get(departmentTreeAtom), get(selectedDepartmentIdAtom));
});

// After: 서버가 트리를 내려주면 클라이언트는 저장만
const departmentTreeSourceAtom = atom<DepartmentTreeNode[]>([]); // 서버 응답 그대로
// 직원 필터링도 departmentId 하나만 보내면 서버가 하위까지 포함하여 처리
```

#### 현재 구조가 전환에 유연한 이유

이 프로젝트의 구조는 서버 주도로 전환할 때 수정 범위가 예측 가능하도록 설계되어 있습니다.

**도메인 계산이 entity 레이어에 격리되어 있습니다.**
`buildDepartmentTree`와 `findDescendantDepartmentIds`는 `entities/department/model`에만 존재합니다.
서버로 이전해도 feature, widget, page는 수정할 필요가 없습니다.

**atom 파생 체인이 명확합니다.**
source → derived → action 구조가 일관적이라서,
source의 데이터 형태만 바꾸면(flat 배열 → 트리) 나머지 체인이 자연스럽게 따라옵니다.

**API 경계의 Zod 검증이 변경을 잡아줍니다.**
서버 응답 형태가 바뀌면 스키마만 수정하면 되고,
타입 시스템이 나머지 영향 범위를 컴파일 타임에 알려줍니다.

**feature orchestration이 atom 조합을 캡슐화하고 있습니다.**
`useDepartmentTree()`가 내부 atom 조합을 숨기고 있으므로,
내부 구현이 바뀌어도 이 훅을 사용하는 컨테이너는 영향을 받지 않습니다.

#### 정리

이 프로젝트에서는 의도적으로 클라이언트에서 도메인 계산을 수행했습니다.

트리 변환, 의존성 계산, atom 파생 체인처럼 복잡한 로직을 다룰 수 있다는 것을 보여주면서도,
실제 서비스에서는 이 로직이 서버로 가야 한다는 점을 인지하고 있습니다.

중요한 건 "할 줄 아는가"와 "어디서 해야 하는지 아는가"가 별개라는 점입니다.
이 프로젝트는 둘 다를 보여주기 위해 클라이언트에 도메인 로직을 두되,
전환 가능한 구조를 유지하는 방향으로 설계했습니다.
