export const colors = {
  canvas: '#08111A',
  canvasMuted: '#0D1823',
  surface: '#102131',
  surfaceRaised: '#14283B',
  surfaceHero: '#162A3F',
  border: 'rgba(182, 204, 230, 0.16)',
  borderStrong: 'rgba(182, 204, 230, 0.28)',
  text: '#F5EFE1',
  textSecondary: '#B8C5D6',
  textMuted: '#8B98A8',
  blue: '#7DA9FF',
  blueSoft: 'rgba(125, 169, 255, 0.18)',
  amber: '#E7B66D',
  amberSoft: 'rgba(231, 182, 109, 0.18)',
  rose: '#F18E94',
  roseSoft: 'rgba(241, 142, 148, 0.18)',
  mint: '#7FD2B0',
  mintSoft: 'rgba(127, 210, 176, 0.18)',
  focus: '#B2CCFF',
  shadow: '#02070C',
  overlay: 'rgba(4, 10, 18, 0.8)',
} as const;

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 20,
  xl: 28,
  xxl: 36,
} as const;

export const radii = {
  sm: 14,
  md: 20,
  lg: 28,
  pill: 999,
} as const;

export const typography = {
  display: 36,
  title: 26,
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

export const theme = {
  colors,
  spacing,
  radii,
  typography,
  motion,
};

export type AppTheme = typeof theme;
