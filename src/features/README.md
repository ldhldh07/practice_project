# Features Layer

## 역할

- 사용자 시나리오 구현
- 비즈니스 로직 처리
- entities와 shared를 조합하여 기능 완성

## 규칙

- entities와 shared만 의존 가능
- 다른 features 의존 금지
- Container-Presenter 패턴 사용

## 폴더 구조

```
features/
├── comment-edit/     # 댓글 편집 기능
├── post-edit/        # 게시물 편집 기능
│   ├── model/
│   │   └── edit-post.hook.ts    # 게시물 편집 비즈니스 로직
│   └── ui/
│       ├── post-add-dialog-container.tsx    # 게시물 추가 컨테이너
│       └── post-edit-dialog-container.tsx   # 게시물 편집 컨테이너
├── post-filter/      # 게시물 필터링 기능
├── post-load/        # 게시물 로딩 기능
└── post-pagination/  # 게시물 페이지네이션 기능
```

## 핵심 패턴

- **Container**: 비즈니스 로직 + 상태 관리
- **Presenter**: entities의 순수 UI 컴포넌트 사용
