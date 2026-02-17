"use client";

import { useEffect, useState, useCallback } from "react";
import { getStoredUser, initializeAuth, logout } from "@/lib/auth";
import type { AdminUser } from "@/lib/types";

export function useAuth() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
    const stored = getStoredUser();
    setUser(stored);
    setIsLoading(false);
  }, []);

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
