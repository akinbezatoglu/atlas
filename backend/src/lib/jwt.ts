import { sign, verify } from "hono/jwt";
import type { JWTPayload } from "hono/utils/jwt/types";

const TOKEN_EXPIRY = 60 * 60 * 24 * 30; // 30 days

export interface JwtPayload extends JWTPayload {
  sub: string; // user id
  email: string;
  name: string;
  exp: number;
}

export async function createToken(
  user: { id: string; email: string; name: string },
  secret: string,
): Promise<string> {
  const payload: JwtPayload = {
    sub: user.id,
    email: user.email,
    name: user.name,
    exp: Math.floor(Date.now() / 1000) + TOKEN_EXPIRY,
  };

  return sign(payload, secret);
}

export async function verifyToken(
  token: string,
  secret: string,
): Promise<JwtPayload> {
  const result = await verify(token, secret, "HS256");
  return result as JwtPayload;
}
