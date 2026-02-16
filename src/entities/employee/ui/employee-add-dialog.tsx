
import { FormDialog } from "@/shared/ui/form-dialog";
import { Input } from "@/shared/ui/input";

import type { CreateEmployeeFormData } from "../model/employee.hook";
import type { UseFormReturn } from "react-hook-form";

type EmployeeAddDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<CreateEmployeeFormData>;
  onSubmit: () => Promise<void> | void;
};

export function EmployeeAddDialog({ open, onOpenChange, form, onSubmit }: Readonly<EmployeeAddDialogProps>) {
  const {
    register,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <FormDialog open={open} onOpenChange={onOpenChange} title="직원 추가" onSubmit={onSubmit} submitLabel="추가" disabled={isSubmitting}>
      <Input placeholder="이름" {...register("name")} error={errors.name?.message} />
      <Input placeholder="이메일" {...register("email")} error={errors.email?.message} />
      <Input placeholder="전화번호" {...register("phone")} error={errors.phone?.message} />
      <Input placeholder="직책" {...register("position")} error={errors.position?.message} />
      <Input
        type="number"
        placeholder="부서 ID"
        value={watch("departmentId")}
        onChange={(e) => setValue("departmentId", Number(e.target.value))}
        error={errors.departmentId?.message}
      />
      <Input type="date" {...register("hireDate")} error={errors.hireDate?.message} />
      <select
        className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm"
        value={watch("status")}
        onChange={(e) => setValue("status", e.target.value as CreateEmployeeFormData["status"])}
      >
        <option value="active">재직</option>
        <option value="onLeave">휴직</option>
        <option value="resigned">퇴사</option>
      </select>
    </FormDialog>
  );
}
