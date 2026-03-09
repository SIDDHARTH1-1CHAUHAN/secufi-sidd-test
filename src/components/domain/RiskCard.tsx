import { Pressable, StyleSheet, Text } from 'react-native';

import type { HouseholdRiskSignal, TaskRecommendation } from '@/src/entities/types';
import { ContentCard } from '@/src/components/primitives/Panels';
import { StatusChip } from '@/src/components/primitives/StatusChip';
import { useAppTheme } from '@/src/lib/providers/AppProviders';

export function RiskCard({ signal, onPress }: { signal: HouseholdRiskSignal; onPress?: () => void }) {
  const theme = useAppTheme();
  return (
    <Pressable onPress={onPress}>
      <ContentCard>
        <StatusChip label="Needs attention" tone={signal.tone} />
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
      <ContentCard>
        <StatusChip label={task.urgency === 'today' ? 'Today' : task.urgency === 'soon' ? 'Soon' : 'Watch'} tone={tone} />
        <Text style={[styles.title, { color: theme.colors.text }]}>{task.title}</Text>
        <Text style={[styles.body, { color: theme.colors.textSecondary }]}>{task.description}</Text>
        <Text style={[styles.link, { color: theme.colors.blue }]}>{task.actionLabel}</Text>
      </ContentCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: 'CormorantGaramond_600SemiBold', fontSize: 24 },
  body: { fontFamily: 'Manrope_500Medium', fontSize: 14, lineHeight: 21 },
  link: { fontFamily: 'Manrope_700Bold', fontSize: 13 },
});
