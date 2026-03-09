import { Pressable, StyleSheet, Text, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

import { useAppTheme } from '@/src/lib/providers/AppProviders';

type ButtonProps = Omit<PressableProps, 'style'> & {
  label: string;
  style?: StyleProp<ViewStyle>;
};

export function PrimaryCTA({ label, style, ...props }: ButtonProps) {
  const theme = useAppTheme();
  return (
    <Pressable {...props} style={[styles.base, { backgroundColor: theme.colors.text }, style]}>
      <Text style={[styles.primaryText, { color: theme.colors.canvas }]}>{label}</Text>
    </Pressable>
  );
}

export function SecondaryCTA({ label, style, ...props }: ButtonProps) {
  const theme = useAppTheme();
  return (
    <Pressable {...props} style={[styles.base, styles.secondary, { borderColor: theme.colors.borderStrong }, style]}>
      <Text style={[styles.secondaryText, { color: theme.colors.text }]}>{label}</Text>
    </Pressable>
  );
}

export function InlineAction({ label, style, ...props }: ButtonProps) {
  const theme = useAppTheme();
  return (
    <Pressable {...props} style={[styles.inline, style]}>
      <Text style={[styles.inlineText, { color: theme.colors.blue }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondary: {
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  inline: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
  },
  primaryText: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 14,
  },
  secondaryText: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 14,
  },
  inlineText: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 13,
  },
});
