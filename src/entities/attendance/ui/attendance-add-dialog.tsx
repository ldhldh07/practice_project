
import { FormDialog } from "@/shared/ui/form-dialog";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";

import type { AttendanceFormData } from "../model/attendance.hook";
import type { UseFormReturn } from "react-hook-form";

type AttendanceAddDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<AttendanceFormData>;
  onSubmit: () => Promise<void> | void;
};

export function AttendanceAddDialog({ open, onOpenChange, form, onSubmit }: Readonly<AttendanceAddDialogProps>) {
  const { register, setValue, watch, formState: { isSubmitting, errors } } = form;

  return (
    <FormDialog open={open} onOpenChange={onOpenChange} title="근태 추가" onSubmit={onSubmit} submitLabel="추가" disabled={isSubmitting}>
      <Input type="date" {...register("date")} error={errors.date?.message} />
      <Input placeholder="출근 (예: 09:00)" {...register("checkIn")} />
      <Input placeholder="퇴근 (예: 18:00)" {...register("checkOut")} />
      <select
        className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm"
        value={watch("status")}
        onChange={(e) => setValue("status", e.target.value as AttendanceFormData["status"])}
      >
        <option value="present">정상</option>
        <option value="late">지각</option>
        <option value="absent">결근</option>
        <option value="halfDay">반차</option>
        <option value="vacation">휴가</option>
      </select>
      <Textarea placeholder="메모" {...register("note")} />
    </FormDialog>
  );
}
