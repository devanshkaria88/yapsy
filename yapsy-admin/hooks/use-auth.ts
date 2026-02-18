"use client";

import { useState, useCallback, useSyncExternalStore } from "react";
import { getStoredUser, initializeAuth, logout } from "@/lib/auth";
import type { AdminUser } from "@/lib/types";

let authInitialized = false;

function getSnapshot(): AdminUser | null {
  if (typeof window === "undefined") return null;
  if (!authInitialized) {
    authInitialized = true;
    initializeAuth();
  }
  return getStoredUser();
}

function getServerSnapshot(): AdminUser | null {
  return null;
}

const subscribe = () => () => {};

export function useAuth() {
  const user = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [isLoading] = useState(false);

  const handleLogout = useCallback(async () => {
    await logout();
  }, []);

  return {
    user,
    isLoading,
    isSuperAdmin: user?.role === "super_admin",
    logout: handleLogout,
  };
}
