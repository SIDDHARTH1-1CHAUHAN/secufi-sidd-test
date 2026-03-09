import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { InlineAction } from './Buttons';
import { useAppTheme } from '@/src/lib/providers/AppProviders';

export function SectionHeader({ eyebrow, title, actionLabel, onPressAction }: { eyebrow?: string; title: string; actionLabel?: string; onPressAction?: () => void }) {
  const theme = useAppTheme();
  return (
    <View style={styles.row}>
      <View style={styles.texts}>
        {eyebrow ? <Text style={[styles.eyebrow, { color: theme.colors.textMuted }]}>{eyebrow}</Text> : null}
        <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
      </View>
      {actionLabel ? (
        <View style={styles.actionWrap}>
          <InlineAction label={actionLabel} onPress={onPressAction} />
          <Ionicons name="arrow-forward" size={12} color={theme.colors.blue} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', gap: 12 },
  texts: { flex: 1, gap: 4 },
  actionWrap: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  eyebrow: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1.1,
  },
  title: {
    fontFamily: 'CormorantGaramond_600SemiBold',
    fontSize: 30,
    lineHeight: 30,
  },
});
