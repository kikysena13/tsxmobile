export const palette = {
  background: "#090B10",
  surface: "#11141C",
  surfaceRaised: "#171B25",
  border: "#252A36",
  text: "#F4F5F8",
  muted: "#858B9A",
  faint: "#555C6D",
  accent: "#8B7CFF",
  accentSoft: "#27233F",
  green: "#45D6A0",
  greenSoft: "#16352F",
  blue: "#69A9FF",
  blueSoft: "#1B2C42",
  orange: "#FFB86B",
  orangeSoft: "#3A2B1E",
  red: "#FF7185",
} as const;

export type Member = {
  name: string;
  handle: string;
  points: string;
  messages: string;
  initials: string;
  color: string;
  role: string;
};

export const topMembers: Member[] = [
  {
    name: "Mika Tanaka",
    handle: "@mika",
    points: "12,840 XP",
    messages: "2,481",
    initials: "MT",
    color: "#D995FF",
    role: "✨ MVP",
  },
  {
    name: "Jordan Lee",
    handle: "@jlee",
    points: "10,290 XP",
    messages: "1,936",
    initials: "JL",
    color: "#76B7FF",
    role: "🌙 Night owl",
  },
  {
    name: "Sofia Reyes",
    handle: "@sofia",
    points: "9,640 XP",
    messages: "1,704",
    initials: "SR",
    color: "#FF9A9E",
    role: "🎨 Creator",
  },
  {
    name: "Kai Nakamura",
    handle: "@kain",
    points: "8,920 XP",
    messages: "1,562",
    initials: "KN",
    color: "#75DBB5",
    role: "🌱 Regular",
  },
  {
    name: "Avery Morgan",
    handle: "@avery",
    points: "8,105 XP",
    messages: "1,408",
    initials: "AM",
    color: "#FFD17C",
    role: "☀️ Regular",
  },
  {
    name: "Noah Williams",
    handle: "@noahw",
    points: "7,680 XP",
    messages: "1,302",
    initials: "NW",
    color: "#8D93FF",
    role: "🎧 Regular",
  },
];

export type ActivityEvent = {
  id: string;
  category: "message" | "member" | "voice" | "moderation";
  title: string;
  description: string;
  time: string;
  actor: string;
  initials: string;
  color: string;
};

export const recentActivity: ActivityEvent[] = [
  {
    id: "evt-1",
    category: "message",
    title: "Chat is buzzing",
    description: "124 messages in # general",
    time: "2 min ago",
    actor: "Community",
    initials: "💬",
    color: palette.accent,
  },
  {
    id: "evt-2",
    category: "member",
    title: "A new face joined",
    description: "Welcome @pixelpoppy to the server",
    time: "18 min ago",
    actor: "Pixel Poppy",
    initials: "PP",
    color: palette.green,
  },
  {
    id: "evt-3",
    category: "voice",
    title: "Voice channel is active",
    description: "8 members in Cozy Lounge",
    time: "32 min ago",
    actor: "Cozy Lounge",
    initials: "♫",
    color: palette.blue,
  },
  {
    id: "evt-4",
    category: "moderation",
    title: "AutoMod caught spam",
    description: "1 message blocked in # links",
    time: "1 hr ago",
    actor: "ServerHub AutoMod",
    initials: "✓",
    color: palette.orange,
  },
  {
    id: "evt-5",
    category: "message",
    title: "Conversation peak",
    description: "42 messages in # game-night",
    time: "2 hr ago",
    actor: "Community",
    initials: "✦",
    color: palette.accent,
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
    { label: "W1", value: 48 },
    { label: "W2", value: 69 },
    { label: "W3", value: 56 },
    { label: "W4", value: 91 },
    { label: "W5", value: 72 },
    { label: "W6", value: 83 },
    { label: "W7", value: 66 },
  ],
};
