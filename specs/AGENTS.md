# AGENTS.md (specs)

기획 문서 레이어. 수동으로 관리되는 프로덕트 스펙 저장소.

## HOW TO ACCESS

| 목적        | 방법                                   |
| ----------- | -------------------------------------- |
| 전체 목록   | `specs/SPEC-INDEX.md` (TOON 포맷)      |
| 화면 스펙   | `specs/screen-definition/{화면ID}.md`  |
| 기능 스펙   | `specs/feature-definition/{기능ID}.md` |
| 데이터 스펙 | `specs/data-definition/{엔티티}.md`    |

## NOTES

- 이 프로젝트는 수동 관리 스펙 문서입니다 (Notion 동기화 없음).
- 문서 frontmatter의 `id`, `doc_type`, `depends_on`을 기준으로 탐색합니다.
- 의존성 그래프는 `specs/dependency-graph.json`에 정의되어 있습니다.
