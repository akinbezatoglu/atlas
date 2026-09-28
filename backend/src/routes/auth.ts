import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import type { AppBindings } from "../types";
import { loginSchema, registerSchema } from "../lib/schemas";
import {
  generateId,
  hashPassword,
  verifyPassword,
} from "../lib/crypto";
import { createToken, verifyToken, type JwtPayload } from "../lib/jwt";

const auth = new Hono<AppBindings>()
  .post("/register", zValidator("json", registerSchema), async (c) => {
    const { name, email, password } = c.req.valid("json");
    const { users, members } = c.var.services;

    const existing = await users.findByEmail(email);
    if (existing) {
      return c.json({ error: "Email already in use" }, 409);
    }

    const hashedPassword = await hashPassword(password);
    const user = await users.create({
      id: generateId(),
      name,
      email,
      password: hashedPassword,
    });

    const token = await createToken(user, c.env.API_KEY);

    return c.json({
      data: { id: user.id, name: user.name, email: user.email },
      token,
    });
  })
  .post("/login", zValidator("json", loginSchema), async (c) => {
    const { email, password } = c.req.valid("json");
    const { users } = c.var.services;

    const user = await users.findByEmail(email);
    if (!user) {
      return c.json({ error: "Invalid credentials" }, 401);
    }

    const valid = await verifyPassword(password, user.password);
    if (!valid) {
      return c.json({ error: "Invalid credentials" }, 401);
    }

    const token = await createToken(user, c.env.API_KEY);

    return c.json({
      data: { id: user.id, name: user.name, email: user.email },
      token,
    });
  })
  .get("/current", async (c) => {
    const header = c.req.header("Authorization");
    if (!header || !header.startsWith("Bearer ")) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    let payload: JwtPayload;
    try {
      payload = await verifyToken(header.slice(7), c.env.API_KEY);
    } catch {
      return c.json({ error: "Invalid or expired token" }, 401);
    }

    const { users } = c.var.services;
    const user = await users.findById(payload.sub);

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json({
      data: { id: user.id, name: user.name, email: user.email },
    });
  });

export default auth;
