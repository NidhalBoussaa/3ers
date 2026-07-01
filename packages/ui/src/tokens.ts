// Brand tokens derived from DESIGN.md — single source of truth for all apps.

export const colors = {
  // Gold ramp — the signature metal
  gold: "#c9a44c",
  goldBright: "#f1d894",
  goldSoft: "#e7cf8e",
  goldDeep: "#8c6d2a",

  // Neutrals
  night: "#0b0805",
  cream: "#faf6ec",
  champagne: "#f7f1e3",
  ink: "#2c2114",
  inkSoft: "#5b4e3a",
} as const;

export const fonts = {
  display: ["Cinzel Decorative", "serif"],
  script: ["Great Vibes", "cursive"],
  label: ["Cinzel", "serif"],
  arabic: ["Amiri", "serif"],
  body: ["Cormorant Garamond", "Georgia", "serif"],
} as const;
