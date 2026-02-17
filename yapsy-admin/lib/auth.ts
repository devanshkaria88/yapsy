import {
  api,
  setAccessToken,
  setRefreshToken,
} from "@/lib/api-client";
import type { AdminUser, AuthTokens } from "@/lib/types";

const AUTH_STORAGE_KEY = "yapsy_admin_user";

/**
 * Exchange a Firebase ID token for admin JWTs, then persist everything.
 */
async function exchangeTokenAndPersist(idToken: string): Promise<{
  tokens: AuthTokens;
  admin: AdminUser;
}> {
  const res = await api.post<{
    access_token: string;
    refresh_token: string;
    admin: AdminUser;
  }>("/auth/firebase", { id_token: idToken });

  const { access_token, refresh_token, admin } = res.data;

  setAccessToken(access_token);
  setRefreshToken(refresh_token);

  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(admin));
  }

  document.cookie = `yapsy_admin_token=${access_token}; path=/; max-age=86400; SameSite=Lax`;
  document.cookie = `yapsy_admin_refresh=${refresh_token}; path=/; max-age=604800; SameSite=Lax`;

  return { tokens: { access_token, refresh_token }, admin };
}

/**
 * Sign in with Google popup → Firebase ID token → admin JWT
 */
export async function loginWithGoogle(): Promise<{
  tokens: AuthTokens;
  admin: AdminUser;
}> {
  const { signInWithGoogle } = await import("@/lib/firebase");
  const idToken = await signInWithGoogle();
  return exchangeTokenAndPersist(idToken);
}

/**
 * Sign in with email/password → Firebase ID token → admin JWT
 */
export async function loginWithEmail(
  email: string,
  password: string
): Promise<{
  tokens: AuthTokens;
  admin: AdminUser;
}> {
  const { signInWithEmail } = await import("@/lib/firebase");
  const idToken = await signInWithEmail(email, password);
  return exchangeTokenAndPersist(idToken);
}

export async function logout(): Promise<void> {
  try {
    await api.post("/auth/logout");
  } catch {
    // Ignore logout errors
  }
  try {
    const { firebaseSignOutClient } = await import("@/lib/firebase");
    await firebaseSignOutClient();
  } catch {
    // Ignore Firebase sign-out errors
  }
  setAccessToken(null);
  setRefreshToken(null);
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    document.cookie = "yapsy_admin_token=; path=/; max-age=0";
    document.cookie = "yapsy_admin_refresh=; path=/; max-age=0";
    window.location.href = "/login";
  }
}

export function getStoredUser(): AdminUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function isSuperAdmin(user: AdminUser | null): boolean {
  return user?.role === "super_admin";
}

export function initializeAuth(): void {
  if (typeof window === "undefined") return;
  const cookies = document.cookie.split("; ");
  const tokenCookie = cookies.find((c) =>
    c.startsWith("yapsy_admin_token=")
  );
  if (tokenCookie) {
    const token = tokenCookie.split("=")[1];
    if (token) setAccessToken(token);
  }
  const refreshCookie = cookies.find((c) =>
    c.startsWith("yapsy_admin_refresh=")
  );
  if (refreshCookie) {
    const token = refreshCookie.split("=")[1];
    if (token) setRefreshToken(token);
  }
}
