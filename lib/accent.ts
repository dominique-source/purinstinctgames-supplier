import type { ZoneAccent } from "./types";

type AccentClasses = {
  bg: string;
  text: string;
  border: string;
  ring: string;
  onBg: string;
};

export const ACCENT_CLASSES: Record<ZoneAccent, AccentClasses> = {
  lime: { bg: "bg-zone-lime", text: "text-zone-lime", border: "border-zone-lime", ring: "ring-zone-lime", onBg: "text-ink" },
  blue: { bg: "bg-zone-blue", text: "text-zone-blue", border: "border-zone-blue", ring: "ring-zone-blue", onBg: "text-white" },
  gold: { bg: "bg-zone-gold", text: "text-zone-gold", border: "border-zone-gold", ring: "ring-zone-gold", onBg: "text-ink" },
  teal: { bg: "bg-zone-teal", text: "text-zone-teal", border: "border-zone-teal", ring: "ring-zone-teal", onBg: "text-white" },
  purple: { bg: "bg-zone-purple", text: "text-zone-purple", border: "border-zone-purple", ring: "ring-zone-purple", onBg: "text-white" },
  red: { bg: "bg-zone-red", text: "text-zone-red", border: "border-zone-red", ring: "ring-zone-red", onBg: "text-white" },
};
