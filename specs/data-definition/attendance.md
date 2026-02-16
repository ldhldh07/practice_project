---
id: Attendance
title: "근태"
doc_type: data
source: manual
depends_on: [Employee]
tags: ["attendance", "근태", "출퇴근", "출결"]
---

### 근태

- **목적**

직원의 출퇴근 기록 및 근태 상태를 관리한다.

- **핵심 필드**

- `id` — 고유 식별자
- `employeeId` — 직원 ID (FK → Employee)
- `date` — 근무일 (날짜)
- `checkIn` — 출근 시각 (HH:mm 또는 ISO timestamp)
- `checkOut` — 퇴근 시각 (HH:mm 또는 ISO timestamp)
- `status` — 근태 상태 (`present` | `late` | `absent` | `halfDay` | `vacation`)
- `note` — 비고/사유 (optional)

- **운영 규칙 / 제약**

- Attendance는 (employeeId, date) 조합으로 유니크
- checkIn이 없으면 `absent` 또는 `vacation` 등으로 간주
- status는 checkIn/checkOut 시각과 근무 규칙에 따라 자동 계산 가능
- 과거 근태 기록은 수정 가능하나, 이력 추적 필요 시 별도 로그 테이블 사용

---
