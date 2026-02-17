import { afterEach, describe, expect, it, vi } from "vitest";

import { createHttpClient } from "../client";

function jsonResponse(data: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
}

describe("createHttpClient", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("serializes query params and calls fetch with GET", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ ok: true }));
    vi.stubGlobal("fetch", fetchMock);

    const client = createHttpClient("https://api.example.com");
    await client.get("/employees", {
      params: {
        limit: 10,
        skip: 0,
        departmentIds: ["1", "2", "3"],
      },
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [requestUrl, requestInit] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(requestUrl).toBe("https://api.example.com/employees?limit=10&skip=0&departmentIds=1%2C2%2C3");
    expect(requestInit).toMatchObject({ method: "GET", cache: "no-store" });
  });

  it("returns parsed JSON when response is ok", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse({ employees: [] })));
    const client = createHttpClient("https://api.example.com");

    const result = await client.get<{ employees: unknown[] }>("/employees");

    expect(result).toEqual({ employees: [] });
  });

  it("throws a descriptive error when response status is not ok", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("bad request", { status: 400, statusText: "Bad Request" })),
    );
    const client = createHttpClient("https://api.example.com");

    await expect(client.get("/employees")).rejects.toThrow("HTTP 400 Bad Request - bad request");
  });
});
