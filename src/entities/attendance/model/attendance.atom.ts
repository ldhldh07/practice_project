import { atom } from "jotai";

import type { Attendance } from "./attendance.types";

export const selectedAttendanceAtom = atom<Attendance | null>(null);
export const isAddAttendanceDialogOpenAtom = atom(false);
export const isEditAttendanceDialogOpenAtom = atom(false);
