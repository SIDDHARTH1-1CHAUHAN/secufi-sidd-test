import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { CopilotThreadItem } from '@/src/entities/types';
import { ContentCard } from '@/src/components/primitives/Panels';
import { StatusChip } from '@/src/components/primitives/StatusChip';
import { useAppTheme } from '@/src/lib/providers/AppProviders';

function toneForBlock(type: CopilotThreadItem['blocks'][number]['type']) {
  if (type === 'why') return 'amber' as const;
  if (type === 'act') return 'mint' as const;
  if (type === 'related') return 'blue' as const;
  return 'blue' as const;
}

export function AnswerCard({ item, onActionPress }: { item: CopilotThreadItem; onActionPress?: (href: string) => void }) {
  const theme = useAppTheme();

  return (
    <ContentCard style={[styles.card, item.role === 'user' && { backgroundColor: theme.colors.canvasMuted }]}>
      <View style={styles.header}>
        <Text style={[styles.role, { color: item.role === 'user' ? theme.colors.blue : theme.colors.textMuted }]}>
          {item.role === 'user' ? 'You asked' : 'SecuFi Copilot'}
        </Text>
        {item.role === 'assistant' ? <StatusChip label="Grounded in household context" tone="blue" /> : null}
      </View>
      {item.blocks.map((block) => (
        <View key={block.id} style={[styles.block, { backgroundColor: theme.colors.surfaceRaised, borderColor: theme.colors.border }]}> 
          <View style={styles.blockTop}>
            <Text style={[styles.title, { color: theme.colors.text }]}>{block.title}</Text>
            {item.role === 'assistant' ? <StatusChip label={block.type === 'act' ? 'Action' : block.type === 'why' ? 'Reason' : block.type === 'related' ? 'Linked' : 'Answer'} tone={toneForBlock(block.type)} /> : null}
          </View>
          <Text style={[styles.body, { color: theme.colors.textSecondary }]}>{block.body}</Text>
          {block.actions?.length ? (
            <View style={styles.actions}>
              {block.actions.map((action) => (
                <Pressable key={action.href} onPress={() => onActionPress?.(action.href)} style={[styles.actionButton, { borderColor: theme.colors.borderStrong }]}>
                  <Text style={[styles.actionText, { color: theme.colors.text }]}>{action.label}</Text>
                </Pressable>
              ))}
            </View>
          ) : null}
        </View>
      ))}
      {item.related.length ? (
        <Text style={[styles.related, { color: theme.colors.textMuted }]}>Linked to {item.related.map((entity) => entity.title).join(' • ')}</Text>
      ) : null}
    </ContentCard>
  );
}

const styles = StyleSheet.create({
  card: { gap: 14 },
  header: { gap: 8 },
  role: { fontFamily: 'Manrope_700Bold', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 },
  block: { gap: 8, borderWidth: 1, borderRadius: 20, padding: 14 },
  blockTop: { gap: 8 },
  title: { fontFamily: 'CormorantGaramond_600SemiBold', fontSize: 24 },
  body: { fontFamily: 'Manrope_500Medium', fontSize: 14, lineHeight: 22 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  actionButton: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 10 },
  actionText: { fontFamily: 'Manrope_700Bold', fontSize: 12 },
  related: { fontFamily: 'Manrope_600SemiBold', fontSize: 12 },
});
