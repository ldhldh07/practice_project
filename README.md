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

추후 기술 변경할 때나 동작이 바뀔 때 하위 레이어인 entitiy에서 수정하기만 하면 되도록 추상화

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

이번 프로젝트에서는 아래 4가지 질문으로 훅 범위를 결정했습니다.

1. **한 사용자 동작을 끝까지 책임지는가?**
   - 예: 다이얼로그 열림 상태, 폼, 제출 후 닫기까지 한 흐름이면 하나의 훅으로 묶습니다.
2. **독립적인 관심사가 섞였는가?**
   - 재사용 가능성이 다른 관심사(fetch, URL 동기화, 로컬 상태)는 분리합니다.
3. **라우팅/URL 책임을 침범하는가?**
   - URL 파라미터 해석이나 라우트 결정은 page에서 소유하고, feature에는 값/콜백으로 주입합니다.
4. **추상화의 실익이 있는가?**
   - 파일만 분리하는 추출이 아니라, 구현을 숨겨 변경 비용을 낮추는 추상화인지 확인합니다.

#### 유저 시나리오 단위 오케스트레이션

사용자 관점에서 하나의 완결된 흐름을 담당하는 훅을 만듭니다.

```ts
// features/employee-edit/model/edit-employee.hook.ts
export function useAddEmployeeDialogFlow() {
  const [isOpen, setIsOpen] = useAddEmployeeDialog();
  const form = useCreateEmployeeForm();
  const createMutation = useCreateEmployeeMutation();

  const handleSubmit = async (data) => {
    await createMutation.mutateAsync(data);
    setIsOpen(false);
  };

  return { isOpen, setIsOpen, form, handleSubmit };
}

export function useEditEmployeeDialogFlow() {
  const [isOpen, setIsOpen] = useEditEmployeeDialog();
  const [selectedEmployee] = useSelectedEmployee();
  const form = useUpdateEmployeeForm(selectedEmployee);
  const updateMutation = useUpdateEmployeeMutation();

  const handleSubmit = async (data) => {
    if (!selectedEmployee) return;
    await updateMutation.mutateAsync({ employeeId: selectedEmployee.id, params: data });
    setIsOpen(false);
  };

  return { isOpen, setIsOpen, form, handleSubmit, selectedEmployee };
}
```

직원 추가와 직원 수정은 독립적인 시나리오이므로 하나의 훅으로 억지로 묶지 않습니다. 각각의 흐름이 명확하게 분리되어 있어 유지보수가 쉽습니다.

#### 관심사 독립성에 따른 분리

하나의 시나리오 안에서도 재사용 가능성과 변경 주기가 다른 관심사는 분리합니다.

```typescript
// before
export function useDepartmentTree() {
  // fetch + url sync + tree state가 한곳에 섞여있던 형태
  // ...
}
```

```ts
// after - 서브훅으로 관심사 분리
function useDepartmentTreeSourceSync() {
  const query = useQuery({ queryKey: departmentQueryKeys.list(), queryFn: () => departmentApi.getList() });
  // source atom hydration
}

function useDepartmentTreeUrlSync(departmentId: number | undefined, setSelectedId: (id: number | null) => void) {
  // URL param -> selected atom sync
}

function useDepartmentTreeState() {
  // tree/search/selection/expand state
}

export function useDepartmentTree() {
  // orchestration만 담당
  useDepartmentTreeSourceSync();
  const state = useDepartmentTreeState();
  useDepartmentTreeUrlSync(params.departmentId, state.setSelectedId);

  return state;
}
```

이렇게 분리하면:

- 각 서브훅은 독립적으로 테스트 가능합니다
- 데이터 fetch, URL 동기화, 상태 관리 등 각 관심사가 명확히 분리됩니다
- 오케스트레이터 훅은 이들을 조합하는 역할만 담당합니다

#### URL/라우팅 책임의 분리

URL과 라우팅은 page의 책임으로 두고, feature는 라우트 구현을 직접 알지 않게 구성했습니다.

```tsx
// pages/employee-manager/EmployeeManagerPage.tsx
import { getEmployeeDetailHref } from "@/shared/config/routes";

export function EmployeeManagerPage() {
  return <EmployeeBodyWidget toEmployeeDetailHref={getEmployeeDetailHref} />;
}
```

```tsx
// features/employee-browse/model/use-employee-browse.ts
type UseEmployeeBrowseParams = {
  toDetailHref: (employeeId: number) => string;
};

export function useEmployeeBrowse({ toDetailHref }: Readonly<UseEmployeeBrowseParams>) {
  // feature는 href 생성 규칙을 모르고 주입받아 사용
}
```

이렇게 하면 route 구조가 바뀌어도 page/route 계층에서만 수정하면 되고, feature의 재사용성과 독립성을 유지할 수 있습니다.

#### 패스스루 훅 안티패턴

entity 훅을 그대로 return만 하는 feature 훅은 시나리오 의미가 없으므로 제거 대상입니다.

```ts
// ❌ 잘못된 예시 - 패스스루 훅
export function useOpenAddEmployeeDialog() {
  return useSetAddEmployeeDialog(); // entity 훅을 그대로 return
}

export function useDeleteEmployeeAction() {
  const { mutateAsync } = useDeleteEmployee();
  return { deleteEmployee: mutateAsync }; // mutateAsync만 return
}
```

이런 훅들은 다음과 같은 문제가 있습니다:

- entity 훅 대비 추가적인 오케스트레이션이나 정책을 제공하지 않습니다
- 단순히 이름만 바꾸는 역할만 하여 불필요한 레이어를 추가합니다
- 실제 사용처가 없거나 매우 적습니다

