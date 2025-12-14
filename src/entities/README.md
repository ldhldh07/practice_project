# Entities Layer

## 역할

- 순수한 데이터 관리
- 외부 라이브러리 의존성 격리
- 재사용 가능한 UI 컴포넌트 제공

## 핵심 원칙

- **의존성 격리**: 외부 라이브러리(Jotai, TanStack Query) 추상화
- **useState 패턴**: 일관된 인터페이스 제공
- **순수 UI**: 비즈니스 로직 없는 컴포넌트

## 폴더 구조

```
entities/
├── post/
│   ├── api/         # API 통신
│   ├── model/       # 상태 관리, 타입 정의
│   └── ui/          # 순수 UI 컴포넌트
└── comment/
    ├── api/
    ├── model/
    └── ui/
```

## 세그먼트별 역할

- **api**: 외부 API와의 통신 로직
- **model**: 상태 관리, 비즈니스 도메인 로직, 타입 정의
- **ui**: 순수한 UI 컴포넌트 (props로 이벤트 핸들러 받음)
