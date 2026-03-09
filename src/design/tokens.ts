export const colors = {
  canvas: '#071019',
  canvasDeep: '#040B12',
  canvasMuted: '#0C1723',
  surface: '#11202D',
  surfaceRaised: '#172938',
  surfaceHero: '#15283C',
  surfaceGlass: 'rgba(18, 34, 49, 0.82)',
  border: 'rgba(193, 209, 228, 0.14)',
  borderStrong: 'rgba(193, 209, 228, 0.28)',
  hairline: 'rgba(255,255,255,0.06)',
  text: '#F6F1E6',
  textSecondary: '#BCC7D4',
  textMuted: '#8896A5',
  blue: '#84AEFF',
  blueSoft: 'rgba(132, 174, 255, 0.16)',
  amber: '#E5BB78',
  amberSoft: 'rgba(229, 187, 120, 0.16)',
  rose: '#EF8E98',
  roseSoft: 'rgba(239, 142, 152, 0.16)',
  mint: '#7FD1AE',
  mintSoft: 'rgba(127, 209, 174, 0.16)',
  ivorySoft: 'rgba(246, 241, 230, 0.08)',
  focus: '#B9CFFF',
  shadow: '#01060B',
  overlay: 'rgba(3, 8, 14, 0.82)',
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
    shadowOpacity: 0.34,
    shadowRadius: 26,
    shadowOffset: { width: 0, height: 16 },
    elevation: 16,
  },
  soft: {
    shadowColor: '#000000',
    shadowOpacity: 0.2,
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
