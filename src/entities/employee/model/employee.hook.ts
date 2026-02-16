import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { isAddEmployeeDialogOpenAtom, isEditEmployeeDialogOpenAtom, isEmployeeDetailDialogOpenAtom, selectedEmployeeAtom } from "./employee.atom";
import { employeeQueryKeys } from "./employee.keys";
import { employeeApi } from "../api/employee.api";

import type { Employee } from "./employee.types";

export function useSelectedEmployee(): [Employee | null, (employee: Employee | null) => void] {
  return useAtom(selectedEmployeeAtom);
}

export function useEmployeeDetailDialog(): [boolean, (open: boolean) => void] {
  return useAtom(isEmployeeDetailDialogOpenAtom);
}

export function useAddEmployeeDialog(): [boolean, (open: boolean) => void] {
  return useAtom(isAddEmployeeDialogOpenAtom);
}

export function useEditEmployeeDialog(): [boolean, (open: boolean) => void] {
  return useAtom(isEditEmployeeDialogOpenAtom);
}

export function useEmployeeManager() {
  const queryClient = useQueryClient();

  return {
    getById: (id: number) => employeeApi.getById(id),

    prefetchById: (id: number) =>
      queryClient.prefetchQuery({
        queryKey: employeeQueryKeys.detail(id),
        queryFn: () => employeeApi.getById(id),
      }),
  };
}

const createEmployeeFormSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요"),
  email: z.string().email("올바른 이메일을 입력해주세요"),
  phone: z.string().min(1, "전화번호를 입력해주세요"),
  position: z.string().min(1, "직책을 입력해주세요"),
  departmentId: z.number().min(1, "부서를 선택해주세요"),
  hireDate: z.string().min(1, "입사일을 입력해주세요"),
  status: z.enum(["active", "onLeave", "resigned"]),
});

export type CreateEmployeeFormData = z.infer<typeof createEmployeeFormSchema>;

const updateEmployeeFormSchema = z.object({
  name: z.string().min(1, "이름을 입력해주세요"),
  email: z.string().email("올바른 이메일을 입력해주세요"),
  phone: z.string().min(1, "전화번호를 입력해주세요"),
  position: z.string().min(1, "직책을 입력해주세요"),
  departmentId: z.number().min(1, "부서를 선택해주세요"),
  hireDate: z.string().min(1, "입사일을 입력해주세요"),
  status: z.enum(["active", "onLeave", "resigned"]),
});

export type UpdateEmployeeFormData = z.infer<typeof updateEmployeeFormSchema>;

export function useCreateEmployeeForm() {
  return useForm<CreateEmployeeFormData>({
    resolver: zodResolver(createEmployeeFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      position: "",
      departmentId: 1,
      hireDate: new Date().toISOString().split("T")[0],
      status: "active",
    },
  });
}

export function useUpdateEmployeeForm(employee: Employee | null) {
  return useForm<UpdateEmployeeFormData>({
    resolver: zodResolver(updateEmployeeFormSchema),
    values: employee
      ? {
          name: employee.name,
          email: employee.email,
          phone: employee.phone,
          position: employee.position,
          departmentId: employee.departmentId,
          hireDate: employee.hireDate,
          status: employee.status,
        }
      : undefined,
  });
}
