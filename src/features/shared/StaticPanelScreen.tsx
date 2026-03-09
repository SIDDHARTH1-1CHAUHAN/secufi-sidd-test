import { router } from 'expo-router';
import { StyleSheet, Text } from 'react-native';

import { AppScreen } from '@/src/components/primitives/AppScreen';
import { ContentCard } from '@/src/components/primitives/Panels';
import { PrimaryCTA } from '@/src/components/primitives/Buttons';
import { useAppTheme } from '@/src/lib/providers/AppProviders';

export function StaticPanelScreen({ title, subtitle }: { title: string; subtitle: string }) {
  const theme = useAppTheme();

  return (
    <AppScreen>
      <ContentCard>
        <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
        <Text style={[styles.body, { color: theme.colors.textSecondary }]}>{subtitle}</Text>
        <PrimaryCTA label="Close" onPress={() => router.back()} />
      </ContentCard>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: 'CormorantGaramond_600SemiBold', fontSize: 28 },
  body: { fontFamily: 'Manrope_500Medium', fontSize: 14, lineHeight: 22 },
});
