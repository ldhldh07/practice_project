export type EmployeeStatus = "active" | "onLeave" | "resigned";

export interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string;
  position: string;
  departmentId: number;
  hireDate: string;
  status: EmployeeStatus;
  profileImage?: string;
}

let nextId = 24;

export const employees: Employee[] = [
  { id: 1, name: "김민수", email: "minsu.kim@hr.com", phone: "010-1234-5678", position: "대표이사", departmentId: 8, hireDate: "2018-03-02", status: "active" },
  { id: 2, name: "이서연", email: "seoyeon.lee@hr.com", phone: "010-2345-6789", position: "인사팀장", departmentId: 8, hireDate: "2019-06-15", status: "active" },
  { id: 3, name: "박지훈", email: "jihun.park@hr.com", phone: "010-3456-7890", position: "인사담당", departmentId: 8, hireDate: "2021-01-10", status: "active" },
  { id: 4, name: "최유진", email: "yujin.choi@hr.com", phone: "010-4567-8901", position: "재무팀장", departmentId: 8, hireDate: "2019-09-01", status: "active" },
  { id: 5, name: "정하늘", email: "haneul.jung@hr.com", phone: "010-5678-9012", position: "총무담당", departmentId: 8, hireDate: "2022-03-14", status: "onLeave" },
  { id: 6, name: "강도현", email: "dohyun.kang@hr.com", phone: "010-6789-0123", position: "CTO", departmentId: 6, hireDate: "2018-03-02", status: "active" },
  { id: 7, name: "윤서준", email: "seojun.yoon@hr.com", phone: "010-7890-1234", position: "백엔드 리드", departmentId: 6, hireDate: "2020-02-03", status: "active" },
  { id: 8, name: "임수빈", email: "subin.lim@hr.com", phone: "010-8901-2345", position: "프론트엔드 리드", departmentId: 6, hireDate: "2020-05-18", status: "active" },
  { id: 9, name: "한지민", email: "jimin.han@hr.com", phone: "010-9012-3456", position: "백엔드 개발자", departmentId: 6, hireDate: "2021-07-01", status: "active" },
  { id: 10, name: "오태양", email: "taeyang.oh@hr.com", phone: "010-0123-4567", position: "프론트엔드 개발자", departmentId: 6, hireDate: "2022-01-10", status: "active" },
  { id: 11, name: "송예진", email: "yejin.song@hr.com", phone: "010-1111-2222", position: "백엔드 개발자", departmentId: 6, hireDate: "2022-08-22", status: "active" },
  { id: 12, name: "장우석", email: "wooseok.jang@hr.com", phone: "010-2222-3333", position: "DevOps 엔지니어", departmentId: 6, hireDate: "2023-02-06", status: "active" },
  { id: 13, name: "배수현", email: "suhyun.bae@hr.com", phone: "010-3333-4444", position: "QA 엔지니어", departmentId: 6, hireDate: "2023-06-19", status: "resigned" },
  { id: 14, name: "신아름", email: "areum.shin@hr.com", phone: "010-4444-5555", position: "디자인 리드", departmentId: 7, hireDate: "2019-11-04", status: "active" },
  { id: 15, name: "권도윤", email: "doyun.kwon@hr.com", phone: "010-5555-6666", position: "UI 디자이너", departmentId: 7, hireDate: "2021-04-12", status: "active" },
  { id: 16, name: "조하은", email: "haeun.jo@hr.com", phone: "010-6666-7777", position: "UX 디자이너", departmentId: 7, hireDate: "2022-09-05", status: "onLeave" },
  { id: 17, name: "유재원", email: "jaewon.yu@hr.com", phone: "010-7777-8888", position: "마케팅 팀장", departmentId: 8, hireDate: "2020-01-13", status: "active" },
  { id: 18, name: "문서영", email: "seoyoung.moon@hr.com", phone: "010-8888-9999", position: "콘텐츠 마케터", departmentId: 8, hireDate: "2021-10-25", status: "active" },
  { id: 19, name: "홍지수", email: "jisu.hong@hr.com", phone: "010-9999-0000", position: "퍼포먼스 마케터", departmentId: 8, hireDate: "2023-03-20", status: "active" },
  { id: 20, name: "남궁현", email: "hyun.namgung@hr.com", phone: "010-1010-2020", position: "그로스 마케터", departmentId: 8, hireDate: "2024-01-08", status: "active" },
  { id: 21, name: "서진우", email: "jinwoo.seo@hr.com", phone: "010-3030-4040", position: "영업 팀장", departmentId: 9, hireDate: "2019-08-19", status: "active" },
  { id: 22, name: "안채린", email: "chaerin.an@hr.com", phone: "010-5050-6060", position: "영업 매니저", departmentId: 9, hireDate: "2022-05-30", status: "active" },
  { id: 23, name: "노준혁", email: "junhyuk.no@hr.com", phone: "010-7070-8080", position: "영업 담당", departmentId: 9, hireDate: "2024-02-14", status: "active" },
];

export function getNextId(): number {
  return nextId++;
}
