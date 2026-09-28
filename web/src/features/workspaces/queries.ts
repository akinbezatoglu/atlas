import { cookies } from "next/headers";
import type { Workspace, PaginatedResponse } from "@/lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";

export const getWorkspaces = async (): Promise<PaginatedResponse<Workspace>> => {
  const token = cookies().get("atlas_session")?.value;
  if (!token) return { documents: [], total: 0 };

  try {
    const res = await fetch(`${API_URL}/api/workspaces`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    if (!res.ok) return { documents: [], total: 0 };
    
    const { data } = await res.json();
    return data;
  } catch {
    return { documents: [], total: 0 };
  }
};
