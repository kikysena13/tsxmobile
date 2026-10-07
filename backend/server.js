require("dotenv").config();

const crypto = require("node:crypto");
const express = require("express");
const cors = require("cors");
const { rateLimit } = require("express-rate-limit");

const app = express();
const loginStates = new Map();
const loginTickets = new Map();
const sessions = new Map();
const SESSION_TTL_MS = 12 * 60 * 60 * 1000;
const LOGIN_TTL_MS = 5 * 60 * 1000;
const TICKET_TTL_MS = 90 * 1000;
const GUILD_ADMINISTRATOR = 0x8n;
const GUILD_MANAGE = 0x20n;

function configuredOrigins() {
  return new Set(
    (process.env.APP_ALLOWED_ORIGINS || "")
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean),
  );
}

app.disable("x-powered-by");
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || configuredOrigins().has(origin)) return callback(null, true);
      return callback(new Error("Origin not allowed"));
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type"],
    maxAge: 600,
  }),
);
app.use(express.json({ limit: "16kb" }));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 60,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

function requiredConfig(names) {
  return names.filter((name) => !process.env[name]);
}

function isValidAppRedirect(value) {
  if (typeof value !== "string" || value.length > 500) return false;
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    return false;
  }

  if (parsed.protocol === "serverhub:" && parsed.hostname === "auth") return true;
  if (
    (process.env.NODE_ENV !== "production" || process.env.ALLOW_EXPO_GO_REDIRECTS === "true") &&
    parsed.protocol === "exp:" &&
    parsed.pathname.endsWith("/--/auth")
  ) {
    return true;
  }
  return (
    (parsed.protocol === "https:" ||
      (process.env.NODE_ENV !== "production" && parsed.protocol === "http:")) &&
    configuredOrigins().has(parsed.origin) &&
    parsed.pathname === "/auth"
  );
}

function addQuery(uri, values) {
  const url = new URL(uri);
  for (const [key, value] of Object.entries(values)) url.searchParams.set(key, value);
  return url.toString();
}

function isGuildAdmin(guild) {
  if (guild?.owner) return true;
  try {
    const permissions = BigInt(guild?.permissions || "0");
    return (
      (permissions & GUILD_ADMINISTRATOR) === GUILD_ADMINISTRATOR ||
      (permissions & GUILD_MANAGE) === GUILD_MANAGE
    );
  } catch {
    return false;
  }
}

