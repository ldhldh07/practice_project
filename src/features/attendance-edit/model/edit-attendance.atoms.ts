import { atom } from "jotai";

export const attendanceDialogModeAtom = atom<"add" | "edit" | null>(null);
