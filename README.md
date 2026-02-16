# HR Manager

인사 도메인을 기준으로 설계한 FSD 기반 백오피스 포트폴리오 프로젝트입니다.

## 핵심 목표

- 단순 CRUD가 아니라 조직도, 구성원, 근태를 함께 다루는 도메인 흐름 구현
- FSD 레이어 경계와 배럴 임포트로 관심사 분리 강제
- Jotai atom graph로 복잡한 화면 상태(트리, 필터, 선택 상태) 모델링
- TanStack Query + optimistic update로 서버 상태 동기화
- Zod safeParse + ValidationError 래핑으로 런타임 검증

## 기술 스택

- React 19, TypeScript, Vite
- Jotai, TanStack Query
- React Hook Form + Zod
- ESLint + eslint-plugin-boundaries
- Hono + @hono/vite-dev-server (로컬 mock API)

## 화면 구성

- 좌측: 조직도 트리 (검색, expand/collapse, 부서 선택)
- 우측: 구성원 테이블 (검색, 상태 필터, 정렬, 페이지네이션)
- 다이얼로그: 구성원 추가/수정, 구성원 상세, 근태 추가/수정

## 데이터 흐름 (Jotai 중심)

1. 사용자 이벤트 (트리 선택, 검색, 정렬)
2. source atoms 업데이트 (`selectedDepartmentIdAtom`, `employeeSearchParams`)
3. derived atoms 재계산 (`selectedDepartmentDescendantsAtom`)
4. query params 합성 후 TanStack Query key 갱신
5. API 재요청 + UI 동기화

복잡한 흐름을 reducer 하나로 몰지 않고 atom 단위로 분산해, 각 상태의 책임을 명확히 분리했습니다.

## 프로젝트 구조

```text
src/
  app/
  pages/
  widgets/
    employee-manager/
  features/
    employee-load/
    employee-filter/
    employee-edit/
    attendance-edit/
    department-tree/
  entities/
    employee/
    attendance/
    department/
  shared/

server/
  index.ts
  routes/
    employees.ts
    departments.ts
    attendance.ts
  data/
    employees.ts
    departments.ts
    attendance.ts
```

## 실행 방법

```bash
pnpm install
pnpm dev
```

`@hono/vite-dev-server`가 `/api/*` 요청을 로컬 Hono 서버로 처리합니다.

## 검증

```bash
pnpm lint
pnpm build
```

## 포트폴리오 포인트

- 도메인 모델링: 조직도(트리) + 구성원(테이블) + 근태(종속 엔티티)
- 상태 모델링: URL 상태 + atom 상태 + server state를 충돌 없이 동기화
- 아키텍처 일관성: entity에서 라이브러리 의존 캡슐화, feature는 유즈케이스 중심 조합
