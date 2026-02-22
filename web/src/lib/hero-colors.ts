export interface HeroColor {
  color: string;
  text: string;
  bg: string;
  light: string;
}

const HERO_COLORS: Record<string, HeroColor> = {
  ironclad: {
    color: "#E23636",
    text: "#B91C1C",
    bg: "rgba(226, 54, 54, 0.12)",
    light: "#FEE2E2",
  },
  deadeye: {
    color: "#7C3AED",
    text: "#5B21B6",
    bg: "rgba(124, 58, 237, 0.12)",
    light: "#EDE9FE",
  },
  aegis: {
    color: "#2563EB",
    text: "#1D4ED8",
    bg: "rgba(37, 99, 235, 0.12)",
    light: "#DBEAFE",
  },
  titan: {
    color: "#16A34A",
    text: "#15803D",
    bg: "rgba(22, 163, 74, 0.12)",
    light: "#DCFCE7",
  },
  lorekeeper: {
    color: "#D97706",
    text: "#B45309",
    bg: "rgba(217, 119, 6, 0.12)",
    light: "#FEF3C7",
  },
  oracle: {
    color: "#0891B2",
    text: "#0E7490",
    bg: "rgba(8, 145, 178, 0.12)",
    light: "#CFFAFE",
  },
};

export function getHeroColor(slug: string): HeroColor | undefined {
  return HERO_COLORS[slug];
}
