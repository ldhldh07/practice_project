export type AttendanceStatus = "present" | "late" | "absent" | "halfDay" | "vacation";

export interface Attendance {
  id: number;
  employeeId: number;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: AttendanceStatus;
  note?: string;
}

let nextId = 51;

function generateAttendance(): Attendance[] {
  const records: Attendance[] = [];
  let id = 1;

  const baseDate = new Date("2025-02-10");

  for (let dayOffset = 0; dayOffset < 5; dayOffset++) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + dayOffset);
    const dateStr = date.toISOString().split("T")[0];

    for (let empId = 1; empId <= 23; empId++) {
      if (empId === 13) continue; // 퇴사자 제외
      if (empId === 5 || empId === 16) {
        // 휴직자
        records.push({ id: id++, employeeId: empId, date: dateStr, checkIn: null, checkOut: null, status: "vacation", note: "개인 사유 휴직" });
        continue;
      }

      const rand = Math.random();
      if (rand < 0.7) {
        records.push({ id: id++, employeeId: empId, date: dateStr, checkIn: "09:00", checkOut: "18:00", status: "present" });
      } else if (rand < 0.85) {
        records.push({ id: id++, employeeId: empId, date: dateStr, checkIn: "09:35", checkOut: "18:30", status: "late", note: "교통 지연" });
      } else if (rand < 0.92) {
        records.push({ id: id++, employeeId: empId, date: dateStr, checkIn: "09:00", checkOut: "13:00", status: "halfDay", note: "오후 반차" });
      } else if (rand < 0.97) {
        records.push({ id: id++, employeeId: empId, date: dateStr, checkIn: null, checkOut: null, status: "vacation", note: "연차 사용" });
      } else {
        records.push({ id: id++, employeeId: empId, date: dateStr, checkIn: null, checkOut: null, status: "absent", note: "무단 결근" });
      }
    }
  }

  nextId = id;
  return records;
}

export const attendanceRecords: Attendance[] = generateAttendance();

export function getNextId(): number {
  return nextId++;
}
