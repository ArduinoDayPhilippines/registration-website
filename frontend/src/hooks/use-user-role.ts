"use client";

import { useEffect, useState } from "react";

export type UserRole = "admin" | "user" | null;

export interface UserRoleState {
  role: UserRole;
  userId: string | null;
  loading: boolean;
}

/**
 * Fetches the current user and their role from auth.users (role and raw_app_meta_data->>'role').
 * Returns { role: 'admin' | 'user' | null, userId, loading }.
 */
export function useUserRole(): UserRoleState {
  const [state, setState] = useState<UserRoleState>({
    role: null,
    userId: null,
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;

    async function fetchUserRole() {
      const res = await fetch("/api/auth/role", { credentials: "include" });
      if (cancelled) return;

      if (!res.ok) {
        setState({ role: null, userId: null, loading: false });
        return;
      }

      const data = await res.json();
      if (cancelled) return;

      setState({
        role: data.role === "admin" ? "admin" : data.role === "user" ? "user" : null,
        userId: data.userId ?? null,
        loading: false,
      });
    }

    fetchUserRole();
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
