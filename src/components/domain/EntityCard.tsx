import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { EntityRef } from '@/src/entities/types';
import { ContentCard } from '@/src/components/primitives/Panels';
import { EntityAvatar } from '@/src/components/primitives/EntityAvatar';
import { useAppTheme } from '@/src/lib/providers/AppProviders';

export function EntityCard({ entity, meta, onPress }: { entity: EntityRef; meta: string; onPress?: () => void }) {
  const theme = useAppTheme();
  const tone = entity.kind === 'asset' ? 'mint' : entity.kind === 'liability' ? 'rose' : entity.kind === 'document' ? 'amber' : 'blue';

  return (
    <Pressable onPress={onPress}>
      <ContentCard style={styles.card}>
        <EntityAvatar label={entity.title} tone={tone} />
        <View style={styles.copy}>
          <Text style={[styles.title, { color: theme.colors.text }]}>{entity.title}</Text>
          {entity.subtitle ? <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>{entity.subtitle}</Text> : null}
          <Text style={[styles.meta, { color: theme.colors.textSecondary }]}>{meta}</Text>
        </View>
      </ContentCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  copy: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontFamily: 'Manrope_700Bold',
    fontSize: 15,
  },
  subtitle: {
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 12,
  },
  meta: {
    fontFamily: 'Manrope_500Medium',
    fontSize: 13,
  },
});
