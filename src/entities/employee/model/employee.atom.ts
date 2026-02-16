import { atom } from "jotai";

import type { Employee } from "./employee.types";

export const selectedEmployeeAtom = atom<Employee | null>(null);
export const isEmployeeDetailDialogOpenAtom = atom(false);
export const isAddEmployeeDialogOpenAtom = atom(false);
export const isEditEmployeeDialogOpenAtom = atom(false);
