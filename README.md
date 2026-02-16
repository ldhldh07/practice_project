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
│       ├── layout.tsx               # 전체 레이아웃
│       └── query-provider.tsx       # TanStack Query 설정
│
├── pages/                           # 페이지 컴포넌트
│   └── employee-manager-page.tsx    # 직원 관리 페이지
│
├── widgets/                         # 페이지 구성 단위
│   └── employee-manager/ui/
│       ├── employee-body-widget.tsx    # 본문 위젯
│       ├── employee-dialogs-widget.tsx # 다이얼로그 위젯
│       └── employee-header-widget.tsx  # 헤더 위젯
│
├── features/                        # 사용자 시나리오 (비즈니스 로직)
│   ├── department-tree/             # 부서 트리 기능
│   ├── employee-filter/             # 직원 필터/검색 기능
│   ├── employee-load/               # 직원 로딩 기능
│   ├── employee-edit/               # 직원 편집 기능
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
│   │   └── ui/                      # 순수 UI 컴포넌트
│   └── attendance/                  # 근태 엔티티
│
└── shared/                          # 공통 유틸리티
    ├── api/client.ts                # HTTP 클라이언트
    ├── lib/
    │   ├── validate.ts              # API 검증 유틸
    │   ├── errors/                  # 에러 코드/타입
    │   └── form-handler.ts          # 폼 핸들러 유틸
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
  - ui는 순수하게 ui만을 그린다

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

## 기타 고민

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
// src/features/employee-load/model/employee-load.query.ts
export const buildEmployeesQuery = (params: EmployeesParams) =>
  queryOptions({
    queryKey: employeeQueryKeys.list(params),
    queryFn: () => employeeApi.getList(params),
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  });
```

```ts
// src/features/employee-load/model/employees.query.ts
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
// src/features/employee-filter/model/employee-search-params.ts
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

## 추가 고민

### 1. 복잡한 상태를 단순하게 유지하는 방법

조직도/직원/근태처럼 상태가 늘어나는 화면에서는,
처음에는 "한 군데로 다 모아서 관리하면 편하지 않을까"라는 생각을 하게 됩니다.

하지만 실제로는 중앙 store를 키우기보다 책임을 먼저 분해하는 편이 안정적이었습니다.

1. entity는 상태 primitive(source/derived/action atom)를 소유
2. feature는 시나리오 오케스트레이션만 담당
3. page는 URL/라우팅 맥락만 소유

이 기준을 지키면 상태가 많아져도 수정 범위가 예측 가능해졌습니다.

특히 "한 화면에서 여러 종류의 상태를 다루는" 상황에서 아래처럼 owner를 분리해 두면,
요구사항이 바뀌었을 때 어디를 고쳐야 하는지가 선명해집니다.

| 상태 종류      | 소유자                       | 실제 코드                                          |
| -------------- | ---------------------------- | -------------------------------------------------- |
| 서버 상태      | Query Hook                   | `useEmployeesQuery`                                |
| 도메인 상태    | Atom Model                   | `departmentSourceAtom`, `selectedDepartmentIdAtom` |
| 라우트 뷰 상태 | URL Params + Page/Feature DI | `useEmployeeSearchParams`, `toDetailHref` 주입     |

### 2. Jotai 원자성(atomic) 활용 기준

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

### 3. 에러 관리 기준

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

### 4. 페이지네이션 깜빡임 방지 (placeholderData)

페이지 전환 시 이전 데이터가 사라지면서 화면이 깜빡이는 문제가 있었습니다.

사용자가 다음 페이지로 넘어갈 때마다 빈 화면이 잠깐 보이는 건 UX 측면에서 좋지 않았고,
특히 필터/정렬을 바꿀 때마다 목록이 사라졌다 나타나는 게 불안정해 보였습니다.

이 문제는 `keepPreviousData`를 `placeholderData`로 전달해서 해결했습니다.

