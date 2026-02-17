import { describe, expect, it } from "vitest";

import { ERROR_CODES, getErrorMessage } from "../error-codes";
import {
  ApiError,
  AppError,
  BadRequestError,
  BaseError,
  NetworkError,
  NotFoundError,
  ResponseParseError,
  TimeoutError,
  ValidationError,
} from "../errors";

import type { ZodIssue } from "zod";

describe("Error Class Hierarchy", () => {
  describe("BaseError", () => {
    it("has code, message, and name='BaseError'", () => {
      const error = new BaseError("test message", "TEST_CODE");

      expect(error.code).toBe("TEST_CODE");
      expect(error.message).toBe("test message");
      expect(error.name).toBe("BaseError");
      expect(error).toBeInstanceOf(Error);
    });
  });

  describe("ApiError", () => {
    it("extends BaseError and has statusCode, data", () => {
      const error = new ApiError("api error", "API_CODE", 500, { detail: "extra" });

      expect(error).toBeInstanceOf(BaseError);
      expect(error.code).toBe("API_CODE");
      expect(error.message).toBe("api error");
      expect(error.statusCode).toBe(500);
      expect(error.data).toEqual({ detail: "extra" });
    });

    it("allows optional statusCode and data", () => {
      const error = new ApiError("api error", "API_CODE");

      expect(error.statusCode).toBeUndefined();
      expect(error.data).toBeUndefined();
    });
  });

  describe("NotFoundError", () => {
    it("extends ApiError with code='NOT_FOUND', statusCode=404", () => {
      const error = new NotFoundError();

      expect(error).toBeInstanceOf(ApiError);
      expect(error.code).toBe(ERROR_CODES.NOT_FOUND);
      expect(error.statusCode).toBe(404);
      expect(error.message).toBe("요청한 리소스를 찾을 수 없습니다.");
    });

    it("accepts custom message", () => {
      const error = new NotFoundError("custom not found");

      expect(error.message).toBe("custom not found");
      expect(error.code).toBe(ERROR_CODES.NOT_FOUND);
      expect(error.statusCode).toBe(404);
    });
  });

  describe("BadRequestError", () => {
    it("extends ApiError with code='BAD_REQUEST', statusCode=400", () => {
      const error = new BadRequestError();

      expect(error).toBeInstanceOf(ApiError);
      expect(error.code).toBe(ERROR_CODES.BAD_REQUEST);
      expect(error.statusCode).toBe(400);
      expect(error.message).toBe("잘못된 요청입니다.");
    });

    it("accepts custom message and data", () => {
      const error = new BadRequestError("custom bad request", { field: "email" });

      expect(error.message).toBe("custom bad request");
      expect(error.data).toEqual({ field: "email" });
      expect(error.code).toBe(ERROR_CODES.BAD_REQUEST);
      expect(error.statusCode).toBe(400);
    });
  });

  describe("NetworkError", () => {
    it("extends BaseError with default code='NETWORK_ERROR'", () => {
      const error = new NetworkError();

      expect(error).toBeInstanceOf(BaseError);
      expect(error.code).toBe(ERROR_CODES.NETWORK_ERROR);
      expect(error.message).toBe("네트워크 오류가 발생했습니다.");
    });

    it("accepts custom message and code", () => {
      const error = new NetworkError("custom network error", "CUSTOM_NETWORK_CODE");

      expect(error.message).toBe("custom network error");
      expect(error.code).toBe("CUSTOM_NETWORK_CODE");
    });
  });

  describe("TimeoutError", () => {
    it("extends NetworkError with code='TIMEOUT'", () => {
      const error = new TimeoutError();

      expect(error).toBeInstanceOf(NetworkError);
      expect(error).toBeInstanceOf(BaseError);
      expect(error.code).toBe(ERROR_CODES.TIMEOUT);
      expect(error.message).toBe("요청 시간이 초과되었습니다.");
    });

    it("accepts custom message", () => {
      const error = new TimeoutError("custom timeout");

      expect(error.message).toBe("custom timeout");
      expect(error.code).toBe(ERROR_CODES.TIMEOUT);
    });
  });

  describe("ValidationError", () => {
    it("has issues array with ZodIssue-compatible shape", () => {
      const mockIssues = [
        {
          code: "invalid_type" as const,
          expected: "string",
          received: "number",
          path: ["name"],
          message: "Expected string, received number",
        },
      ];

      const error = new ValidationError("validation failed", mockIssues as ZodIssue[]);

      expect(error.name).toBe("ValidationError");
      expect(error.message).toBe("validation failed");
      expect(error.issues).toEqual(mockIssues);
      expect(error.issues.length).toBe(1);
    });
  });

  describe("ResponseParseError", () => {
    it("extends BaseError with code='RESPONSE_PARSE_ERROR'", () => {
      const error = new ResponseParseError();

      expect(error).toBeInstanceOf(BaseError);
      expect(error.code).toBe(ERROR_CODES.RESPONSE_PARSE_ERROR);
      expect(error.message).toBe("응답 데이터 형식이 올바르지 않습니다.");
    });

    it("accepts custom message", () => {
      const error = new ResponseParseError("custom parse error");

      expect(error.message).toBe("custom parse error");
      expect(error.code).toBe(ERROR_CODES.RESPONSE_PARSE_ERROR);
    });
  });
});

