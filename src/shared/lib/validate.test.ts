import { describe, expect, it } from "vitest";
import { z } from "zod";

import { ValidationError } from "./errors";
import { validateSchema } from "./validate";

describe("validateSchema", () => {
  const userSchema = z.object({
    id: z.number(),
    name: z.string().min(1),
  });

  it("returns parsed data when validation succeeds", () => {
    const result = validateSchema(userSchema, { id: 1, name: "Lee" }, "validation failed");

    expect(result).toEqual({ id: 1, name: "Lee" });
  });

  it("throws ValidationError with zod issues when validation fails", () => {
    expect(() => validateSchema(userSchema, { id: "1", name: "" }, "validation failed")).toThrow(ValidationError);

    try {
      validateSchema(userSchema, { id: "1", name: "" }, "validation failed");
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      const validationError = error as ValidationError;
      expect(validationError.message).toBe("validation failed");
      expect(validationError.issues.length).toBeGreaterThan(0);
    }
  });
});