새 데이터가 도착하기 전까지 이전 데이터를 유지하면서,
로딩 상태는 `isLoading`이 아니라 `isFetching`으로 표현할 수 있어서
사용자는 데이터가 바뀌는 중이라는 걸 인지하면서도 빈 화면을 보지 않게 됩니다.

```ts
// src/features/employee-load/model/employee-load.query.ts
export const buildEmployeesQuery = (params: EmployeesParams) =>
  queryOptions({
    queryKey: employeeQueryKeys.list(params),
    queryFn: () => employeeApi.getList(params),
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  });
```

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

이렇게 하면 `queryOptions`로 쿼리 설정을 분리하고,
사용처에서 `placeholderData`만 추가하는 방식으로 깜빡임을 방지할 수 있었습니다.

### 5. navigate 전 prefetch

목록에서 상세로 이동할 때 데이터 로딩 대기 시간을 제거하고 싶었습니다.

사용자가 직원을 클릭하면 상세 페이지로 이동하는데,
이동 후에 데이터를 fetch하면 로딩 스피너가 보이는 시간이 생깁니다.

이 문제는 `prefetchQuery`를 navigate 전에 호출해서 해결했습니다.

```ts
// src/features/employee-load/model/employee-load.query.ts
export const buildEmployeeDetailQuery = (employeeId: number) =>
  queryOptions({
    queryKey: employeeQueryKeys.detail(employeeId),
    queryFn: () => employeeApi.getById(employeeId),
    enabled: employeeId > 0,
  });
```

```ts
// src/features/employee-browse/model/use-employee-browse.ts
const onSelect = (employee: Employee) => {
  setSelectedEmployee(employee);
  queryClient.prefetchQuery(buildEmployeeDetailQuery(employee.id));
  navigate(toDetailHref(employee.id));
};
```

`queryOptions` 패턴으로 쿼리 설정을 한 곳에서 관리하면,
prefetch와 useQuery가 동일 설정을 재사용할 수 있어서 일관성이 유지됩니다.

`prefetchQuery`는 fire-and-forget으로 호출하고 즉시 navigate하면,
상세 페이지 도착 시 캐시에 데이터가 이미 있으므로 즉시 렌더링됩니다.

### 6. 읽기/쓰기 구독 분리 심화

기존에 `useAtom`으로 읽기/쓰기를 함께 구독하던 곳에서,
읽기만 필요한 곳은 `useAtomValue`로 전환했습니다.

`const [value] = useAtom(atom)` 패턴은 구조분해만 했을 뿐 여전히 write도 구독하므로 리렌더가 발생합니다.

이 문제를 해결하기 위해 entity hook에 read-only 전용 훅을 추가했습니다.

```ts
// src/entities/employee/model/employee.hook.ts
// 기존: 읽기/쓰기 함께
export function useSelectedEmployee(): [Employee | null, (employee: Employee | null) => void] {
  return useAtom(selectedEmployeeAtom);
}

// 추가: 읽기 전용
export function useSelectedEmployeeValue(): Employee | null {
  return useAtomValue(selectedEmployeeAtom);
}
```

```ts
// src/features/employee-edit/model/edit-employee.hook.ts
// before: const [selectedEmployee] = useSelectedEmployee(); // write도 구독
// after:
const selectedEmployee = useSelectedEmployeeValue(); // read만 구독
```

이 패턴을 6개 feature 파일에 적용했고,
setter가 필요 없는 곳에서는 불필요한 구독을 제거할 수 있었습니다.

### 7. 비동기 대기 전략 (fire-and-forget)

optimistic update가 있는 mutation에서 `await mutateAsync` 대신 `mutate`를 사용했습니다.

다이얼로그가 서버 응답을 기다리지 않고 즉시 닫히면 UX 반응성이 향상됩니다.

에러 발생 시 `onError` 콜백에서 롤백 처리하면 되므로,
사용자는 빠른 피드백을 받으면서도 실패 케이스를 놓치지 않습니다.

