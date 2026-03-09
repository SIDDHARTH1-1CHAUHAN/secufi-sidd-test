import type { ReactNode } from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { useAppTheme } from '@/src/lib/providers/AppProviders';

export function HeroCard({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const theme = useAppTheme();
  return (
    <View style={[styles.hero, { backgroundColor: theme.colors.surfaceHero, borderColor: theme.colors.border, shadowColor: theme.colors.shadow }, theme.shadows.glow, style]}>
      <View style={[styles.orbLarge, { backgroundColor: theme.colors.blueSoft }]} />
      <View style={[styles.orbSmall, { backgroundColor: theme.colors.amberSoft }]} />
      <View style={[styles.innerRing, { borderColor: theme.colors.hairline }]} />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

export function ContentCard({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const theme = useAppTheme();
  return <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, shadowColor: theme.colors.shadow }, theme.shadows.soft, style]}>{children}</View>;
}

export function EmptyStatePanel({ title, body }: { title: string; body: string }) {
  const theme = useAppTheme();
  return (
    <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}> 
      <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
      <Text style={[styles.body, { color: theme.colors.textSecondary }]}>{body}</Text>
    </View>
  );
}

export function SkeletonBlock({ height }: { height: number }) {
  const theme = useAppTheme();
  return <View style={[styles.skeleton, { height, backgroundColor: theme.colors.surfaceRaised }]} />;
}

const styles = StyleSheet.create({
  hero: {
    overflow: 'hidden',
    borderWidth: 1,
    borderRadius: 32,
    padding: 20,
    minHeight: 220,
  },
  content: {
    gap: 14,
    zIndex: 2,
  },
  card: {
    borderWidth: 1,
    borderRadius: 26,
    padding: 16,
    gap: 12,
  },
  title: {
    fontFamily: 'CormorantGaramond_600SemiBold',
    fontSize: 26,
  },
  body: {
    fontFamily: 'Manrope_500Medium',
    fontSize: 14,
    lineHeight: 22,
  },
  skeleton: {
    width: '100%',
    borderRadius: 24,
  },
  orbLarge: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    top: -40,
    right: -60,
  },
  orbSmall: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    bottom: -30,
    left: -10,
  },
  innerRing: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 1,
    top: 12,
    right: -80,
  },
});
