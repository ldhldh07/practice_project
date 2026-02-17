import { afterEach, describe, expect, it, vi } from "vitest";

import { ValidationError } from "@/shared/lib/errors";

import { attendanceApi } from "../attendance.api";

function jsonResponse(data: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
}

describe("attendanceApi", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("getByEmployee", () => {
    it("returns validated AttendanceListResponse when response is valid", async () => {
      const mockData = {
        attendance: [
          {
            id: 1,
            employeeId: 1,
            date: "2024-01-15",
            checkIn: "09:00:00",
            checkOut: "18:00:00",
            status: "present",
            note: "정상 출근",
          },
          {
            id: 2,
            employeeId: 1,
            date: "2024-01-16",
            checkIn: "09:30:00",
            checkOut: "18:00:00",
            status: "late",
          },
        ],
        total: 2,
      };

      vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(mockData)));

      const result = await attendanceApi.getByEmployee(1);

      expect(result).toEqual(mockData);
      expect(result.attendance).toHaveLength(2);
      expect(result.attendance[0].status).toBe("present");
      expect(result.attendance[1].status).toBe("late");
    });

    it("handles nullable checkIn/checkOut fields correctly", async () => {
      const mockData = {
        attendance: [
          {
            id: 3,
            employeeId: 1,
            date: "2024-01-17",
            checkIn: null,
            checkOut: null,
            status: "absent",
          },
        ],
        total: 1,
      };

      vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(mockData)));

      const result = await attendanceApi.getByEmployee(1);

      expect(result.attendance[0].checkIn).toBeNull();
      expect(result.attendance[0].checkOut).toBeNull();
      expect(result.attendance[0].status).toBe("absent");
    });

    it("throws ValidationError when response is missing required field", async () => {
      const invalidData = {
        attendance: [
          {
            id: 1,
            employeeId: 1,
            date: "2024-01-15",
            checkIn: "09:00:00",
            checkOut: "18:00:00",
          },
        ],
        total: 1,
      };

      vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(invalidData)));

      try {
        await attendanceApi.getByEmployee(1);
        expect.fail("Should have thrown ValidationError");
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect((error as ValidationError).message).toBe("근태 목록 응답 검증 실패");
      }
    });

    it("throws ValidationError when response has wrong type", async () => {
      const invalidData = {
        attendance: [
          {
            id: "not-a-number",
            employeeId: 1,
            date: "2024-01-15",
            checkIn: "09:00:00",
            checkOut: "18:00:00",
            status: "present",
          },
        ],
        total: 1,
      };

      vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(invalidData)));

      try {
        await attendanceApi.getByEmployee(1);
        expect.fail("Should have thrown ValidationError");
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect((error as ValidationError).issues).toBeDefined();
        expect((error as ValidationError).issues.length).toBeGreaterThan(0);
      }
    });

    it("throws ValidationError when status enum is invalid", async () => {
      const invalidData = {
        attendance: [
          {
            id: 1,
            employeeId: 1,
            date: "2024-01-15",
            checkIn: "09:00:00",
            checkOut: "18:00:00",
            status: "invalid-status",
          },
        ],
        total: 1,
      };

      vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(invalidData)));

      await expect(attendanceApi.getByEmployee(1)).rejects.toThrow(ValidationError);
    });
  });

  describe("create", () => {
    it("returns validated Attendance when creation succeeds", async () => {
      const mockData = {
        id: 4,
        employeeId: 1,
        date: "2024-01-18",
        checkIn: "09:00:00",
        checkOut: "18:00:00",
        status: "present",
        note: "정상 출근",
      };

      vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(mockData)));

      const payload = {
        date: "2024-01-18",
        checkIn: "09:00:00",
        checkOut: "18:00:00",
        status: "present" as const,
        note: "정상 출근",
      };

      const result = await attendanceApi.create(1, payload);

      expect(result).toEqual(mockData);
      expect(result.id).toBe(4);
      expect(result.employeeId).toBe(1);
      expect(result.status).toBe("present");
    });

    it("handles optional note field correctly", async () => {
      const mockData = {
        id: 5,
        employeeId: 1,
        date: "2024-01-19",
        checkIn: "09:00:00",
        checkOut: "18:00:00",
        status: "present",
      };

      vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(mockData)));

      const payload = {
        date: "2024-01-19",
        checkIn: "09:00:00",
        checkOut: "18:00:00",
        status: "present" as const,
      };

      const result = await attendanceApi.create(1, payload);

      expect(result.note).toBeUndefined();
    });

    it("throws ValidationError when created attendance response is invalid", async () => {
      const invalidData = {
        id: 4,
        employeeId: 1,
      };

      vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(invalidData)));

      const payload = {
        date: "2024-01-18",
        checkIn: "09:00:00",
        checkOut: "18:00:00",
        status: "present" as const,
      };

      try {
        await attendanceApi.create(1, payload);
        expect.fail("Should have thrown ValidationError");
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect((error as ValidationError).message).toBe("근태 생성 응답 검증 실패");
      }
    });
  });

  describe("update", () => {
    it("returns validated Attendance when update succeeds", async () => {
      const mockData = {
        id: 1,
        employeeId: 1,
        date: "2024-01-15",
        checkIn: "09:00:00",
        checkOut: "19:00:00",
        status: "present",
        note: "연장 근무",
      };

      vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(mockData)));

      const result = await attendanceApi.update(1, {
        checkOut: "19:00:00",
        note: "연장 근무",
      });

      expect(result).toEqual(mockData);
      expect(result.checkOut).toBe("19:00:00");
      expect(result.note).toBe("연장 근무");
    });

    it("handles status change correctly", async () => {
      const mockData = {
        id: 2,
        employeeId: 1,
        date: "2024-01-16",
        checkIn: null,
        checkOut: null,
        status: "vacation",
        note: "연차",
      };

      vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(mockData)));

      const result = await attendanceApi.update(2, {
        checkIn: null,
        checkOut: null,
        status: "vacation",
        note: "연차",
      });

      expect(result.status).toBe("vacation");
      expect(result.checkIn).toBeNull();
      expect(result.checkOut).toBeNull();
    });

    it("throws ValidationError when updated attendance response is invalid", async () => {
      const invalidData = {
        id: 1,
        employeeId: 1,
      };

      vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse(invalidData)));

      try {
        await attendanceApi.update(1, {
          checkOut: "19:00:00",
        });
        expect.fail("Should have thrown ValidationError");
      } catch (error) {
        expect(error).toBeInstanceOf(ValidationError);
        expect((error as ValidationError).message).toBe("근태 수정 응답 검증 실패");
      }
    });
  });
});
