import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';

import { AppScreen } from '@/src/components/primitives/AppScreen';
import { ContentCard, HeroCard } from '@/src/components/primitives/Panels';
import { PrimaryCTA } from '@/src/components/primitives/Buttons';
import { SectionHeader } from '@/src/components/primitives/SectionHeader';
import { SegmentedControl } from '@/src/components/primitives/SegmentedControl';
import { useAppTheme, useHousehold, useRepositories, useToast } from '@/src/lib/providers/AppProviders';
import { documentMeta } from '@/src/entities/selectors';

const segments = ['All', 'By Person', 'Shared', 'Expiring', 'Missing'] as const;

export function VaultScreen() {
  const theme = useAppTheme();
  const { snapshot } = useHousehold();
  const { vault } = useRepositories();
  const { showToast } = useToast();
  const [segment, setSegment] = useState<(typeof segments)[number]>('All');
  const [documents, setDocuments] = useState<any[]>([]);

  useEffect(() => {
    void vault.getVaultOverview(segment, '').then(setDocuments);
  }, [segment, vault]);

  if (!snapshot) {
    return <AppScreen><ContentCard><Text style={[styles.body, { color: theme.colors.textSecondary }]}>Loading vault...</Text></ContentCard></AppScreen>;
  }

  return (
    <AppScreen>
      <HeroCard>
        <Text style={[styles.kicker, { color: theme.colors.textMuted }]}>Vault</Text>
        <Text style={[styles.headline, { color: theme.colors.text }]}>Documents that matter to the household, not a dead archive.</Text>
        <Text style={[styles.body, { color: theme.colors.textSecondary }]}>Track parse state, owner, expiry, and why each file matters to family readiness.</Text>
        <PrimaryCTA label="Upload document" onPress={() => showToast('Upload flow is ready for backend wiring next')} />
      </HeroCard>

      <SegmentedControl items={segments} value={segment} onChange={setSegment} />

      <ContentCard>
        <SectionHeader eyebrow="Archive health" title={`${documents.length} records in view`} />
        {documents.map((document) => (
          <Pressable key={document.id} style={[styles.documentCard, { borderColor: theme.colors.border }]} onPress={() => router.push(`/document/${document.id}`)}>
            <Text style={[styles.docTitle, { color: theme.colors.text }]}>{document.title}</Text>
            <Text style={[styles.docMeta, { color: theme.colors.textMuted }]}>{documentMeta(document, snapshot)}</Text>
            <Text style={[styles.body, { color: theme.colors.textSecondary }]}>{document.whyItMatters}</Text>
            <Text style={[styles.docHighlight, { color: theme.colors.blue }]}>{document.parseStatus === 'expiring' ? `Expires in ${document.expiresIn}` : document.highlights[0]}</Text>
          </Pressable>
        ))}
      </ContentCard>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  kicker: { fontFamily: 'Manrope_600SemiBold', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 },
  headline: { fontFamily: 'CormorantGaramond_600SemiBold', fontSize: 34, lineHeight: 36 },
  body: { fontFamily: 'Manrope_500Medium', fontSize: 14, lineHeight: 22 },
  documentCard: { borderWidth: 1, borderRadius: 20, padding: 16, gap: 8 },
  docTitle: { fontFamily: 'CormorantGaramond_600SemiBold', fontSize: 24 },
  docMeta: { fontFamily: 'Manrope_600SemiBold', fontSize: 12 },
  docHighlight: { fontFamily: 'Manrope_700Bold', fontSize: 13 },
});
