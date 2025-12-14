import { z } from "zod";

export function createApiValidator<T>(schema: z.ZodSchema<T>) {
  return {
    validate: (data: unknown): T => {
      try {
        return schema.parse(data);
      } catch (error) {
        console.error("API 응답 검증 실패:", error);
        throw new Error("API 응답 형식이 올바르지 않습니다.");
      }
    },
  };
}

export async function withValidation<T>(
  apiCall: () => Promise<unknown>,
  validator: ReturnType<typeof createApiValidator<T>>,
): Promise<T> {
  const data = await apiCall();
  return validator.validate(data);
}
