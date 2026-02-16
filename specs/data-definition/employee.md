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
- `profileImage` — 프로필 이미지 URL (optional)

- **운영 규칙 / 제약**

- Employee는 삭제하지 않으며, 상태 변경(`status`)으로 관리한다.
- 퇴사(`resigned`) 직원의 과거 근태·평가·프로젝트 기록은 유지된다.
- departmentId는 Department.id를 참조하며, 부서 변경 이력은 별도 관리 가능
- email은 유니크 제약 (중복 불가)

---
