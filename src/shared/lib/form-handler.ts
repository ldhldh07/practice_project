import type { UseFormReturn, FieldValues } from "react-hook-form";

export function createModalFormHandler<T extends FieldValues>(
  form: UseFormReturn<T>,
  closeModal: () => void,
  resetOnSuccess = true,
) {
  return (onValid: (data: T) => Promise<void> | void) => {
    return form.handleSubmit(
      async (data) => {
        try {
          await onValid(data);
          if (resetOnSuccess) {
            form.reset();
          }
        } catch (error) {
          console.error("폼 제출 중 오류:", error);
        } finally {
          closeModal();
        }
      },
      (errors) => {
        console.log("폼 검증 실패:", errors);
      },
    );
  };
}
