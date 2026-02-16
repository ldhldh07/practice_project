export interface Department {
  id: number;
  parentId: number | null;
  name: string;
  description: string;
  headCount: number;
}

export const departments: Department[] = [
  { id: 1, parentId: null, name: "경영본부", description: "인사, 총무, 재무 등 경영 지원 업무를 담당합니다.", headCount: 5 },
  { id: 2, parentId: null, name: "제품본부", description: "서비스 개발 및 제품 경험을 담당합니다.", headCount: 11 },
  { id: 3, parentId: null, name: "사업본부", description: "마케팅, 영업 등 사업 성장을 담당합니다.", headCount: 7 },
  { id: 4, parentId: 1, name: "인사팀", description: "채용/평가/보상 관리", headCount: 3 },
  { id: 5, parentId: 1, name: "재무팀", description: "재무/회계 관리", headCount: 2 },
  { id: 6, parentId: 2, name: "개발팀", description: "프론트/백엔드 개발", headCount: 8 },
  { id: 7, parentId: 2, name: "디자인팀", description: "제품 디자인", headCount: 3 },
  { id: 8, parentId: 3, name: "마케팅팀", description: "퍼포먼스/콘텐츠 마케팅", headCount: 4 },
  { id: 9, parentId: 3, name: "영업팀", description: "영업 및 제휴", headCount: 3 },
];
