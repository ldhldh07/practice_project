import { useId } from "react";

import { FormDialog } from "@/shared/ui/form-dialog";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";

import type { AttendanceFormData } from "../model/attendance.hook";
import type { UseFormReturn } from "react-hook-form";

type AttendanceEditDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<AttendanceFormData>;
  onSubmit: () => Promise<void> | void;
  error?: string | null;
};

export function AttendanceEditDialog({
  open,
  onOpenChange,
  form,
  onSubmit,
  error,
}: Readonly<AttendanceEditDialogProps>) {
  const id = useId();
  const {
    register,
    setValue,
    watch,
    formState: { isSubmitting, errors },
  } = form;

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="근태 수정"
      onSubmit={onSubmit}
      submitLabel="수정"
      disabled={isSubmitting}
      error={error}
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`${id}-date`}>일자</Label>
          <Input id={`${id}-date`} type="date" {...register("date")} error={errors.date?.message} />
        </div>
        <div className="space-y-2">
          <Label id={`${id}-status-label`}>근태 상태</Label>
          <Select
            value={watch("status")}
            onValueChange={(value) => setValue("status", value as AttendanceFormData["status"])}
          >
            <SelectTrigger aria-labelledby={`${id}-status-label`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="present">정상</SelectItem>
              <SelectItem value="late">지각</SelectItem>
              <SelectItem value="absent">결근</SelectItem>
              <SelectItem value="halfDay">반차</SelectItem>
              <SelectItem value="vacation">휴가</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${id}-checkIn`}>출근 시간</Label>
          <Input id={`${id}-checkIn`} placeholder="09:00" {...register("checkIn")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${id}-checkOut`}>퇴근 시간</Label>
          <Input id={`${id}-checkOut`} placeholder="18:00" {...register("checkOut")} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${id}-note`}>메모</Label>
        <Textarea id={`${id}-note`} placeholder="특이사항을 입력하세요" {...register("note")} />
      </div>
    </FormDialog>
  );
}
