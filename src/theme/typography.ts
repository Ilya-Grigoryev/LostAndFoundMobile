// System font (Roboto on Android). No custom fonts loaded — see PROJECT_PLAN.md.
// textTransform на label baked in, чтобы не звать .toUpperCase() из компонентов.

export const typography = {
  h1: { fontSize: 32, fontWeight: '700' as const, letterSpacing: -0.5, lineHeight: 38 },
  h2: { fontSize: 24, fontWeight: '700' as const, letterSpacing: -0.3, lineHeight: 30 },
  h3: { fontSize: 18, fontWeight: '600' as const, letterSpacing: -0.2, lineHeight: 24 },
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  bodySm: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  caption: { fontSize: 13, fontWeight: '400' as const, lineHeight: 18 },
  label: {
    fontSize: 11,
    fontWeight: '700' as const,
    letterSpacing: 1.4,
    textTransform: 'uppercase' as const,
  },
} as const;
