export const fontFamily = {
  display: 'ArchivoBlack_400Regular',
  body: 'Manrope_400Regular',
  bodyMedium: 'Manrope_500Medium',
  bodyBold: 'Manrope_700Bold',
  bodyBlack: 'Manrope_800ExtraBold',
} as const;

export const typography = {
  hero: {
    fontFamily: fontFamily.display,
    fontSize: 56,
    letterSpacing: -2.5,
    lineHeight: 58,
  },
  h1: {
    fontFamily: fontFamily.display,
    fontSize: 44,
    letterSpacing: -2,
    lineHeight: 46,
  },
  h2: {
    fontFamily: fontFamily.bodyBlack,
    fontSize: 30,
    letterSpacing: -1.2,
    lineHeight: 34,
  },
  h3: {
    fontFamily: fontFamily.bodyBlack,
    fontSize: 22,
    letterSpacing: -0.6,
    lineHeight: 28,
  },
  body: {
    fontFamily: fontFamily.body,
    fontSize: 16,
    lineHeight: 24,
  },
  bodyBold: {
    fontFamily: fontFamily.bodyBold,
    fontSize: 16,
    lineHeight: 24,
  },
  caption: {
    fontFamily: fontFamily.body,
    fontSize: 13,
    lineHeight: 18,
  },
  label: {
    fontFamily: fontFamily.bodyBlack,
    fontSize: 11,
    letterSpacing: 2.8,
    textTransform: 'uppercase' as const,
  },
  button: {
    fontFamily: fontFamily.bodyBlack,
    fontSize: 14,
    letterSpacing: -0.2,
  },
} as const;
