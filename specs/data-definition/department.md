---
id: Department
title: "부서"
doc_type: data
source: manual
depends_on: []
tags: ["department", "부서", "조직도", "트리"]
---

### 부서

- **목적**

부서(조직) 구조를 트리 형태로 관리한다.

- **핵심 필드**

- `id` — 고유 식별자
- `parentId` — 상위 부서 ID (자기참조 FK, null이면 최상위 부서)
- `name` — 부서명
- `description` — 부서 설명
- `headCount` — 소속 인원 수 (계산 필드 또는 캐시)

- **운영 규칙 / 제약**

- Department는 자기참조 트리 구조 (`parentId → Department.id`)
- parentId가 null이면 루트 부서
- 부서 삭제 시 하위 부서 및 소속 직원 존재 여부 검증 필요
- headCount는 실시간 계산 또는 주기적 업데이트

---
