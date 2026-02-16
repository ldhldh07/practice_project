import type { UseFormReturn, FieldValues } from "react-hook-form";

export function createModalFormHandler<T extends FieldValues>(
  form: UseFormReturn<T>,
  closeModal: () => void,
  resetOnSuccess = true,
) {
  return (onValid: (data: T) => Promise<void> | void) => {
    return form.handleSubmit(async (data) => {
      try {
        await onValid(data);
        if (resetOnSuccess) {
          form.reset();
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "폼 제출 중 오류가 발생했습니다.";
        form.setError("root", { type: "server", message });
      } finally {
        closeModal();
      }
    });
  };
}
