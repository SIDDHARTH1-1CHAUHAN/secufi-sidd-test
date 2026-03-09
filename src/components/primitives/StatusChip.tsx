import { StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '@/src/lib/providers/AppProviders';

export function StatusChip({ label, tone = 'blue' }: { label: string; tone?: 'blue' | 'amber' | 'rose' | 'mint' }) {
  const theme = useAppTheme();
  const backgroundColor = {
    blue: theme.colors.blueSoft,
    amber: theme.colors.amberSoft,
    rose: theme.colors.roseSoft,
    mint: theme.colors.mintSoft,
  }[tone];

  return (
    <View style={[styles.chip, { backgroundColor }]}>
      <Text style={[styles.label, { color: theme.colors.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignSelf: 'flex-start',
  },
  label: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 12,
  },
});
