// API 에러 코드
export const API_ERROR_CODES = {
  BAD_REQUEST: "BAD_REQUEST",
  NOT_FOUND: "NOT_FOUND",
  UNAUTHORIZED: "UNAUTHORIZED",
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
} as const;

// 클라이언트 에러 코드
export const CLIENT_ERROR_CODES = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  RESPONSE_PARSE_ERROR: "RESPONSE_PARSE_ERROR",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
} as const;

// 네트워크 에러 코드
export const NETWORK_ERROR_CODES = {
  NETWORK_ERROR: "NETWORK_ERROR",
  TIMEOUT: "TIMEOUT",
  SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
} as const;

// 전체 에러 코드
export const ERROR_CODES = {
  ...API_ERROR_CODES,
  ...CLIENT_ERROR_CODES,
  ...NETWORK_ERROR_CODES,
} as const;

// 타입 정의
export type ApiErrorCode = (typeof API_ERROR_CODES)[keyof typeof API_ERROR_CODES];
export type ClientErrorCode = (typeof CLIENT_ERROR_CODES)[keyof typeof CLIENT_ERROR_CODES];
export type NetworkErrorCode = (typeof NETWORK_ERROR_CODES)[keyof typeof NETWORK_ERROR_CODES];
export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

// 에러 메시지 매핑
export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  // API 에러
  BAD_REQUEST: "잘못된 요청입니다.",
  NOT_FOUND: "요청한 리소스를 찾을 수 없습니다.",
  UNAUTHORIZED: "인증이 필요합니다.",
  INTERNAL_SERVER_ERROR: "서버 오류가 발생했습니다.",

  // 클라이언트 에러
  VALIDATION_ERROR: "데이터 형식이 올바르지 않습니다.",
  RESPONSE_PARSE_ERROR: "응답 데이터 형식이 올바르지 않습니다.",
  UNKNOWN_ERROR: "알 수 없는 오류가 발생했습니다.",

  // 네트워크 에러
  NETWORK_ERROR: "네트워크 오류가 발생했습니다.",
  TIMEOUT: "요청 시간이 초과되었습니다.",
  SERVICE_UNAVAILABLE: "서비스를 일시적으로 사용할 수 없습니다.",
};

// 에러 메시지 가져오기 유틸
export const getErrorMessage = (code: string, fallback?: string): string => {
  return ERROR_MESSAGES[code as ErrorCode] || fallback || "알 수 없는 오류가 발생했습니다.";
};
