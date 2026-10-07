import { useCallback, useEffect, useState } from "react";

import { useServerHubAuth } from "@/context/serverhub-auth";
import type { DashboardSnapshot } from "@/lib/serverhub-api";
import { fetchDashboard } from "@/lib/serverhub-api";

export function useDashboardData() {
  const { session, signOut } = useServerHubAuth();
  const [data, setData] = useState<DashboardSnapshot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => setRefreshKey((key) => key + 1), []);

  useEffect(() => {
    if (!session) return;

    let active = true;
    const load = async () => {
      try {
        const snapshot = await fetchDashboard(session.token);
        if (!active) return;
        setData(snapshot);
        setError(null);
      } catch (cause) {
        if (!active) return;
        const message =
          cause instanceof Error ? cause.message : "Gagal memuat dashboard.";
        setError(message);
        if (
          message.includes("401") ||
          message.includes("403") ||
          message.includes("Sign in again")
        ) {
          await signOut();
        }
      } finally {
        if (active) setIsLoading(false);
      }
    };

    void load();
    const interval = setInterval(() => void load(), 60_000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [session, signOut, refreshKey]);

  return { data, isLoading, error, refresh };
}
