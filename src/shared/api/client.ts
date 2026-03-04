import { BASE_URL } from "@/shared/lib/env";
import { ApiError, BadRequestError, NetworkError, NotFoundError, TimeoutError } from "@/shared/lib/errors";
import { ERROR_CODES } from "@/shared/lib/errors";

type Query = Record<string, string | number | boolean | string[] | undefined>;

function toAbsoluteBase(base: string): string {
  if (/^https?:\/\//.test(base)) return base;
  const origin =
    typeof window !== "undefined" && window.location && window.location.origin
      ? window.location.origin
      : "http://localhost";
  const normalized = base.startsWith("/") ? base : `/${base}`;
  return origin + normalized;
}

function buildUrl(base: string, path: string, params?: Query) {
  const absoluteBase = toAbsoluteBase(base);
  const url = new URL(path.replace(/^\//, ""), absoluteBase.endsWith("/") ? absoluteBase : absoluteBase + "/");
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined) return;
      const serialized = Array.isArray(value)
        ? value.map(String).join(",")
        : typeof value === "string"
          ? value.replace(/\s*,\s*/g, ",").trim()
          : String(value);
      url.searchParams.set(key, serialized);
    });
  }
  return url.toString();
}

export interface HttpClient {
  get<T>(path: string, options?: { params?: Query; headers?: HeadersInit }): Promise<T>;
  post<T>(path: string, body?: unknown, options?: { headers?: HeadersInit }): Promise<T>;
  put<T>(path: string, body?: unknown, options?: { headers?: HeadersInit }): Promise<T>;
  patch<T>(path: string, body?: unknown, options?: { headers?: HeadersInit }): Promise<T>;
  delete<T>(path: string, options?: { headers?: HeadersInit }): Promise<T>;
}

export function createHttpClient(baseUrl: string): HttpClient {
  async function parseErrorBody(res: Response): Promise<{ data?: unknown; text?: string }> {
    try {
      const data = await res.clone().json();
      return { data };
    } catch {
      const text = await res.text().catch(() => "");
      return { text };
    }
  }

  function getErrorMessage(status: number, statusText: string, data?: unknown, text?: string): string {
    const prefix = `HTTP ${status} ${statusText}`;

    if (typeof data === "string" && data.trim()) return `${prefix} - ${data}`;
    if (data && typeof data === "object") {
      const maybeMessage = (data as { message?: unknown }).message;
      if (typeof maybeMessage === "string" && maybeMessage.trim()) {
        return `${prefix} - ${maybeMessage}`;
      }
    }
    if (text && text.trim()) return `${prefix} - ${text}`;
    return prefix;
  }

  function extractServerErrorCode(data: unknown): string | undefined {
    if (typeof data !== 'object' || data === null) return undefined;
    const obj = data as Record<string, unknown>;
    // { code: "EMPLOYEE_DUPLICATE_EMAIL", message: "..." }
    if (typeof obj.code === 'string') return obj.code;
    // { error: { code: "EMPLOYEE_DUPLICATE_EMAIL", message: "..." } }
    if (typeof obj.error === 'object' && obj.error !== null) {
      const inner = obj.error as Record<string, unknown>;
      if (typeof inner.code === 'string') return inner.code;
    }
    return undefined;
  }

  function mapHttpError(status: number, statusText: string, data?: unknown, text?: string): Error {
    const message = getErrorMessage(status, statusText, data, text);
    const serverCode = extractServerErrorCode(data);

    // 서버가 도메인 에러 코드를 응답한 경우 해당 코드 사용
    if (serverCode) {
      return new ApiError(message, serverCode, status, data);
    }

    // 서버 코드 없으면 HTTP status 기반 폴백
    if (status === 400) return new BadRequestError(message, data);
    if (status === 404) return new NotFoundError(message);
    if (status === 401 || status === 403) {
      return new ApiError(message, ERROR_CODES.UNAUTHORIZED, status, data);
    }
    if (status === 408) return new TimeoutError(message);
    if (status >= 500 && status < 600) {
      return new ApiError(message, ERROR_CODES.INTERNAL_SERVER_ERROR, status, data);
    }

    return new ApiError(message, ERROR_CODES.UNKNOWN_ERROR, status, data);
  }

  async function request<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
    try {
      const res = await fetch(input, init);
      if (!res.ok) {
        const { data, text } = await parseErrorBody(res);
        throw mapHttpError(res.status, res.statusText, data, text);
      }

      return (await res.json()) as T;
    } catch (error) {
      if (error instanceof ApiError || error instanceof BadRequestError || error instanceof NotFoundError) {
        throw error;
      }
      if (error instanceof TimeoutError) {
        throw error;
      }
      if (error instanceof DOMException && error.name === "AbortError") {
        throw new TimeoutError();
      }
      if (error instanceof TypeError) {
        throw new NetworkError(error.message);
      }
      throw error;
    }
  }

  return {
    get: (path, options) =>
      request(buildUrl(baseUrl, path, options?.params), {
        method: "GET",
        headers: options?.headers,
        cache: "no-store",
      }),
    post: (path, body, options) =>
      request(buildUrl(baseUrl, path), {
        method: "POST",
        headers: { "Content-Type": "application/json", ...options?.headers },
        body: body == null ? undefined : JSON.stringify(body),
      }),
    put: (path, body, options) =>
      request(buildUrl(baseUrl, path), {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...options?.headers },
        body: body == null ? undefined : JSON.stringify(body),
      }),
    patch: (path, body, options) =>
      request(buildUrl(baseUrl, path), {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...options?.headers },
        body: body == null ? undefined : JSON.stringify(body),
      }),
    delete: (path, options) => request(buildUrl(baseUrl, path), { method: "DELETE", headers: options?.headers }),
  };
}

export const http = createHttpClient(BASE_URL);