```ts
// src/features/employee-edit/model/edit-employee.hook.ts
// before
const handleSubmit = createModalFormHandler(form, async (data) => {
  await updateMutation.mutateAsync({ employeeId: selectedEmployee.id, params: data });
  setIsEditOpen(false);
});

// after
const handleSubmit = form.handleSubmit((data) => {
  if (!selectedEmployee) return;
  updateMutation.mutate({ employeeId: selectedEmployee.id, params: data });
  setIsEditOpen(false);
});
```

`form.handleSubmit` 콜백 안에서 `mutate` + 즉시 close/reset 패턴을 사용하면,
사용자는 제출 후 바로 다음 작업을 이어갈 수 있어서 체감 속도가 빨라졌습니다.

### 8. 번들 청크 최적화

Vite 빌드 시 단일 vendor 청크가 500KB를 초과하는 경고가 발생했습니다.

`manualChunks`로 라이브러리별 독립 청크를 분리하면,
라이브러리 업데이트 시 해당 청크만 캐시 무효화되므로 사용자 재다운로드가 최소화됩니다.

```ts
// vite.config.ts
build: {
  rollupOptions: {
    output: {
      manualChunks: (id) => {
        if (id.includes("node_modules/react/") || id.includes("node_modules/react-dom/")) {
          return "vendor-react";
        }
        if (id.includes("node_modules/@tanstack/react-query/")) {
          return "vendor-query";
        }
        if (id.includes("node_modules/react-hook-form/") || id.includes("node_modules/@hookform/resolvers/")) {
          return "vendor-form";
        }
        if (id.includes("node_modules/jotai/")) {
          return "vendor-jotai";
        }
        if (id.includes("node_modules/zod/")) {
          return "vendor-zod";
        }
        if (id.includes("node_modules/lucide-react/")) {
          return "vendor-icons";
        }
        if (id.includes("node_modules/")) {
          return "vendor";
        }
      },
    },
  },
},
```

이렇게 분리한 결과 최대 청크 크기가 502KB에서 220KB로 감소했고,
React나 Query 같은 안정적인 라이브러리는 캐시 히트율이 높아져서
배포 후 사용자 로딩 시간이 줄어들었습니다.

### 9. 시맨틱 HTML 태그 적용

시맨틱 태그는 시각적으로는 `<div>`와 차이가 없지만,
스크린 리더와 검색 엔진이 페이지 구조를 이해하는 데 도움을 줍니다.

이번 프로젝트에서는 접근성과 SEO를 고려해 10개 파일에서 `<div>`를 시맨틱 태그로 교체했습니다.

#### 1. Form 다이얼로그: `<form>` 래핑

```tsx
// src/shared/ui/form-dialog.tsx
// before
<div>
  <DialogHeader>...</DialogHeader>
  <div className="grid gap-4 py-4">{children}</div>
  <DialogFooter>
    <Button type="submit">저장</Button>
  </DialogFooter>
</div>

// after
<form onSubmit={handleSubmit}>
  <DialogHeader>...</DialogHeader>
  <div className="grid gap-4 py-4">{children}</div>
  <DialogFooter>
    <Button type="submit">저장</Button>
  </DialogFooter>
</form>
```

`<form>` 태그로 감싸면 Enter 키 제출이 자동으로 동작하고,
브라우저 내장 폼 검증 기능도 활용할 수 있어서 UX가 개선됩니다.

#### 2. 검색 필터: `<search>` 랜드마크

```tsx
// src/entities/employee/ui/employee-filter.tsx
// before
<div className="flex gap-2">
  <Input placeholder="이름, 이메일, 전화번호로 검색" />
  <Select>...</Select>
</div>

// after
<search className="flex gap-2">
  <Input placeholder="이름, 이메일, 전화번호로 검색" />
  <Select>...</Select>
</search>
```

