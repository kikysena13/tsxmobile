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

export type ActivityEvent = {
  id: string;
  category: "message" | "member" | "voice" | "moderation";
  summary: string;
  time: string;
};
