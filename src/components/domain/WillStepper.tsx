import { StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '@/src/lib/providers/AppProviders';

const steps = ['Intro', 'People', 'Assets', 'Distribution', 'Review'] as const;

export function WillStepper({ active }: { active: number }) {
  const theme = useAppTheme();
  return (
    <View style={styles.row}>
      {steps.map((step, index) => {
        const filled = index <= active;
        return (
          <View key={step} style={styles.item}>
            <View style={[styles.dot, { backgroundColor: filled ? theme.colors.text : theme.colors.surfaceRaised, borderColor: theme.colors.border }]} />
            <Text style={[styles.label, { color: filled ? theme.colors.text : theme.colors.textMuted }]}>{step}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  item: { alignItems: 'center', gap: 6, flex: 1 },
  dot: { width: 12, height: 12, borderRadius: 6, borderWidth: 1 },
  label: { fontFamily: 'Manrope_600SemiBold', fontSize: 10, textAlign: 'center' },
});
