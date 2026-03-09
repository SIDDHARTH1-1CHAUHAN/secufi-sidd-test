import { useLocalSearchParams, router } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import { AppScreen } from '@/src/components/primitives/AppScreen';
import { ContentCard } from '@/src/components/primitives/Panels';
import { PrimaryCTA } from '@/src/components/primitives/Buttons';
import { useAppTheme, useHousehold } from '@/src/lib/providers/AppProviders';
import { findEntity } from '@/src/entities/selectors';

export function EntityDetailScreen({ entityType }: { entityType: 'person' | 'asset' | 'liability' | 'document' | 'task' }) {
  const theme = useAppTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { snapshot } = useHousehold();

  if (!snapshot || !id) {
    return null;
  }

  const entity = findEntity(snapshot, entityType, id);

  return (
    <AppScreen>
      <ContentCard>
        <Text style={[styles.title, { color: theme.colors.text }]}>{entityType.charAt(0).toUpperCase() + entityType.slice(1)} detail</Text>
        <Text style={[styles.body, { color: theme.colors.textSecondary }]}>{entity ? JSON.stringify(entity, null, 2) : 'Entity not found in this scenario.'}</Text>
        <PrimaryCTA label="Close" onPress={() => router.back()} />
      </ContentCard>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: 'CormorantGaramond_600SemiBold', fontSize: 28 },
  body: { fontFamily: 'Manrope_500Medium', fontSize: 13, lineHeight: 21 },
});
