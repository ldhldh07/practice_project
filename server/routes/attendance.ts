import { Hono } from "hono";

import { attendanceRecords, getNextId } from "../data/attendance";
import type { Attendance } from "../data/attendance";

const app = new Hono();

app.get("/employees/:employeeId/attendance", (c) => {
  const employeeId = Number(c.req.param("employeeId"));
  const records = attendanceRecords.filter((r) => r.employeeId === employeeId);

  records.sort((a, b) => (a.date > b.date ? -1 : 1));

  return c.json({ attendance: records, total: records.length });
});

app.post("/employees/:employeeId/attendance", async (c) => {
  const employeeId = Number(c.req.param("employeeId"));
  const body = await c.req.json<Omit<Attendance, "id" | "employeeId">>();
  const newRecord: Attendance = { ...body, id: getNextId(), employeeId };
  attendanceRecords.push(newRecord);
  return c.json(newRecord, 201);
});

app.put("/attendance/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const idx = attendanceRecords.findIndex((r) => r.id === id);
  if (idx === -1) return c.json({ message: "근태 기록을 찾을 수 없습니다." }, 404);

  const body = await c.req.json<Partial<Attendance>>();
  attendanceRecords[idx] = { ...attendanceRecords[idx], ...body, id };
  return c.json(attendanceRecords[idx]);
});

export default app;
