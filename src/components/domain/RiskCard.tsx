import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { HouseholdRiskSignal, TaskRecommendation } from '@/src/entities/types';
import { ContentCard } from '@/src/components/primitives/Panels';
import { StatusChip } from '@/src/components/primitives/StatusChip';
import { useAppTheme } from '@/src/lib/providers/AppProviders';

export function RiskCard({ signal, onPress }: { signal: HouseholdRiskSignal; onPress?: () => void }) {
  const theme = useAppTheme();
  return (
    <Pressable onPress={onPress}>
      <ContentCard style={styles.card}>
        <View style={styles.topRow}>
          <StatusChip label="Needs attention" tone={signal.tone} />
          <Ionicons name="arrow-forward" size={16} color={theme.colors.textMuted} />
        </View>
        <Text style={[styles.title, { color: theme.colors.text }]}>{signal.title}</Text>
        <Text style={[styles.body, { color: theme.colors.textSecondary }]}>{signal.detail}</Text>
      </ContentCard>
    </Pressable>
  );
}

export function TaskCard({ task, onPress }: { task: TaskRecommendation; onPress?: () => void }) {
  const theme = useAppTheme();
  const tone = task.urgency === 'today' ? 'rose' : task.urgency === 'soon' ? 'amber' : 'blue';
  return (
    <Pressable onPress={onPress}>
      <ContentCard style={styles.card}>
        <View style={styles.topRow}>
          <StatusChip label={task.urgency === 'today' ? 'Today' : task.urgency === 'soon' ? 'Soon' : 'Watch'} tone={tone} />
          <Text style={[styles.meta, { color: theme.colors.textMuted }]}>{task.target.title}</Text>
        </View>
        <Text style={[styles.title, { color: theme.colors.text }]}>{task.title}</Text>
        <Text style={[styles.body, { color: theme.colors.textSecondary }]}>{task.description}</Text>
        <View style={styles.linkRow}>
          <Text style={[styles.link, { color: theme.colors.blue }]}>{task.actionLabel}</Text>
          <Ionicons name="arrow-forward" size={14} color={theme.colors.blue} />
        </View>
      </ContentCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { gap: 10 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  title: { fontFamily: 'CormorantGaramond_600SemiBold', fontSize: 24, lineHeight: 25 },
  body: { fontFamily: 'Manrope_500Medium', fontSize: 14, lineHeight: 21 },
  meta: { fontFamily: 'Manrope_600SemiBold', fontSize: 12 },
  linkRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  link: { fontFamily: 'Manrope_700Bold', fontSize: 13 },
});