async function discordFetch(pathname, accessToken) {
  const response = await fetch(`https://discord.com/api/v10${pathname}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error(`Discord request failed (${response.status})`);
  return response.json();
}

async function exchangeDiscordCode(code) {
  const missing = requiredConfig([
    "DISCORD_CLIENT_ID",
    "DISCORD_CLIENT_SECRET",
    "DISCORD_REDIRECT_URI",
  ]);
  if (missing.length) throw new Error("Discord OAuth is not configured on the backend.");

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: process.env.DISCORD_REDIRECT_URI,
  });
  const basic = Buffer.from(
    `${process.env.DISCORD_CLIENT_ID}:${process.env.DISCORD_CLIENT_SECRET}`,
  ).toString("base64");
  const response = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
    signal: AbortSignal.timeout(10000),
  });
  const token = await response.json();
  if (!response.ok || !token.access_token) {
    throw new Error("Discord authorization code could not be exchanged.");
  }
  return token;
}

async function verifyGuildAdmin(accessToken) {
  const guildId = process.env.DISCORD_GUILD_ID;
  if (!guildId) throw new Error("DISCORD_GUILD_ID is not configured on the backend.");
  const guilds = await discordFetch("/users/@me/guilds", accessToken);
  const guild = guilds.find((entry) => entry.id === guildId);
  if (!guild || !isGuildAdmin(guild)) return null;
  return { id: guild.id, name: guild.name };
}

function pruneExpired(map) {
  const now = Date.now();
  for (const [key, value] of map) {
    if (value.expiresAt <= now) map.delete(key);
  }
}

function readBearerToken(request) {
  const header = request.headers.authorization || "";
  return header.startsWith("Bearer ") ? header.slice(7) : "";
}

async function requireAdminSession(request, response, next) {
  const token = readBearerToken(request);
  const session = sessions.get(token);
  if (!session || session.expiresAt <= Date.now()) {
    sessions.delete(token);
    return response.status(401).json({ error: "Sign in again to continue." });
  }

  try {
    if (session.guildCheckExpiresAt <= Date.now()) {
      const guild = await verifyGuildAdmin(session.discordAccessToken);
      if (!guild) {
        sessions.delete(token);
        return response.status(403).json({ error: "Server administrator access is required." });
      }
      session.guild = guild;
      session.guildCheckExpiresAt = Date.now() + 60 * 1000;
    }
    request.dashboardSession = session;
    return next();
  } catch {
    return response.status(503).json({ error: "Could not verify Discord administrator access." });
  }
}

async function getBotDashboard() {
  const missing = requiredConfig(["BOT_API_URL", "BOT_API_TOKEN"]);
  if (missing.length) throw new Error("The bot API connection is not configured on the backend.");

  const response = await fetch(process.env.BOT_API_URL, {
    headers: { Authorization: `Bearer ${process.env.BOT_API_TOKEN}` },
    cache: "no-store",
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error(`Bot API request failed (${response.status}).`);
  const source = await response.json();
  const members = Array.isArray(source.leaderboard) ? source.leaderboard : [];

  return {
    server: {
      id: source.server?.id || requestGuildId(),
      name: source.server?.name || "Discord server",
    },
    metrics: {
      memberCount: Number(source.metrics?.memberCount ?? source.totalMembers ?? 0),
      onlineCount:
        source.metrics?.onlineCount === null || source.metrics?.onlineCount === undefined
          ? null
          : Number(source.metrics.onlineCount),
      messageCount: Number(source.metrics?.messageCount ?? 0),
      voiceCount: Number(source.metrics?.voiceCount ?? 0),
    },
    messageActivity: source.messageActivity || { "24h": [], "7d": [], "30d": [] },
    voiceChannels: Array.isArray(source.voiceChannels) ? source.voiceChannels : [],
    leaderboard: members.map((member) => ({
      id: String(member.id || member.userId || ""),
      displayName: String(member.displayName || member.username || "Member"),
      username: String(member.username || "member"),
      avatar: typeof member.avatar === "string" ? member.avatar : null,
      xp: Number(member.xp || 0),
      messages: Number(member.messages ?? member.chatMessages ?? member.chatXp ?? 0),
      voiceMinutes: Number(member.voiceMinutes ?? member.voiceXp ?? 0),
    })),
    recentActivity: Array.isArray(source.recentActivity)
      ? source.recentActivity.map((event) => ({
          id: String(event.id),
          category: String(event.category || "message"),
          summary: String(event.summary || "Server activity"),
          createdAt: String(event.createdAt || event.timestamp || new Date().toISOString()),
        }))
      : [],
  };
}

function requestGuildId() {
  return process.env.DISCORD_GUILD_ID || "";
}

app.get("/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.post("/api/auth/discord/start", authLimiter, (request, response) => {
  const missing = requiredConfig([
    "DISCORD_CLIENT_ID",
    "DISCORD_REDIRECT_URI",
    "DISCORD_GUILD_ID",
  ]);
  if (missing.length) {
    return response.status(503).json({ error: "Discord sign-in is not configured yet." });
  }

  const { redirectUri } = request.body || {};
  if (!isValidAppRedirect(redirectUri)) {
    return response.status(400).json({ error: "Invalid app redirect URL." });
  }

  pruneExpired(loginStates);
  const state = crypto.randomBytes(32).toString("base64url");
  loginStates.set(state, { redirectUri, expiresAt: Date.now() + LOGIN_TTL_MS });

  const authorizeUrl = new URL("https://discord.com/oauth2/authorize");
  authorizeUrl.searchParams.set("client_id", process.env.DISCORD_CLIENT_ID);
  authorizeUrl.searchParams.set("redirect_uri", process.env.DISCORD_REDIRECT_URI);
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("scope", "identify guilds");
  authorizeUrl.searchParams.set("state", state);
  return response.json({ authorizationUrl: authorizeUrl.toString() });
});

app.get("/api/auth/discord/callback", authLimiter, async (request, response) => {
  const { code, state, error } = request.query;
  const transaction = loginStates.get(String(state || ""));
  loginStates.delete(String(state || ""));
  if (!transaction || transaction.expiresAt <= Date.now()) {
    return response.status(400).send("Login request expired. Return to ServerHub and try again.");
  }

  if (error || typeof code !== "string") {
    return response.redirect(addQuery(transaction.redirectUri, { error: "discord_login_cancelled" }));
  }

  try {
    const token = await exchangeDiscordCode(code);
    const user = await discordFetch("/users/@me", token.access_token);
    const guild = await verifyGuildAdmin(token.access_token);
    if (!guild) {
      return response.redirect(addQuery(transaction.redirectUri, { error: "admin_access_required" }));
    }

    pruneExpired(loginTickets);
    const ticket = crypto.randomBytes(32).toString("base64url");
    loginTickets.set(ticket, {
      discordAccessToken: token.access_token,
      user: { id: String(user.id), username: String(user.global_name || user.username || "Discord admin") },
      guild,
      expiresAt: Date.now() + TICKET_TTL_MS,
    });
    return response.redirect(addQuery(transaction.redirectUri, { ticket }));
  } catch (error) {
    console.error("Discord OAuth callback failed:", error.message);
    return response.redirect(addQuery(transaction.redirectUri, { error: "discord_login_failed" }));
  }
});

app.post("/api/auth/discord/redeem", authLimiter, (request, response) => {
  pruneExpired(loginTickets);
  const ticket = request.body?.ticket;
  if (typeof ticket !== "string" || ticket.length > 100) {
    return response.status(400).json({ error: "Invalid sign-in ticket." });
  }
  const login = loginTickets.get(ticket);
  loginTickets.delete(ticket);
  if (!login || login.expiresAt <= Date.now()) {
    return response.status(401).json({ error: "Sign-in ticket expired. Please try again." });
  }

  pruneExpired(sessions);
  const sessionToken = crypto.randomBytes(32).toString("base64url");
  sessions.set(sessionToken, {
    ...login,
    expiresAt: Date.now() + SESSION_TTL_MS,
    guildCheckExpiresAt: Date.now() + 60 * 1000,
  });
  return response.json({
    token: sessionToken,
    expiresAt: new Date(Date.now() + SESSION_TTL_MS).toISOString(),
    user: login.user,
    guild: login.guild,
  });
});

app.post("/api/auth/logout", apiLimiter, (request, response) => {
  sessions.delete(readBearerToken(request));
  return response.status(204).end();
});

app.get("/api/dashboard", apiLimiter, requireAdminSession, async (request, response) => {
  try {
    const dashboard = await getBotDashboard();
    dashboard.server.name = dashboard.server.name || request.dashboardSession.guild.name;
    response.setHeader("Cache-Control", "no-store");
    return response.json(dashboard);
  } catch (error) {
    console.error("Dashboard proxy request failed:", error.message);
    return response.status(502).json({ error: "Could not load data from the Discord bot." });
  }
});

app.use((error, _request, response, _next) => {
  if (error.message === "Origin not allowed") {
    return response.status(403).json({ error: "Origin not allowed." });
  }
  console.error("Backend request failed:", error.message);
  return response.status(500).json({ error: "Unexpected backend error." });
});

function startServer() {
  const port = Number(process.env.PORT || 4000);
  return app.listen(port, "0.0.0.0", () => {
    console.log(`ServerHub API listening on port ${port}`);
  });
}

if (require.main === module) startServer();

module.exports = { app, startServer, isGuildAdmin, isValidAppRedirect };