`<search>` 태그는 스크린 리더가 검색 영역임을 인식하도록 도와줍니다.

#### 3. 레이아웃 구조: `<aside>` + `<section>`

```tsx
// src/widgets/employee-manager/ui/employee-body-widget.tsx
// before
<div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-4">
  <div className="border rounded-md">
    <DepartmentTreeContainer />
  </div>
  <div>
    <EmployeeBrowsePanel />
  </div>
</div>

// after
<div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-4">
  <aside className="border rounded-md">
    <DepartmentTreeContainer />
  </aside>
  <section>
    <EmployeeBrowsePanel />
  </section>
</div>
```

`<aside>`는 사이드바 영역을, `<section>`은 메인 콘텐츠 영역을 명시적으로 표현합니다.

#### 4. 페이지네이션: `<nav>` + `aria-label`

```tsx
// src/shared/ui/pagination.tsx
// before
<div className="flex items-center gap-2">
  <Button>이전</Button>
  <Button>다음</Button>
</div>

// after
<nav aria-label="페이지 이동" className="flex items-center gap-2">
  <Button>이전</Button>
  <Button>다음</Button>
</nav>
```

`<nav>` 태그는 네비게이션 랜드마크로 인식되고,
`aria-label`은 스크린 리더에 "페이지 이동" 컨텍스트를 제공합니다.

#### 5. 텍스트 콘텐츠: `<p>` + `<span>`

```tsx
// before
<div className="text-center text-muted-foreground">데이터가 없습니다</div>

// after
<p className="text-center text-muted-foreground">데이터가 없습니다</p>
```

텍스트 블록은 `<p>`, 인라인 요소는 `<span>`으로 구분하면
문서 구조가 명확해지고 스타일 적용 의도도 분명해집니다.

이렇게 시맨틱 태그를 적용한 결과,
화면 렌더링은 동일하지만 접근성 도구와 검색 엔진이 페이지 구조를 더 정확하게 파악할 수 있게 되었습니다.

### 10. Container-Presenter 패턴과 핸들러 prop 의미론

프로젝트 전반에 Container-Presenter 패턴을 적용했지만,
코드 리뷰 중 직원 상세 패널과 다이얼로그에서 동일한 버튼 구조가 중복된 걸 발견했습니다.

두 곳 모두 "직원 정보 수정", "근태 추가", "선택 근태 수정" 버튼을 인라인으로 렌더링하고 있었고,
각각 `setIsEditEmployeeOpen(true)` 같은 setter 호출을 직접 포함하고 있었습니다.

이 문제를 해결하기 위해 `EmployeeActionBar` entity presenter를 추출했습니다.

#### Before: 인라인 버튼 중복

```tsx
// src/features/employee-detail/ui/employee-detail-panel.tsx (before)
<div className="flex gap-2">
  <Button variant="outline" size="sm" onClick={() => setIsEditEmployeeOpen(true)}>
    <Pencil />
    직원 정보 수정
  </Button>
  <Button variant="outline" size="sm" onClick={() => setIsAddAttendanceOpen(true)}>
    <Plus />
    근태 추가
  </Button>
  <Button variant="outline" size="sm" disabled={!selectedAttendance} onClick={() => setIsEditAttendanceOpen(true)}>
    <Pencil />
    선택 근태 수정
  </Button>
</div>
```

이 코드는 다이얼로그 컨테이너에도 거의 동일하게 존재했습니다.

#### After: Entity Presenter 추출

