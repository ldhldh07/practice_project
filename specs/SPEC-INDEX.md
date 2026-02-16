---
name: Spec Index
description: 전체 스펙 문서 TOON 인덱스
---

# Spec Index

specs[15]{path,id,type,deps,status,desc}:
data-definition/department.md,Department,data,[],stable,부서;조직도;트리;자기참조
data-definition/employee.md,Employee,data,[Department],stable,직원;기본;정보;관리
data-definition/attendance.md,Attendance,data,[Employee],stable,근태;출퇴근;기록;관리
feature-definition/1-1-직원-목록-조회.md,1-1-직원-목록-조회,feature,[Employee,Department],stable,직원;목록;검색;필터;정렬
feature-definition/1-2-직원-상세-조회.md,1-2-직원-상세-조회,feature,[Employee,Attendance],stable,직원;상세;근태;이력
feature-definition/2-1-직원-등록.md,2-1-직원-등록,feature,[Employee,Department],stable,직원;등록;생성;추가
feature-definition/2-2-직원-수정.md,2-2-직원-수정,feature,[Employee,Department],stable,직원;수정;편집;업데이트
feature-definition/3-1-근태-조회.md,3-1-근태-조회,feature,[Attendance,Employee],stable,근태;조회;출결;확인
feature-definition/3-2-근태-등록.md,3-2-근태-등록,feature,[Attendance,Employee],stable,근태;등록;출퇴근;체크인
feature-definition/3-3-근태-수정.md,3-3-근태-수정,feature,[Attendance,Employee],stable,근태;수정;보정;변경
feature-definition/4-1-부서-트리-조회.md,4-1-부서-트리-조회,feature,[Department],stable,부서;트리;조직도;계층
feature-definition/4-2-부서별-직원-필터.md,4-2-부서별-직원-필터,feature,[Department,Employee],stable,부서;필터;직원;조회
screen-definition/EMP-MANAGER.md,EMP-MANAGER,screen,[1-1-직원-목록-조회,4-1-부서-트리-조회],stable,직원;관리;메인;화면
screen-definition/EMP-LIST.md,EMP-LIST,screen,[1-1-직원-목록-조회,4-2-부서별-직원-필터],stable,직원;목록;패널;그리드
screen-definition/EMP-DETAIL.md,EMP-DETAIL,screen,[1-2-직원-상세-조회,3-1-근태-조회],stable,직원;상세;근태;액션