describe("Type Guards", () => {
  describe("AppError.is", () => {
    it("returns true for BaseError instances", () => {
      const error = new BaseError("test", "TEST_CODE");

      expect(AppError.is(error)).toBe(true);
    });

    it("returns true for ApiError instances (inheritance)", () => {
      const error = new ApiError("test", "TEST_CODE");

      expect(AppError.is(error)).toBe(true);
    });

    it("returns false for standard Error", () => {
      const error = new Error("standard error");

      expect(AppError.is(error)).toBe(false);
    });

    it("returns false for non-error values", () => {
      expect(AppError.is(null)).toBe(false);
      expect(AppError.is(undefined)).toBe(false);
      expect(AppError.is("string")).toBe(false);
      expect(AppError.is({})).toBe(false);
    });
  });

  describe("AppError.isApi", () => {
    it("returns true for ApiError instances", () => {
      const error = new ApiError("test", "TEST_CODE");

      expect(AppError.isApi(error)).toBe(true);
    });

    it("returns true for NotFoundError (inheritance)", () => {
      const error = new NotFoundError();

      expect(AppError.isApi(error)).toBe(true);
    });

    it("returns true for BadRequestError (inheritance)", () => {
      const error = new BadRequestError();

      expect(AppError.isApi(error)).toBe(true);
    });

    it("returns false for NetworkError", () => {
      const error = new NetworkError();

      expect(AppError.isApi(error)).toBe(false);
    });

    it("returns false for BaseError", () => {
      const error = new BaseError("test", "TEST_CODE");

      expect(AppError.isApi(error)).toBe(false);
    });
  });

  describe("AppError.isNetwork", () => {
    it("returns true for NetworkError instances", () => {
      const error = new NetworkError();

      expect(AppError.isNetwork(error)).toBe(true);
    });

    it("returns true for TimeoutError (inheritance)", () => {
      const error = new TimeoutError();

      expect(AppError.isNetwork(error)).toBe(true);
    });

    it("returns false for ApiError", () => {
      const error = new ApiError("test", "TEST_CODE");

      expect(AppError.isNetwork(error)).toBe(false);
    });

    it("returns false for BaseError", () => {
      const error = new BaseError("test", "TEST_CODE");

      expect(AppError.isNetwork(error)).toBe(false);
    });
  });

  describe("AppError.isValidation", () => {
    it("returns true for ValidationError instances", () => {
      const error = new ValidationError("test", []);

      expect(AppError.isValidation(error)).toBe(true);
    });

    it("returns false for ApiError", () => {
      const error = new ApiError("test", "TEST_CODE");

      expect(AppError.isValidation(error)).toBe(false);
    });

    it("returns false for BaseError", () => {
      const error = new BaseError("test", "TEST_CODE");

      expect(AppError.isValidation(error)).toBe(false);
    });
  });

  describe("AppError.isResponseParse", () => {
    it("returns true for ResponseParseError instances", () => {
      const error = new ResponseParseError();

      expect(AppError.isResponseParse(error)).toBe(true);
    });

    it("returns false for ApiError", () => {
      const error = new ApiError("test", "TEST_CODE");

      expect(AppError.isResponseParse(error)).toBe(false);
    });

    it("returns false for BaseError", () => {
      const error = new BaseError("test", "TEST_CODE");

      expect(AppError.isResponseParse(error)).toBe(false);
    });
  });

  describe("AppError.hasCode", () => {
    it("returns true when error has matching code", () => {
      const error = new BaseError("test", "TEST_CODE");

      expect(AppError.hasCode(error, "TEST_CODE")).toBe(true);
    });

    it("returns false when error has different code", () => {
      const error = new BaseError("test", "TEST_CODE");

      expect(AppError.hasCode(error, "OTHER_CODE")).toBe(false);
    });

    it("returns false for non-BaseError instances", () => {
      const error = new Error("standard error");

      expect(AppError.hasCode(error, "TEST_CODE")).toBe(false);
    });

    it("works with ApiError subclasses", () => {
      const error = new NotFoundError();

      expect(AppError.hasCode(error, ERROR_CODES.NOT_FOUND)).toBe(true);
      expect(AppError.hasCode(error, ERROR_CODES.BAD_REQUEST)).toBe(false);
    });
  });
});

