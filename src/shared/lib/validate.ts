import { z } from "zod";

import { ValidationError } from "./errors";

export const validateSchema = <T extends z.ZodTypeAny>(
  schema: T,
  data: unknown,
  errorMessage: string,
): z.infer<T> => {
  const result = schema.safeParse(data);

  if (!result.success) {
    throw new ValidationError(errorMessage, result.error.issues);
  }

  return result.data;
};