```tsx
// src/entities/employee/ui/employee-action-bar.tsx
type EmployeeActionBarProps = {
  onEditEmployee: () => void;
  onAddAttendance: () => void;
  onEditAttendance: () => void;
  canEditAttendance: boolean;
};

export function EmployeeActionBar({
  onEditEmployee,
  onAddAttendance,
  onEditAttendance,
  canEditAttendance,
}: Readonly<EmployeeActionBarProps>) {
  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={onEditEmployee}>
        <Pencil className="h-4 w-4" />
        직원 정보 수정
      </Button>
      <Button variant="outline" size="sm" onClick={onAddAttendance}>
        <Plus className="h-4 w-4" />
        근태 추가
      </Button>
      <Button variant="outline" size="sm" disabled={!canEditAttendance} onClick={onEditAttendance}>
        <Pencil className="h-4 w-4" />
        선택 근태 수정
      </Button>
    </div>
  );
}
```

```tsx
// src/features/employee-detail/ui/employee-detail-panel.tsx (after)
<EmployeeActionBar
  onEditEmployee={() => setIsEditEmployeeOpen(true)}
  onAddAttendance={() => setIsAddAttendanceOpen(true)}
  onEditAttendance={() => setIsEditAttendanceOpen(true)}
  canEditAttendance={!!selectedAttendance}
/>
```

#### 핸들러 prop 의미론 원칙

이 과정에서 중요했던 건 핸들러 prop 이름을 "구현이 아닌 의미"로 짓는 것이었습니다.

- ❌ `onSetEditOpen`: 구현 세부사항을 드러냄
- ✅ `onEditEmployee`: 사용자 의도를 표현

Entity UI는 "무엇을 할지"만 알고, "어떻게 할지"는 container가 결정합니다.

같은 버튼 구조가 다이얼로그와 패널에서 중복되었는데,
presenter로 추출하면 한 곳에서 관리할 수 있고 수정 포인트가 줄어듭니다.

`canEditAttendance`처럼 조건부 상태도 boolean prop으로 전달하면
presenter가 순수하게 유지되고 테스트하기도 쉬워집니다.

이렇게 분리한 결과,
버튼 레이아웃이나 아이콘을 바꿀 때 entity UI 한 곳만 수정하면 되고,
feature container는 비즈니스 로직(어떤 다이얼로그를 열지)에만 집중할 수 있게 되었습니다.

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

### 13. 유틸 함수 카탈로그와 중복 방지

프로젝트가 커지면서 `shared/lib`에 유틸 함수가 늘어나기 시작했습니다.

처음에는 필요한 유틸을 만들 때마다 "이미 있는 건 아닐까"라고 grep으로 찾아봤는데,
프로젝트 규모가 커질수록 이 방식은 비효율적이었습니다.

특히 새로운 팀원이 합류했을 때 "어떤 유틸이 있는지" 알 수 없어서
중복 구현이 생기거나 불필요한 유틸을 새로 만드는 일이 반복되었습니다.

#### 카테고리 주석을 통한 유틸 카탈로그

이 문제를 해결하기 위해 `src/shared/lib/index.ts`에 카테고리 주석을 달아서
barrel export 자체를 유틸 목록으로 만들었습니다.

```ts
// src/shared/lib/index.ts

// --- Utility ---
export { cn } from "./cn";

// --- Text ---
export { splitByHighlight, type HighlightSegment } from "./split-by-highlight";

// --- Form ---
export { createModalFormHandler } from "./form-handler";

// --- Validation ---
export { validateSchema } from "./validate";

// --- Environment ---
export { BASE_URL } from "./env";

// --- Errors ---
export {
  BaseError,
  ApiError,
  NotFoundError,
  BadRequestError,
  NetworkError,
  TimeoutError,
  ValidationError,
  ResponseParseError,
  AppError,
} from "./errors";

export {
  API_ERROR_CODES,
  CLIENT_ERROR_CODES,
  NETWORK_ERROR_CODES,
  ERROR_CODES,
  ERROR_MESSAGES,
  getErrorMessage,
  type ApiErrorCode,
  type ClientErrorCode,
  type NetworkErrorCode,
  type ErrorCode,
} from "./errors";
```

이렇게 카테고리를 명시하면:

