import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { createDb } from "./db";
import { Services } from "./services";
import { authGuard } from "./middleware/auth-guard";
import type { AppBindings } from "./types";

import auth from "./routes/auth";
import workspaceRoutes from "./routes/workspaces";
import memberRoutes from "./routes/members";
import projectRoutes from "./routes/projects";
import taskRoutes from "./routes/tasks";

const app = new Hono<AppBindings>();

app.use(logger());
app.use(cors());
app.use(async (c, next) => {
  const db = createDb(c.env.DB);
  c.set("services", new Services(db));
  await next();
});

app.get("/", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Auth routes (register, login are public — current requires token)
app.route("/api/auth", auth);

// Protected routes
app.use("/api/workspaces/*", authGuard);
app.use("/api/members/*", authGuard);
app.use("/api/projects/*", authGuard);
app.use("/api/tasks/*", authGuard);

app.route("/api/workspaces", workspaceRoutes);
app.route("/api/members", memberRoutes);
app.route("/api/projects", projectRoutes);
app.route("/api/tasks", taskRoutes);

export default app;
