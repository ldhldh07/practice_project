import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom, useSetAtom } from "jotai";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  isAddAttendanceDialogOpenAtom,
  isEditAttendanceDialogOpenAtom,
  selectedAttendanceAtom,
} from "./attendance.atom";

import type { Attendance } from "./attendance.types";

export function useSelectedAttendance(): [Attendance | null, (attendance: Attendance | null) => void] {
  return useAtom(selectedAttendanceAtom);
}

export function useAddAttendanceDialog(): [boolean, (open: boolean) => void] {
  return useAtom(isAddAttendanceDialogOpenAtom);
}

export function useSetAddAttendanceDialog(): (open: boolean) => void {
  return useSetAtom(isAddAttendanceDialogOpenAtom);
}

export function useEditAttendanceDialog(): [boolean, (open: boolean) => void] {
  return useAtom(isEditAttendanceDialogOpenAtom);
}

export function useSetEditAttendanceDialog(): (open: boolean) => void {
  return useSetAtom(isEditAttendanceDialogOpenAtom);
}

const attendanceFormSchema = z.object({
  date: z.string().min(1, "날짜를 입력해주세요"),
  checkIn: z.string().nullable(),
  checkOut: z.string().nullable(),
  status: z.enum(["present", "late", "absent", "halfDay", "vacation"]),
  note: z.string().optional(),
});

export type AttendanceFormData = z.infer<typeof attendanceFormSchema>;

export function useCreateAttendanceForm() {
  return useForm<AttendanceFormData>({
    resolver: zodResolver(attendanceFormSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      checkIn: "09:00",
      checkOut: "18:00",
      status: "present",
      note: "",
    },
  });
}

export function useUpdateAttendanceForm(attendance: Attendance | null) {
  return useForm<AttendanceFormData>({
    resolver: zodResolver(attendanceFormSchema),
    values: attendance
      ? {
          date: attendance.date,
          checkIn: attendance.checkIn,
          checkOut: attendance.checkOut,
          status: attendance.status,
          note: attendance.note,
        }
      : undefined,
  });
}
