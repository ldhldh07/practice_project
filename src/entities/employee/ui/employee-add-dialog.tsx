import { FormDialog } from "@/shared/ui/form-dialog";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";

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
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="직원 추가"
      onSubmit={onSubmit}
      submitLabel="추가"
      disabled={isSubmitting}
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>이름</Label>
          <Input placeholder="홍길동" {...register("name")} error={errors.name?.message} />
        </div>
        <div className="space-y-2">
          <Label>이메일</Label>
          <Input placeholder="email@company.com" {...register("email")} error={errors.email?.message} />
        </div>
        <div className="space-y-2">
          <Label>전화번호</Label>
          <Input placeholder="010-0000-0000" {...register("phone")} error={errors.phone?.message} />
        </div>
        <div className="space-y-2">
          <Label>직책</Label>
          <Input placeholder="사원" {...register("position")} error={errors.position?.message} />
        </div>
        <div className="space-y-2">
          <Label>부서 ID</Label>
          <Input
            type="number"
            placeholder="1"
            value={watch("departmentId")}
            onChange={(e) => setValue("departmentId", Number(e.target.value))}
            error={errors.departmentId?.message}
          />
        </div>
        <div className="space-y-2">
          <Label>입사일</Label>
          <Input type="date" {...register("hireDate")} error={errors.hireDate?.message} />
        </div>
      </div>
      <div className="space-y-2">
        <Label>재직 상태</Label>
        <Select
          value={watch("status")}
          onValueChange={(value) => setValue("status", value as CreateEmployeeFormData["status"])}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">재직</SelectItem>
            <SelectItem value="onLeave">휴직</SelectItem>
            <SelectItem value="resigned">퇴사</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </FormDialog>
  );
}
