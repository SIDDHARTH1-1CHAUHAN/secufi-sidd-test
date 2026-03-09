export const colors = {
  canvas: '#030604',
  canvasDeep: '#010302',
  canvasMuted: '#08100B',
  surface: '#0C1410',
  surfaceRaised: '#121C16',
  surfaceHero: '#0E1711',
  surfaceGlass: 'rgba(11, 19, 15, 0.86)',
  border: 'rgba(157, 201, 175, 0.12)',
  borderStrong: 'rgba(157, 201, 175, 0.24)',
  hairline: 'rgba(255,255,255,0.05)',
  text: '#F2F4EE',
  textSecondary: '#B1BEAF',
  textMuted: '#7B8A7F',
  blue: '#79D89C',
  blueSoft: 'rgba(121, 216, 156, 0.15)',
  amber: '#D8BA7A',
  amberSoft: 'rgba(216, 186, 122, 0.14)',
  rose: '#EA8C93',
  roseSoft: 'rgba(234, 140, 147, 0.14)',
  mint: '#9DF0BE',
  mintSoft: 'rgba(157, 240, 190, 0.16)',
  ivorySoft: 'rgba(242, 244, 238, 0.08)',
  focus: '#B8F7CC',
  shadow: '#000000',
  overlay: 'rgba(1, 3, 2, 0.86)',
} as const;

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 20,
  xl: 28,
  xxl: 36,
  xxxl: 48,
} as const;

export const radii = {
  xs: 10,
  sm: 14,
  md: 20,
  lg: 28,
  xl: 36,
  pill: 999,
} as const;

export const typography = {
  display: 38,
  displayLarge: 46,
  title: 28,
  heading: 20,
  body: 15,
  caption: 13,
  micro: 11,
  fonts: {
    display: 'CormorantGaramond_600SemiBold',
    displayBold: 'CormorantGaramond_700Bold',
    body: 'Manrope_500Medium',
    bodySemi: 'Manrope_600SemiBold',
    bodyBold: 'Manrope_700Bold',
    bodyExtra: 'Manrope_800ExtraBold',
  },
} as const;

export const motion = {
  quick: 180,
  standard: 260,
  slow: 360,
};

export const shadows = {
  glow: {
    shadowColor: '#000000',
    shadowOpacity: 0.42,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 18 },
    elevation: 18,
  },
  soft: {
    shadowColor: '#000000',
    shadowOpacity: 0.24,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
};

export const theme = {
  colors,
  spacing,
  radii,
  typography,
  motion,
  shadows,
};

export type AppTheme = typeof theme;