- 새 유틸을 추가할 때 barrel export를 먼저 확인하면 중복 구현을 방지할 수 있습니다.
- 코드 리뷰 시에도 "이미 있는 유틸인데 새로 만들었네"를 쉽게 체크할 수 있습니다.
- 팀원이 프로젝트에 합류했을 때 `src/shared/lib/index.ts`를 보면 "어떤 유틸이 있는지" 한눈에 파악 가능합니다.

#### 6개 카테고리 구조

현재 프로젝트의 유틸은 다음 6개 카테고리로 정리되어 있습니다.

**Utility**: 범용 유틸리티

- `cn`: classname 병합 (tailwind 호환)

**Text**: 텍스트 처리

- `splitByHighlight`: 검색 키워드 기준으로 텍스트 분할

**Form**: 폼 관련 유틸

- `createModalFormHandler`: 다이얼로그 폼 제출 핸들러

**Validation**: 검증 유틸

- `validateSchema`: zod 스키마 검증 및 에러 변환

**Environment**: 환경 설정

- `BASE_URL`: API 기본 URL

**Errors**: 에러 타입 및 코드

- `BaseError`, `ApiError`, `ValidationError` 등 에러 클래스
- `ERROR_CODES`, `ERROR_MESSAGES` 등 에러 상수

#### shared/index.ts 보강

기존에는 `errors/`와 `env.ts`가 `shared/index.ts`에서 re-export 되지 않아서,
feature에서 `@/shared/lib/errors`로 직접 import해야 했습니다.

이번에 `shared/index.ts`에 errors와 env를 추가해서
`@/shared`에서 직접 import 가능하도록 보강했습니다.

```ts
// src/shared/index.ts

// 기존 UI 컴포넌트들...
export { Badge } from "./ui/badge";
export { Button } from "./ui/button";
// ...

// 기존 API 클라이언트...
export { createHttpClient, type HttpClient } from "./api/client";

// lib 유틸들
export { cn } from "./lib/cn";
export { splitByHighlight, type HighlightSegment } from "./lib/split-by-highlight";
export { createModalFormHandler } from "./lib/form-handler";
export { validateSchema } from "./lib/validate";

// Errors (새로 추가)
export {
  BaseError,
  ApiError,
  NotFoundError,
  BadRequestError,
  NetworkError,
  TimeoutError,
  ValidationError,
  ResponseParseError,
  AppError,
} from "./lib/errors";

export {
  API_ERROR_CODES,
  CLIENT_ERROR_CODES,
  NETWORK_ERROR_CODES,
  ERROR_CODES,
  ERROR_MESSAGES,
  getErrorMessage,
  type ApiErrorCode,
  type ClientErrorCode,
  type NetworkErrorCode,
  type ErrorCode,
} from "./lib/errors";

// Environment (새로 추가)
export { BASE_URL } from "./lib/env";
```

이렇게 하면:

- `@/shared`에서 모든 공통 유틸을 import 가능
- 기존 `@/shared/lib/errors` 경로도 여전히 동작 (호환성 유지)
- feature에서 import 경로를 통일할 수 있음

#### 중복 방지 효과

이 구조의 실제 효과는:

1. **새 유틸 추가 전 체크**: barrel export를 보면 "이미 있는 건 아닐까" 판단 가능
2. **코드 리뷰 기준 명확화**: "이 유틸이 이미 있는데 왜 새로 만들었나"를 쉽게 지적 가능
3. **팀 온보딩 가속화**: 신입이 프로젝트 합류 시 `src/shared/lib/index.ts`를 보면 "어떤 유틸이 있는지" 빠르게 파악

특히 프로젝트가 커질수록 이 카탈로그의 가치가 높아집니다.

유틸이 50개, 100개로 늘어나도 barrel export의 카테고리 주석만 보면
"Text 처리는 이미 `splitByHighlight`가 있으니 새로 만들 필요 없겠네"라고 판단할 수 있기 때문입니다.
