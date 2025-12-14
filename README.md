# Practice

## 소개

해당 프로젝트는 현재 시점에서 가지고 있는 기준을 적용하고자 제작되었습니다.

프로젝트의 방향성은 다음과 같습니다 :

- FSD 아키텍처 - 레이어별 관심사 분리와 단방향 의존성
- 커스텀 훅 기반 - 상태, setter 배열 반환 패턴을 따르는 일관된 상태 관리
- 아키텍처와 호환성을 고려한 도구 - Jotai, TanStack Query, React Hook Form
- zod를 통한 API 응답 타입 안전성





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
│   └── posts-manager-page.tsx       # 게시물 관리 페이지
│
├── widgets/                         # 페이지 구성 단위
│   └── posts-manager/ui/
│       ├── posts-body-widget.tsx    # 게시물 본문 위젯
│       ├── posts-dialogs-widget.tsx # 다이얼로그 위젯
│       └── posts-header-widget.tsx  # 게시물 헤더 위젯
│
├── features/                        # 사용자 시나리오 (비즈니스 로직)
│   ├── comment-edit/                # 댓글 편집 기능
│   ├── post-edit/                   # 게시물 편집 기능
│   ├── post-filter/                 # 게시물 필터링 기능
│   └── post-load/                   # 게시물 로딩 기능
│
├── entities/                        # 비즈니스 엔티티 (순수 데이터)
│   ├── comment/                     # 댓글 엔티티
│   │   ├── api/comments.api.ts      # 댓글 API
│   │   ├── model/
│   │   │   ├── comment.hook.ts      # 댓글 훅
│   │   │   ├── comment.query.ts     # TanStack Query
│   │   │   └── comment.schema.ts    # Zod 스키마
│   │   └── ui/                      # 순수 UI 컴포넌트
│   └── post/                        # 게시물 엔티티
│
└── shared/                          # 공통 유틸리티
    ├── api/client.ts                # HTTP 클라이언트
    ├── lib/
    │   ├── api-validator.ts         # API 검증 유틸
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
import { PostEditDialog, useSelectedPost, useUpdatePostForm } from "@/entities/post";
import { createModalFormHandler } from "@/shared";

import { useEditPostDialog, usePostActions } from "../model/edit-post.hook";

export function PostEditDialogContainer() {
  // Custom Hook으로 추상화된 비즈니스 로직
  const [isEditOpen, setIsEditOpen] = useEditPostDialog();
  const [selectedPost] = useSelectedPost();
  const postActions = usePostActions();
  const form = useUpdatePostForm(selectedPost);

  // handlers
  const handleSubmit = createModalFormHandler(
    form,
    () => setIsEditOpen(false),
    false,
  )(async (data) => {
    if (!selectedPost) {
      console.warn("수정할 게시물이 선택되지 않았습니다.");
      return;
    }
    await postActions.update({
      postId: String(selectedPost.id),
      params: data,
    });
  });
	
  // entities의 컴포넌트
  return <PostEditDialog open={isEditOpen} onOpenChange={setIsEditOpen} form={form} onSubmit={handleSubmit} />;
}
```



1. 비즈니스 로직은 추상화하여 구체적인 동작은 숨겨둔 채로 Custom Hook을 호출합니다.
   - 유지 보수시 이 코드는 수정하지 않아도 됩니다.

2. 핸들러 함수는 UI와 밀접하게 연결된 코드이기 때문에 UI 영역 상단에 위치하여 응집도를 높여줍니다.

3. UI은 엔터티에서 순수하게 UI만 그린 컴포넌트를 호출해서 비즈니스 로직을 주입합니다 (container-presenter 패턴)



### 2. entity와 feature의 역할 경계

각 모델, UI, 훅별로 entity와 feature를 구분하는 것에 가장 세밀한 기준 설정이 요구된다

기본 골자는 다음과 같다 :

-  feature는 유즈 케이스 관점에서 사용자 시나리오의 동작에 대응한다
  -  UI는 비즈니스 로직이 추상화가 되어있어야 한다.
  - hook은 ui 상태나 사이드 이펙트를 유발하는 동작을 포함한다
- entity는 직접적으로 데이터를 다룬다
  - 외부 라이브러리의 의존성을 가지는 경우 entity 레이어에 격리한다
  - ui는 순수하게 ui만을 그린다

```typescript
// before
import { useAtom } from "jotai"; // features가 외부 라이브러리 직접 의존

