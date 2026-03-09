import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { CopilotThreadItem } from '@/src/entities/types';
import { ContentCard } from '@/src/components/primitives/Panels';
import { useAppTheme } from '@/src/lib/providers/AppProviders';

export function AnswerCard({ item, onActionPress }: { item: CopilotThreadItem; onActionPress?: (href: string) => void }) {
  const theme = useAppTheme();

  return (
    <ContentCard style={[styles.card, item.role === 'user' && styles.userCard]}>
      <Text style={[styles.role, { color: item.role === 'user' ? theme.colors.blue : theme.colors.textMuted }]}>
        {item.role === 'user' ? 'You asked' : 'SecuFi Copilot'}
      </Text>
      {item.blocks.map((block) => (
        <View key={block.id} style={styles.block}>
          <Text style={[styles.title, { color: theme.colors.text }]}>{block.title}</Text>
          <Text style={[styles.body, { color: theme.colors.textSecondary }]}>{block.body}</Text>
          {block.actions?.map((action) => (
            <Pressable key={action.href} onPress={() => onActionPress?.(action.href)} style={styles.action}>
              <Text style={[styles.actionText, { color: theme.colors.blue }]}>{action.label}</Text>
            </Pressable>
          ))}
        </View>
      ))}
      {item.related.length ? (
        <Text style={[styles.related, { color: theme.colors.textMuted }]}>
          Linked to {item.related.map((entity) => entity.title).join(' • ')}
        </Text>
      ) : null}
    </ContentCard>
  );
}

const styles = StyleSheet.create({
  card: { gap: 14 },
  userCard: { opacity: 0.96 },
  role: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  block: { gap: 6 },
  title: {
    fontFamily: 'CormorantGaramond_600SemiBold',
    fontSize: 24,
  },
  body: {
    fontFamily: 'Manrope_500Medium',
    fontSize: 14,
    lineHeight: 22,
  },
  action: { paddingTop: 2 },
  actionText: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 13,
  },
  related: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 12,
  },
});
