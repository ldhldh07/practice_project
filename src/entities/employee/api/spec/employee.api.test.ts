import { afterEach, describe, expect, it, vi } from "vitest";

import { ValidationError } from "@/shared/lib/errors";

import { employeeApi } from "../employee.api";

import type { EmployeesParams } from "../employee.api";

function jsonResponse(data: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
}

describe("employeeApi", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("getList", () => {
    it("returns validated EmployeesResponse when response is valid", async () => {
      const mockData = {
        employees: [
          {
            id: 1,
            name: "홍길동",
            email: "hong@example.com",
            phone: "010-1234-5678",
            position: "개발자",
            departmentId: 1,
            hireDate: "2024-01-01",
            status: "active",
          },
        ],
        total: 1,
        skip: 0,
        limit: 10,
      };

      vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(mockData)));

      const params: EmployeesParams = { limit: 10, skip: 0 };
      const result = await employeeApi.getList(params);

      expect(result).toEqual(mockData);
      expect(result.employees).toHaveLength(1);
      expect(result.employees[0].name).toBe("홍길동");
    });

    it("serializes query params correctly", async () => {
      const mockData = {
        employees: [],
        total: 0,
        skip: 0,
        limit: 10,
      };

      const fetchMock = vi.fn().mockResolvedValue(jsonResponse(mockData));
      vi.stubGlobal("fetch", fetchMock);

      const params: EmployeesParams = {
        limit: 10,
        skip: 0,
        search: "홍길동",
        departmentId: 1,
        status: "active",
        sortBy: "name",
        order: "asc",
      };

      await employeeApi.getList(params);

      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [requestUrl] = fetchMock.mock.calls[0] as [string, RequestInit];
      expect(requestUrl).toContain("limit=10");
      expect(requestUrl).toContain("skip=0");
      expect(requestUrl).toContain("search=%ED%99%8D%EA%B8%B8%EB%8F%99");
      expect(requestUrl).toContain("departmentId=1");
      expect(requestUrl).toContain("status=active");
      expect(requestUrl).toContain("sortBy=name");
      expect(requestUrl).toContain("order=asc");
    });

    it("throws ValidationError when response is missing required field", async () => {
      const invalidData = {
        employees: [
          {
            id: 1,
            name: "홍길동",
            // email 누락
            phone: "010-1234-5678",
            position: "개발자",
            departmentId: 1,
            hireDate: "2024-01-01",
            status: "active",
          },
        ],
        total: 1,
        skip: 0,
        limit: 10,
      };

      vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(invalidData)));

      const params: EmployeesParams = { limit: 10, skip: 0 };

      try {
        await employeeApi.getList(params);
        expect.fail("Should have thrown ValidationError");
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect((error as ValidationError).message).toBe("직원 목록 응답 검증 실패");
      }
    });

    it("throws ValidationError when response has wrong type", async () => {
      const invalidData = {
        employees: [
          {
            id: "not-a-number", // 잘못된 타입
            name: "홍길동",
            email: "hong@example.com",
            phone: "010-1234-5678",
            position: "개발자",
            departmentId: 1,
            hireDate: "2024-01-01",
            status: "active",
          },
        ],
        total: 1,
        skip: 0,
        limit: 10,
      };

      vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(invalidData)));

      const params: EmployeesParams = { limit: 10, skip: 0 };

      try {
        await employeeApi.getList(params);
        expect.fail("Should have thrown ValidationError");
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect((error as ValidationError).issues).toBeDefined();
        expect((error as ValidationError).issues.length).toBeGreaterThan(0);
      }
    });
  });

  describe("getById", () => {
    it("returns validated Employee when response is valid", async () => {
      const mockData = {
        id: 1,
        name: "홍길동",
        email: "hong@example.com",
        phone: "010-1234-5678",
        position: "개발자",
        departmentId: 1,
        hireDate: "2024-01-01",
        status: "active",
        profileImage: "https://example.com/profile.jpg",
      };

      vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(mockData)));

      const result = await employeeApi.getById(1);

      expect(result).toEqual(mockData);
      expect(result.id).toBe(1);
      expect(result.name).toBe("홍길동");
    });

    it("throws ValidationError when response is incomplete", async () => {
      const invalidData = {
        id: 1,
        name: "홍길동",
        // 필수 필드 누락
      };

      vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(invalidData)));

      try {
        await employeeApi.getById(1);
        expect.fail("Should have thrown ValidationError");
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect((error as ValidationError).message).toBe("직원 상세 응답 검증 실패");
      }
    });

    it("throws ValidationError when status enum is invalid", async () => {
      const invalidData = {
        id: 1,
        name: "홍길동",
        email: "hong@example.com",
        phone: "010-1234-5678",
        position: "개발자",
        departmentId: 1,
        hireDate: "2024-01-01",
        status: "invalid-status", // 잘못된 enum 값
      };

      vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(invalidData)));

      await expect(employeeApi.getById(1)).rejects.toThrow(ValidationError);
    });
  });

  describe("create", () => {
    it("returns validated Employee when creation succeeds", async () => {
      const mockData = {
        id: 2,
        name: "김철수",
        email: "kim@example.com",
        phone: "010-9876-5432",
        position: "디자이너",
        departmentId: 2,
        hireDate: "2024-02-01",
        status: "active",
      };

      vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(mockData)));

      const payload = {
        name: "김철수",
        email: "kim@example.com",
        phone: "010-9876-5432",
        position: "디자이너",
        departmentId: 2,
        hireDate: "2024-02-01",
        status: "active" as const,
      };

      const result = await employeeApi.create(payload);

      expect(result).toEqual(mockData);
      expect(result.id).toBe(2);
      expect(result.name).toBe("김철수");
    });

    it("throws ValidationError when created employee response is invalid", async () => {
      const invalidData = {
        id: 2,
        // 필수 필드 누락
      };

      vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(invalidData)));

      const payload = {
        name: "김철수",
        email: "kim@example.com",
        phone: "010-9876-5432",
        position: "디자이너",
        departmentId: 2,
        hireDate: "2024-02-01",
        status: "active" as const,
      };

      try {
        await employeeApi.create(payload);
        expect.fail("Should have thrown ValidationError");
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect((error as ValidationError).message).toBe("직원 생성 응답 검증 실패");
      }
    });
  });

  describe("update", () => {
    it("returns validated Employee when update succeeds", async () => {
      const mockData = {
        id: 1,
        name: "홍길동",
        email: "hong.updated@example.com",
        phone: "010-1111-2222",
        position: "시니어 개발자",
        departmentId: 1,
        hireDate: "2024-01-01",
        status: "active",
      };

      vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(mockData)));

      const result = await employeeApi.update({
        employeeId: 1,
        params: {
          email: "hong.updated@example.com",
          phone: "010-1111-2222",
          position: "시니어 개발자",
        },
      });

      expect(result).toEqual(mockData);
      expect(result.email).toBe("hong.updated@example.com");
      expect(result.position).toBe("시니어 개발자");
    });

    it("throws ValidationError when updated employee response is invalid", async () => {
      const invalidData = {
        id: 1,
        name: "홍길동",
        // 필수 필드 누락
      };

      vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(invalidData)));

      try {
        await employeeApi.update({
          employeeId: 1,
          params: { position: "시니어 개발자" },
        });
        expect.fail("Should have thrown ValidationError");
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect((error as ValidationError).message).toBe("직원 수정 응답 검증 실패");
      }
    });
  });

  describe("remove", () => {
    it("resolves without error when deletion succeeds", async () => {
      vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse({})));

      await expect(employeeApi.remove(1)).resolves.not.toThrow();
    });

    it("throws error when deletion fails with HTTP error", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue(new Response("Not Found", { status: 404, statusText: "Not Found" })),
      );

      await expect(employeeApi.remove(1)).rejects.toThrow("HTTP 404 Not Found");
    });
  });
});
