# FSD Source Map

전체 정책은 루트 `AGENTS.md` 참조. 이 파일은 소스 디렉토리 내 레이어 관계만 다룬다.

## Layer Flow (단방향)

```
app → pages → widgets → features → entities → shared
```

## Layer Responsibilities

| Layer       | 책임                                           | 금지                                  |
| ----------- | ---------------------------------------------- | ------------------------------------- |
| `app/`      | 라우터, 프로바이더, 레이아웃, ErrorBoundary    | 도메인 로직                           |
| `pages/`    | 라우트 엔트리, URL 파싱, 위젯 조합             | 비즈니스 mutation, entity 직접 import |
| `widgets/`  | feature 조합, 페이지 구성 단위                 | 비즈니스 로직, entity 직접 import     |
| `features/` | 사용자 시나리오 오케스트레이션, mutation       | cross-feature barrel import           |
| `entities/` | 도메인 데이터, 스키마, atom, query, 순수 UI    | 비즈니스 흐름 결정, 라우팅            |
| `shared/`   | 범용 유틸, API 클라이언트, 에러, UI 프리미티브 | 도메인 가정                           |

## Import Rules (eslint-plugin-boundaries + no-restricted-imports)

```
pages   → [widgets, features, shared]    # @/entities 금지 (no-restricted-imports)
widgets → [features, shared]             # @/entities 금지 (no-restricted-imports)
features → [entities, shared]            # @/features barrel 금지 (no-restricted-imports)
entities → [entities, shared]
shared  → [shared]
```

## Segment Naming (model/ 단수형)

```
entity-or-feature/
├── api/              # API 호출
├── model/            # 단수형! (models/ 아님)
│   ├── *.schema.ts   # Zod 스키마 + 타입 추론
│   ├── *.keys.ts     # Query Key Factory
│   ├── *.atom.ts     # Jotai atom (source/derived/action)
│   ├── *.hook.ts     # atom 래핑 훅 or scenario 훅
│   ├── *.query.ts    # queryOptions + useQuery
│   ├── *.mutation.ts # useMutation
│   └── *.types.ts    # 추가 타입
├── ui/               # UI 컴포넌트
└── index.ts          # Public API (barrel)
```

## Current Slices

- **entities**: department, employee, attendance
- **features**: department-tree, employee-browse, employee-detail, employee-filter, employee-edit, employee-dialogs, employee-load, attendance-edit
- **widgets**: employee-manager
- **pages**: employee-manager, employee-detail, not-found
