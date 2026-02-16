import { atom } from "jotai";

export const employeeDialogModeAtom = atom<"add" | "edit" | null>(null);
