export interface Department {
  id: number;
  name: string;
  description: string;
  headCount: number;
}

export const departments: Department[] = [
  { id: 1, name: "경영지원", description: "인사, 총무, 재무 등 경영 지원 업무를 담당합니다.", headCount: 5 },
  { id: 2, name: "개발", description: "서비스 개발 및 기술 인프라를 담당합니다.", headCount: 8 },
  { id: 3, name: "디자인", description: "UI/UX 디자인 및 브랜드 관리를 담당합니다.", headCount: 3 },
  { id: 4, name: "마케팅", description: "서비스 마케팅 및 고객 커뮤니케이션을 담당합니다.", headCount: 4 },
  { id: 5, name: "영업", description: "고객 영업 및 파트너십 관리를 담당합니다.", headCount: 3 },
];
