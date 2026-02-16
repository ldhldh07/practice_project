import { Hono } from "hono";

import attendanceRoutes from "./routes/attendance";
import departmentRoutes from "./routes/departments";
import employeeRoutes from "./routes/employees";

const app = new Hono().basePath("/api");

app.route("/employees", employeeRoutes);
app.route("/departments", departmentRoutes);
app.route("/", attendanceRoutes);

export default app;
