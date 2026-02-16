import { Hono } from "hono";

import { departments } from "../data/departments";

const app = new Hono();

app.get("/", (c) => {
  return c.json(departments);
});

export default app;
