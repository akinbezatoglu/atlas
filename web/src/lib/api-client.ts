const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8787";
const TOKEN_KEY = "atlas_session";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + TOKEN_KEY + "=([^;]+)"));
  return match ? match[2] : null;
}

export function setToken(token: string): void {
  const d = new Date();
  d.setTime(d.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
  document.cookie = `${TOKEN_KEY}=${token};expires=${d.toUTCString()};path=/`;
}

export function clearToken(): void {
  document.cookie = `${TOKEN_KEY}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
}

type RequestOptions = {
  method?: string;
  body?: unknown;
  query?: Record<string, string | undefined | null>;
};

export async function api<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = "GET", body, query } = options;
  const token = getToken();

  let url = `${API_URL}${path}`;

  if (query) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (value != null && value !== "") {
        params.set(key, value);
      }
    }
    const qs = params.toString();
    if (qs) url += `?${qs}`;
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      (error as { error?: string }).error || `API Error: ${response.status}`,
    );
  }

  return response.json() as Promise<T>;
}