export function PostAddDialogContainer() {
  const [isAddOpen, setIsAddOpen] = useAtom(isAddPostDialogOpenAtom); // 직접 사용
  const [selectedPost, setSelectedPost] = useAtom(selectedPostAtom);
}
```

이 경우에는 features에서 useAtom에 의존성을 가지며, 만약 다른 상태 라이브러리로 교체를 할 때 이 코드를 수정해야 한다

```ts
// after
import { useSelectedPost, usePostDetailDialog } from "@/entities/post";

export const useSelectedPost = () => {
  return useAtom(selectedPostAtom); // jotai 구현 숨김
};

export const usePostDetailDialog = () => {
  return useAtom(isPostDetailDialogOpenAtom); // jotai 구현 숨김
};
```

```ts
import { useSelectedPost, usePostDetailDialog } from "@/entities/post";

export function PostAddDialogContainer() {
  const [selectedPost, setSelectedPost] = useSelectedPost(); // 구현이 숨겨져 있음 -> 수정하지 않아도 된다
  const [isDetailOpen, setIsDetailOpen] = usePostDetailDialog(); 
  
  const handleSubmit = async (data) => {
    await postActions.create(data);
    setIsDetailOpen(false);
  };
}
```

추후 기술 변경할 때나 동작이 바뀔 때 하위 레이어인 entitiy에서 수정하기만 하면 되도록 추상화



### 3. 단방향 의존성과 추상화 레이어

```typescript
import { CardContent } from "@shared/ui";

import { SortOrder, usePostSearchParams } from "@/features/post-filter";
import { PostFilterContainer } from "@/features/post-filter/ui/post-filter-container";
import { PostsTableContainer } from "@/features/post-load";
import { usePostsQuery } from "@/features/post-load/model/posts.query.ts";
import { PostPagination } from "@/features/post-pagination/ui/post-pagination";

export function PostsBodyWidget() {
  ...
}

```

**의존성 역전 금지**: FSD에서는 하위 레이어에서 상위 레이어를 import하는 의존성 역전을 금지한다

의존성을 역전하지 않도록 하다보면 자연스럽게 단계적인 추상화 레이어 구성이 된다

- 추상화 단계를 고민하는 인지 부하를 감소할 수 있다 

  

### 4. Custom Hook 추상화의 기준

비즈니스 로직을 Custom Hook으로 추상화할 때 어느 수준의 덩어리로 추상화를 해야할지 그 기준도 고민이 됐습니다.

```typescript
// before
export function CommentAddDialogContainer() {
  const { newComment, setNewComment, isAddOpen, setIsAddOpen, addComment } = useCommentEditor();
  ...
}
```

강하게 결합되어있는 로직인 경우에는 하나의 훅으로 묶는다

```ts
// after
export function CommentAddDialogContainer() {
  const [newComment] = useNewComment();
  const [isAddOpen, setIsAddOpen] = useAddCommentDialog(); 
  
  const commentActions = useCommentActions(postId); 
  ...
}
```

독립적으로 사용될 수 있는 훅은 별개로 정의한다

이때 아래와 같은 코드로 작성한 이유는 다음과 같습니다.

- 의존성이 없다 - 독립적으로 사용될 가능성이 높다.
- useState의 형태로서 일관성 있는 코드를 작성할 수 있다.





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
-  jotai
  - Atomic 단위로 상태를 관리 - 관심사 분리 관점에서 entities 레이어에 일관성있게 적용
  - useState와 동일한 형식으로 상태 관리
  - 변경된 atom만 정확히 업데이트

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
export const postSchema = z.object({
  id: z.number(),
  title: z.string(),
  body: z.string(),
  userId: z.number(),
  tags: z.array(z.string()).optional(),
  reactions: z
    .object({
      likes: z.number(),
      dislikes: z.number(),
    })
    .optional(),
});

export type PostSchema = z.infer<typeof postSchema>;
```

신뢰할 수 없는 외부 영역의 정보를 신뢰할 수 있는 애플리케이션 내부로 들여보내기 위해서는 검증이 필요합니다.

API 응답 또한 신뢰할 수 없는 영역의 정보로 검증을 해야한다

- **타입으로 인한 검증** : 컴파일 타임 검증만 제공하여 런타임에 예측불가능한 오류 발생 가능
- **zod** : 런타임 검증, 백엔드에서 다른 스펙으로 보낼 때 감지 가능
