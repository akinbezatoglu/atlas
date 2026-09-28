import { cookies } from "next/headers";
import type { User } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

export const getCurrent = async (): Promise<User | null> => {
  const token = cookies().get("atlas_session")?.value;
  if (!token) return null;

  try {
    const res = await fetch(`${API_URL}/api/auth/current`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    if (!res.ok) return null;
    
    const { data } = await res.json();
    return data;
  } catch {
    return null;
  }
};