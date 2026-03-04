# Shared Layer Rules

전체 정책은 루트 `AGENTS.md`의 "Zod Validation Policy", "Error Handling Policy" 참조.

## 책임

프레임워크 비종속 유틸리티, API 클라이언트, 에러/검증 프리미티브, UI 프리미티브.
도메인 가정 ❌ — shared는 어떤 entity/feature에서든 범용으로 사용 가능해야 한다.

## 세그먼트 구조

```
shared/
├── api/client.ts            # HTTP 클라이언트 (타입화된 에러 throw)
├── config/routes.ts         # 라우트 경로 상수 + href 생성 함수
├── lib/
│   ├── validate.ts          # validateSchema (safeParse + ValidationError throw)
│   ├── errors/              # 에러 코드, 타입, 분류
│   │   ├── error-codes.ts   # ERROR_CODES 상수
│   │   ├── errors.ts        # ApiError, ValidationError, AppError, isExpectedError
│   │   └── index.ts
│   ├── cn.ts                # className 유틸 (tailwind-merge)
│   ├── env.ts               # 환경 변수 접근
│   └── split-by-highlight.ts # 텍스트 하이라이트 분할
├── types/                   # 공통 타입 정의
├── ui/                      # shadcn 기반 공통 UI 컴포넌트
│   ├── button, card, dialog, input, label, select, ...
│   ├── table, pagination, skeleton, badge, separator
│   ├── form-dialog.tsx      # 다이얼로그 + 폼 합성 (error prop 포함)
│   ├── error-fallback.tsx   # ErrorBoundary 폴백 UI
│   ├── error-boundary.tsx   # react-error-boundary 래퍼
│   └── dialog-error-message.tsx  # 인라인 에러 배너
└── index.ts                 # barrel export
```

## Import 규칙

- shared → `[shared]` 만 허용
- 어떤 entity, feature, widget, page도 import 금지

## 에러 계층 (errors/)

| 클래스                             | 용도                                                               |
| ---------------------------------- | ------------------------------------------------------------------ |
| `ApiError`                         | HTTP/API 에러 (statusCode, code, data)                             |
| `ValidationError`                  | Zod 검증 실패 (issues 배열)                                        |
| `BadRequestError`, `NotFoundError` | 특화된 API 에러                                                    |
| `isExpectedError()`                | 에러 코드 기반 allowlist (`EXPECTED_ERROR_CODES: ReadonlySet`) — 도메인 에러 코드 포함 |

## 검증 패턴 (validate.ts)

```ts
// 모든 API 응답은 이 함수를 거쳐야 한다
validateSchema(schema, data, errorMessage) → safeParse + ValidationError throw
```

## UI 컴포넌트 규칙

- shadcn/ui 기반 — 추가 시 `npx shadcn@latest add` 패턴 유지
- 새 공통 컴포넌트 추가 전 기존 목록 확인 필수
- `form-dialog.tsx`는 dialog + form + error 배너 합성 — 새 다이얼로그는 이걸 사용

## Anti-patterns

- 도메인 특화 로직을 shared에 배치 (예: `employeeUtils.ts`)
- 기존 UI 컴포넌트 확인 없이 중복 생성
- `validate.ts`를 우회하여 API 응답을 검증 없이 사용
