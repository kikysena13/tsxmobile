export const palette = {
  background: "#0D0F12",
  surface: "#15181D",
  surfaceRaised: "#1C2026",
  border: "#292D34",
  text: "#E8EAED",
  muted: "#9A9FA8",
  faint: "#737983",
  accent: "#A69BCB",
  accentSoft: "#292632",
} as const;

export type Member = {
  name: string;
  handle: string;
  points: number;
  messages: number;
  initials: string;
};

const numberFormatter = new Intl.NumberFormat("en-US");

export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

export const topMembers: Member[] = [
  {
    name: "Mika Tanaka",
    handle: "@mika",
    points: 12840,
    messages: 2481,
    initials: "MT",
  },
  {
    name: "Jordan Lee",
    handle: "@jlee",
    points: 10290,
    messages: 1936,
    initials: "JL",
  },
  {
    name: "Sofia Reyes",
    handle: "@sofia",
    points: 9640,
    messages: 1704,
    initials: "SR",
  },
  {
    name: "Kai Nakamura",
    handle: "@kain",
    points: 8920,
    messages: 1562,
    initials: "KN",
  },
  {
    name: "Avery Morgan",
    handle: "@avery",
    points: 8105,
    messages: 1408,
    initials: "AM",
  },
  {
    name: "Noah Williams",
    handle: "@noahw",
    points: 7680,
    messages: 1302,
    initials: "NW",
  },
];

export type ActivityEvent = {
  id: string;
  category: "message" | "member" | "voice" | "moderation";
  summary: string;
  time: string;
};

export const recentActivity: ActivityEvent[] = [
  {
    id: "evt-1",
    category: "message",
    summary: "124 messages in #general",
    time: "2 min ago",
  },
  {
    id: "evt-2",
    category: "member",
    summary: "Pixel Poppy joined the server",
    time: "18 min ago",
  },
  {
    id: "evt-3",
    category: "voice",
    summary: "8 members joined Cozy Lounge",
    time: "32 min ago",
  },
  {
    id: "evt-4",
    category: "moderation",
    summary: "AutoMod blocked a message in #links",
    time: "1 hr ago",
  },
  {
    id: "evt-5",
    category: "message",
    summary: "42 messages in #game-night",
    time: "2 hr ago",
  },
];

export type ChartRange = "24h" | "7d" | "30d";

export const activitySeries: Record<
  ChartRange,
  { label: string; value: number }[]
> = {
  "24h": [
    { label: "12a", value: 22 },
    { label: "4a", value: 15 },
    { label: "8a", value: 34 },
    { label: "12p", value: 62 },
    { label: "4p", value: 48 },
    { label: "8p", value: 90 },
    { label: "Now", value: 73 },
  ],
  "7d": [
    { label: "Mon", value: 42 },
    { label: "Tue", value: 61 },
    { label: "Wed", value: 49 },
    { label: "Thu", value: 77 },
    { label: "Fri", value: 58 },
    { label: "Sat", value: 94 },
    { label: "Sun", value: 71 },
  ],
  "30d": [
    { label: "1–6", value: 48 },
    { label: "7–12", value: 69 },
    { label: "13–18", value: 56 },
    { label: "19–24", value: 91 },
    { label: "25–30", value: 72 },
  ],
};