describe("Factory", () => {
  describe("AppError.fromCode", () => {
    it("creates BadRequestError for BAD_REQUEST code", () => {
      const error = AppError.fromCode(ERROR_CODES.BAD_REQUEST, "custom message");

      expect(error).toBeInstanceOf(BadRequestError);
      expect(error.message).toBe("custom message");
    });

    it("creates NotFoundError for NOT_FOUND code", () => {
      const error = AppError.fromCode(ERROR_CODES.NOT_FOUND, "custom message");

      expect(error).toBeInstanceOf(NotFoundError);
      expect(error.message).toBe("custom message");
    });

    it("creates NetworkError for NETWORK_ERROR code", () => {
      const error = AppError.fromCode(ERROR_CODES.NETWORK_ERROR, "custom message");

      expect(error).toBeInstanceOf(NetworkError);
      expect(error.message).toBe("custom message");
    });

    it("creates TimeoutError for TIMEOUT code", () => {
      const error = AppError.fromCode(ERROR_CODES.TIMEOUT, "custom message");

      expect(error).toBeInstanceOf(TimeoutError);
      expect(error.message).toBe("custom message");
    });

    it("creates ApiError for unknown code (fallback)", () => {
      const error = AppError.fromCode("UNKNOWN_CODE", "custom message", 418);

      expect(error).toBeInstanceOf(ApiError);
      expect(error).not.toBeInstanceOf(BadRequestError);
      expect(error).not.toBeInstanceOf(NotFoundError);
      expect(error.message).toBe("custom message");
      if (error instanceof ApiError) {
        expect(error.code).toBe("UNKNOWN_CODE");
        expect(error.statusCode).toBe(418);
      }
    });

    it("passes data to BadRequestError", () => {
      const error = AppError.fromCode(ERROR_CODES.BAD_REQUEST, "custom message", undefined, { field: "email" });

      expect(error).toBeInstanceOf(BadRequestError);
      if (error instanceof BadRequestError) {
        expect(error.data).toEqual({ field: "email" });
      }
    });
  });
});

describe("Error Message Mapping", () => {
  describe("getErrorMessage", () => {
    it("returns mapped message for known code", () => {
      expect(getErrorMessage(ERROR_CODES.BAD_REQUEST)).toBe("잘못된 요청입니다.");
      expect(getErrorMessage(ERROR_CODES.NOT_FOUND)).toBe("요청한 리소스를 찾을 수 없습니다.");
      expect(getErrorMessage(ERROR_CODES.NETWORK_ERROR)).toBe("네트워크 오류가 발생했습니다.");
      expect(getErrorMessage(ERROR_CODES.TIMEOUT)).toBe("요청 시간이 초과되었습니다.");
    });

    it("returns fallback message for unknown code", () => {
      expect(getErrorMessage("UNKNOWN_CODE", "custom fallback")).toBe("custom fallback");
    });

    it("returns default message when no fallback provided", () => {
      expect(getErrorMessage("UNKNOWN_CODE")).toBe("알 수 없는 오류가 발생했습니다.");
    });

    it("handles all ERROR_CODES constants", () => {
      const knownCodes = Object.values(ERROR_CODES);
      const unknownErrorCode = ERROR_CODES.UNKNOWN_ERROR;

      knownCodes.forEach((code) => {
        const message = getErrorMessage(code);
        expect(message).toBeTruthy();

        // UNKNOWN_ERROR code itself maps to the default message, which is expected
        if (code === unknownErrorCode) {
          expect(message).toBe("알 수 없는 오류가 발생했습니다.");
        } else {
          expect(message).not.toBe("알 수 없는 오류가 발생했습니다.");
        }
      });
    });
  });
});
