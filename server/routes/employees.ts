import { Hono } from "hono";

import { employees, getNextId } from "../data/employees";

import type { Employee, EmployeeStatus } from "../data/employees";

const app = new Hono();

app.get("/", (c) => {
  const limit = Number(c.req.query("limit") || "10");
  const skip = Number(c.req.query("skip") || "0");
  const search = c.req.query("search") || "";
  const departmentId = c.req.query("departmentId");
  const departmentIds = c.req.query("departmentIds");
  const status = c.req.query("status") as EmployeeStatus | undefined;
  const sortBy = c.req.query("sortBy") || "id";
  const order = c.req.query("order") || "asc";

  let filtered = [...employees];

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.position.toLowerCase().includes(q),
    );
  }

  if (departmentIds) {
    const ids = departmentIds
      .split(",")
      .map((v) => Number(v.trim()))
      .filter((v) => Number.isFinite(v));
    filtered = filtered.filter((e) => ids.includes(e.departmentId));
  } else if (departmentId) {
    filtered = filtered.filter((e) => e.departmentId === Number(departmentId));
  }

  if (status) {
    filtered = filtered.filter((e) => e.status === status);
  }

  filtered.sort((a, b) => {
    const aVal = a[sortBy as keyof Employee] ?? "";
    const bVal = b[sortBy as keyof Employee] ?? "";
    if (aVal < bVal) return order === "asc" ? -1 : 1;
    if (aVal > bVal) return order === "asc" ? 1 : -1;
    return 0;
  });

  const total = filtered.length;
  const paged = filtered.slice(skip, skip + limit);

  return c.json({ employees: paged, total, skip, limit });
});

app.get("/:id", (c) => {
  const id = Number(c.req.param("id"));
  const employee = employees.find((e) => e.id === id);
  if (!employee) return c.json({ message: "직원을 찾을 수 없습니다." }, 404);
  return c.json(employee);
});

app.post("/", async (c) => {
  const body = await c.req.json<Omit<Employee, "id">>();
  const newEmployee: Employee = { ...body, id: getNextId() };
  employees.unshift(newEmployee);
  return c.json(newEmployee, 201);
});

app.put("/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const idx = employees.findIndex((e) => e.id === id);
  if (idx === -1) return c.json({ message: "직원을 찾을 수 없습니다." }, 404);

  const body = await c.req.json<Partial<Employee>>();
  employees[idx] = { ...employees[idx], ...body, id };
  return c.json(employees[idx]);
});

app.delete("/:id", (c) => {
  const id = Number(c.req.param("id"));
  const idx = employees.findIndex((e) => e.id === id);
  if (idx === -1) return c.json({ message: "직원을 찾을 수 없습니다." }, 404);

  const [deleted] = employees.splice(idx, 1);
  return c.json(deleted);
});

export default app;