**판단 기준**: "이 훅이 entity 훅 대비 추가적인 오케스트레이션이나 정책을 제공하는가?"

```ts
// ✅ 올바른 예시 - 시나리오 오케스트레이션
export function useAddEmployeeDialogFlow() {
  const [isOpen, setIsOpen] = useAddEmployeeDialog();
  const form = useCreateEmployeeForm();
  const createMutation = useCreateEmployeeMutation();

  // 폼 제출 + 다이얼로그 닫기 + 에러 처리 등 시나리오 전체를 오케스트레이션
  const handleSubmit = async (data) => {
    await createMutation.mutateAsync(data);
    setIsOpen(false);
  };

  return { isOpen, setIsOpen, form, handleSubmit };
}
```

이 훅은 다이얼로그 상태, 폼, 액션을 조합하여 "직원 추가 다이얼로그"라는 완결된 시나리오를 제공합니다.

#### 추출과 추상화의 차이

- **추출**: 코드를 파일로 옮기는 것
- **추상화**: 사용처에서 구현 세부사항을 몰라도 되게 만드는 것

커스텀 훅은 "파일 수를 늘리는 목적"이 아니라, 구현체 변경 시 사용처를 덜 바꾸기 위한 목적일 때만 유지합니다.

#### 정리

- **유저 시나리오 기반으로 묶되**, 독립적인 시나리오는 억지로 하나로 합치지 않습니다
- **관심사가 독립적이면 서브훅으로 분리**하여 오케스트레이터 훅이 조합하도록 합니다
- **URL/라우팅 책임은 page에서 소유**하고 feature에는 값/콜백으로 전달합니다
- **패스스루 훅은 제거**하고, entity 훅을 직접 사용하거나 실제 오케스트레이션을 제공하는 훅으로 대체합니다

#### 참고한 기준

커스텀 훅 범위 기준은 다음 레퍼런스에서 공통으로 확인한 원칙을 반영했습니다.

- `weather`: 과도한 통합 훅 대신 관심사 분리
- `exchange_practice`: 컨테이너는 What, 훅은 How
- `op_practice`: feature 훅의 시나리오 오케스트레이션
- `tb_practice`: URL/page 소유권, 추출 vs 추상화 기준
- `vineyard_backoffice`: 문서화 체크리스트 기반 검증 관점

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

1. 단순히 자주 쓸 것 같은 컴포넌트라고 분리
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

- Flux 패턴을 사용하는 상태 관리 툴
  - Store라는 별도의 중앙집중식 레이어가 필요
  - 모든 상태가 하나의 store에 집중됨
- jotai
- Atomic 단위로 상태를 관리 - 관심사 분리 관점에서 entities 레이어에 일관성있게 적용
- useState와 동일한 형식으로 상태 관리
- 변경된 atom만 정확히 업데이트

복잡한 데이터 관리 흐름에서 특히 조타이 위주로 가져가는 이유는,

- 화면 단위가 아니라 상태 단위(atom)로 책임을 쪼갤 수 있고
- 각 컴포넌트가 필요한 atom만 읽고/쓰도록 만들기 쉽기 때문입니다.

즉, "전역 상태를 한 덩어리로 관리"하기보다는 "컴포넌트 관심사에 맞춰 상태를 원자화"해서,
조직도 선택/검색/펼침 같은 서로 다른 관심사를 features와 entities 경계 안에서 분리하기 좋았습니다.

```ts
// entities/department/model/department-tree.atom.ts
export const departmentSourceAtom = atom<Department[]>([]);
export const selectedDepartmentIdAtom = atom<number | null>(null);
export const departmentTreeSearchAtom = atom("");

// 파생 atom
export const visibleDepartmentTreeAtom = atom((get) => {
  const tree = get(departmentTreeAtom);
  const keyword = get(departmentTreeSearchAtom).trim().toLowerCase();
  // ...
  return tree;
});

// 액션 atom
export const toggleDepartmentExpandAtom = atom(null, (get, set, id: number) => {
  const next = new Set(get(expandedDepartmentIdsAtom));
  if (next.has(id)) next.delete(id);
  else next.add(id);
  set(expandedDepartmentIdsAtom, next);
});
```

```ts
// features/department-tree/model/use-department-tree.ts
// source sync / url sync / state binding을 분리해서 조합
useDepartmentTreeSourceSync();
useDepartmentTreeUrlSync(params.departmentId, state.setSelectedId);
```

#### tanstack query

- 기존 명령형 방식
  - 서버 상태를 클라이언트에 수동으로 저장하고 관리

  - 상태 동기화를 직접 처리해야 함

  - 선언적인 다른 상태 관리와 호환되지 않음

- tanstack query
  - 상태를 직접 조작하지 않음

  - 데이터 변화를 선언하면 UI가 자동으로 반응

  - 선언적 데이터 동기화 - invalidateQueries로 자동 업데이트

### 2. 런타임 API 검증

```typescript
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

export type EmployeeSchema = z.infer<typeof employeeSchema>;
```

신뢰할 수 없는 외부 영역의 정보를 신뢰할 수 있는 애플리케이션 내부로 들여보내기 위해서는 검증이 필요합니다.

API 응답 또한 신뢰할 수 없는 영역의 정보로 검증을 해야한다

- **타입으로 인한 검증** : 컴파일 타임 검증만 제공하여 런타임에 예측불가능한 오류 발생 가능
- **zod** : 런타임 검증, 백엔드에서 다른 스펙으로 보낼 때 감지 가능
