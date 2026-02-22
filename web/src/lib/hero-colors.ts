export interface HeroColor {
  color: string;
  text: string;
  bg: string;
}

const HERO_COLORS: Record<string, HeroColor> = {
  ironclad: {
    color: "#f59e0b",
    text: "#fcd34d",
    bg: "rgba(245, 158, 11, 0.15)",
  },
  deadeye: {
    color: "#ef4444",
    text: "#fca5a5",
    bg: "rgba(239, 68, 68, 0.15)",
  },
  aegis: {
    color: "#3b82f6",
    text: "#93c5fd",
    bg: "rgba(59, 130, 246, 0.15)",
  },
  oracle: {
    color: "#a855f7",
    text: "#d8b4fe",
    bg: "rgba(168, 85, 247, 0.15)",
  },
  lorekeeper: {
    color: "#10b981",
    text: "#6ee7b7",
    bg: "rgba(16, 185, 129, 0.15)",
  },
  titan: {
    color: "#06b6d4",
    text: "#67e8f9",
    bg: "rgba(6, 182, 212, 0.15)",
  },
};

export function getHeroColor(slug: string): HeroColor | undefined {
  return HERO_COLORS[slug];
}
