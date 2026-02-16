import type { ZodIssue } from "zod";

import { ERROR_CODES } from "./error-codes";

export class BaseError extends Error {
  readonly code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
  }
}

export class ApiError extends BaseError {
  readonly statusCode?: number;
  readonly data?: unknown;

  constructor(message: string, code: string, statusCode?: number, data?: unknown) {
    super(message, code);
    this.statusCode = statusCode;
    this.data = data;
  }
}

export class NotFoundError extends ApiError {
  constructor(message = "요청한 리소스를 찾을 수 없습니다.") {
    super(message, ERROR_CODES.NOT_FOUND, 404);
  }
}

export class BadRequestError extends ApiError {
  constructor(message = "잘못된 요청입니다.", data?: unknown) {
    super(message, ERROR_CODES.BAD_REQUEST, 400, data);
  }
}

export class NetworkError extends BaseError {
  constructor(message = "네트워크 오류가 발생했습니다.", code = ERROR_CODES.NETWORK_ERROR) {
    super(message, code);
  }
}

export class TimeoutError extends NetworkError {
  constructor(message = "요청 시간이 초과되었습니다.") {
    super(message, ERROR_CODES.TIMEOUT);
  }
}

export class ValidationError extends Error {
  readonly issues: ZodIssue[];

  constructor(message: string, issues: ZodIssue[]) {
    super(message);
    this.name = "ValidationError";
    this.issues = issues;
  }
}

export class ResponseParseError extends BaseError {
  constructor(message = "응답 데이터 형식이 올바르지 않습니다.") {
    super(message, ERROR_CODES.RESPONSE_PARSE_ERROR);
  }
}

export const AppError = {
  Base: BaseError,
  Api: ApiError,
  NotFound: NotFoundError,
  BadRequest: BadRequestError,
  Network: NetworkError,
  Timeout: TimeoutError,
  Validation: ValidationError,
  ResponseParse: ResponseParseError,

  is: (error: unknown): error is BaseError => error instanceof BaseError,
  isApi: (error: unknown): error is ApiError => error instanceof ApiError,
  isNetwork: (error: unknown): error is NetworkError => error instanceof NetworkError,
  isValidation: (error: unknown): error is ValidationError => error instanceof ValidationError,
  isResponseParse: (error: unknown): error is ResponseParseError => error instanceof ResponseParseError,

  hasCode: (error: unknown, code: string): error is BaseError =>
    error instanceof BaseError && error.code === code,

  fromCode: (code: string, message: string, statusCode?: number, data?: unknown): Error => {
    switch (code) {
      case ERROR_CODES.BAD_REQUEST:
        return new BadRequestError(message, data);
      case ERROR_CODES.NOT_FOUND:
        return new NotFoundError(message);
      case ERROR_CODES.NETWORK_ERROR:
        return new NetworkError(message);
      case ERROR_CODES.TIMEOUT:
        return new TimeoutError(message);
      default:
        return new ApiError(message, code, statusCode, data);
    }
  },
} as const;
