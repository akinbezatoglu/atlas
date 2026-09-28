import { createMiddleware } from "hono/factory";
import type { AppBindings } from "../types";
import { verifyToken, type JwtPayload } from "../lib/jwt";

export const authGuard = createMiddleware<AppBindings>(async (c, next) => {
  const header = c.req.header("Authorization");

  if (!header || !header.startsWith("Bearer ")) {
    return c.json({ error: "Authorization header required" }, 401);
  }

  const token = header.slice(7);

  try {
    const payload = await verifyToken(token, c.env.API_KEY);
    c.set("userId", payload.sub);
    c.set("userEmail", payload.email);
    c.set("userName", payload.name);
    await next();
  } catch {
    return c.json({ error: "Invalid or expired token" }, 401);
  }
});
