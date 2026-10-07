import type { ActivityEvent, Member } from "@/constants/serverhub-data";
import type { DashboardActivity, DashboardMember } from "@/lib/serverhub-api";

export function toMember(member: DashboardMember): Member {
  const name = member.displayName || member.username;
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
  return {
    name,
    handle: `@${member.username}`,
    points: member.xp,
    messages: member.messages,
    initials: initials || "?",
  };
}

function relativeTime(value: string, now: number): string {
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) return "";
  const seconds = Math.max(0, Math.floor((now - timestamp) / 1000));
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hr ago`;
  return `${Math.floor(seconds / 86400)} d ago`;
}

export function toActivityEvent(
  event: DashboardActivity,
  now = Date.now(),
): ActivityEvent {
  const category = ["message", "member", "voice", "moderation"].includes(
    event.category,
  )
    ? (event.category as ActivityEvent["category"])
    : "message";
  return {
    id: event.id,
    category,
    summary: event.summary,
    time: relativeTime(event.createdAt, now),
  };
}
