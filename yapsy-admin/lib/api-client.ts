import type { ApiResponse, ApiSuccessResponse } from "@/lib/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
const API_PREFIX = "/api/v1/admin";

let accessToken: string | null = null;
let refreshToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken(): string | null {
  return accessToken;
}

export function setRefreshToken(token: string | null) {
  refreshToken = token;
}

export function getRefreshToken(): string | null {
  return refreshToken;
}

async function refreshAccessToken(): Promise<string | null> {
  const currentRefresh = refreshToken || getCookieValue("yapsy_admin_refresh");
  if (!currentRefresh) return null;

  try {
    const res = await fetch(`${BASE_URL}${API_PREFIX}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: currentRefresh }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.success && data.data?.access_token) {
      setAccessToken(data.data.access_token);
      setRefreshToken(data.data.refresh_token);
      // Update cookies
      if (typeof document !== "undefined") {
        document.cookie = `yapsy_admin_token=${data.data.access_token}; path=/; max-age=86400; SameSite=Lax`;
        document.cookie = `yapsy_admin_refresh=${data.data.refresh_token}; path=/; max-age=604800; SameSite=Lax`;
      }
      return data.data.access_token;
    }
    // Handle non-envelope response (raw NestJS)
    if (data.access_token) {
      setAccessToken(data.access_token);
      setRefreshToken(data.refresh_token);
      if (typeof document !== "undefined") {
        document.cookie = `yapsy_admin_token=${data.access_token}; path=/; max-age=86400; SameSite=Lax`;
        document.cookie = `yapsy_admin_refresh=${data.refresh_token}; path=/; max-age=604800; SameSite=Lax`;
      }
      return data.access_token;
    }
    return null;
  } catch {
    return null;
  }
}

function getCookieValue(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? match[1] : null;
}

interface FetchOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
}

async function request<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<ApiSuccessResponse<T>> {
  const { body, headers: customHeaders, ...rest } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(customHeaders as Record<string, string>),
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  let res = await fetch(`${BASE_URL}${API_PREFIX}${endpoint}`, {
    ...rest,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  // Auto-refresh on 401
  if (res.status === 401) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      headers["Authorization"] = `Bearer ${newToken}`;
      res = await fetch(`${BASE_URL}${API_PREFIX}${endpoint}`, {
        ...rest,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });
    } else {
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      throw new Error("Session expired. Please log in again.");
    }
  }

  const json = await res.json();

  // Handle envelope response
  if (json.success === false) {
    throw new Error(
      (json as ApiResponse<T> & { success: false }).error?.message ||
        "API request failed"
    );
  }

  // Backend may return envelope { success, data, meta } or raw response
  if (json.success === true) {
    return json as ApiSuccessResponse<T>;
  }

  // Raw response — wrap it
  return { success: true, data: json as T } as ApiSuccessResponse<T>;
}

// Convenience methods
export const api = {
  get<T>(
    endpoint: string,
    params?: Record<string, string | number | undefined>
  ) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          searchParams.append(key, String(value));
        }
      });
    }
    const query = searchParams.toString();
    const url = query ? `${endpoint}?${query}` : endpoint;
    return request<T>(url, { method: "GET" });
  },

  post<T>(endpoint: string, body?: unknown) {
    return request<T>(endpoint, { method: "POST", body });
  },

  patch<T>(endpoint: string, body?: unknown) {
    return request<T>(endpoint, { method: "PATCH", body });
  },

  delete<T>(endpoint: string) {
    return request<T>(endpoint, { method: "DELETE" });
  },
};
