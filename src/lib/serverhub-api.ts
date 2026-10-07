export type ActivityRange = "24h" | "7d" | "30d";

export type DashboardMember = {
  id: string;
  displayName: string;
  username: string;
  avatar: string | null;
  xp: number;
  messages: number;
  voiceMinutes: number;
};

export type DashboardActivity = {
  id: string;
  category: string;
  summary: string;
  createdAt: string;
};

export type DashboardSnapshot = {
  server: { id: string; name: string };
  metrics: {
    memberCount: number;
    onlineCount: number | null;
    messageCount: number;
    voiceCount: number;
  };
  messageActivity: Record<ActivityRange, { label: string; value: number }[]>;
  voiceChannels: { name: string; count: number }[];
  leaderboard: DashboardMember[];
  recentActivity: DashboardActivity[];
};

const apiBaseUrl = (process.env.EXPO_PUBLIC_API_URL || "").replace(/\/$/, "");

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  if (!apiBaseUrl) {
    throw new Error("EXPO_PUBLIC_API_URL belum diatur di file .env ServerHub.");
  }

  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
  } catch {
    throw new Error(
      "ServerHub API tidak dapat dijangkau. Periksa URL backend dan jaringan.",
    );
  }

  const payload = (await response.json().catch(() => null)) as
    | { error?: string }
    | T
    | null;
  if (!response.ok) {
    const message =
      payload && typeof payload === "object" && "error" in payload
        ? payload.error
        : undefined;
    throw new Error(message || `Permintaan API gagal (${response.status}).`);
  }
  return payload as T;
}

export function getApiBaseUrl() {
  return apiBaseUrl;
}

export function startDiscordLogin(redirectUri: string) {
  return request<{ authorizationUrl: string }>("/api/auth/discord/start", {
    method: "POST",
    body: JSON.stringify({ redirectUri }),
  });
}

export function redeemDiscordTicket(ticket: string) {
  return request<{
    token: string;
    expiresAt: string;
    user: { id: string; username: string };
    guild: { id: string; name: string };
  }>("/api/auth/discord/redeem", {
    method: "POST",
    body: JSON.stringify({ ticket }),
  });
}

export function fetchDashboard(token: string) {
  return request<DashboardSnapshot>("/api/dashboard", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function revokeSession(token: string) {
  return request<void>("/api/auth/logout", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}
