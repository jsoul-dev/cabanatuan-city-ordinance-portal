/**
 * Design tokens — typed constants for use in JS/TS when CSS variables aren't sufficient.
 * These mirror the CSS custom properties defined in globals.css.
 */

// ─── Cabanatuan LGU Brand Palette ────────────────────────────────────────────

export const lgu = {
  green: {
    primary: "#059669",
    deep: "#047857",
    glow: "#10b981",
  },
  gold: {
    primary: "#f59e0b",
    deep: "#d97706",
    light: "#fbbf24",
  },
  black: "#050706",
} as const;

// ─── Spacing Scale (4px base) ────────────────────────────────────────────────

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  "2xl": 40,
  "3xl": 64,
  "4xl": 96,
  section: 128,
} as const;

// ─── Border Radius ───────────────────────────────────────────────────────────

export const rounded = {
  none: "0px",
  sm: "6px",
  md: "12px",
  lg: "16px",
  "pill-category": "64px",
  pill: "100px",
  full: "9999px",
} as const;

// ─── Breakpoints ─────────────────────────────────────────────────────────────

export const breakpoints = {
  mobile: 640,
  tablet: 768,
  laptop: 1024,
  desktop: 1200,
} as const;

// ─── Elevation Shadows (Geist system) ────────────────────────────────────────

export const shadows = {
  whisper: "0px 1px 1px rgba(0, 0, 0, 0.04)",
  floating:
    "0px 2px 2px rgba(0, 0, 0, 0.03), 0px 8px 16px -4px rgba(0, 0, 0, 0.06)",
} as const;
