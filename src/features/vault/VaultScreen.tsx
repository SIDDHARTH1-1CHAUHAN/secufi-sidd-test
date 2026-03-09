import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { AppScreen } from '@/src/components/primitives/AppScreen';
import { ContentCard, HeroCard } from '@/src/components/primitives/Panels';
import { PrimaryCTA } from '@/src/components/primitives/Buttons';
import { SectionHeader } from '@/src/components/primitives/SectionHeader';
import { SegmentedControl } from '@/src/components/primitives/SegmentedControl';
import { StatusChip } from '@/src/components/primitives/StatusChip';
import { useAppTheme, useHousehold, useRepositories, useToast } from '@/src/lib/providers/AppProviders';
import { documentMeta } from '@/src/entities/selectors';

const segments = ['All', 'By Person', 'Shared', 'Expiring', 'Missing'] as const;

function VaultStat({ label, value }: { label: string; value: string }) {
  const theme = useAppTheme();
  return (
    <View style={[styles.statCard, { backgroundColor: theme.colors.surfaceGlass, borderColor: theme.colors.border }]}> 
      <Text style={[styles.statValue, { color: theme.colors.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>{label}</Text>
    </View>
  );
}

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

  const sharedCount = snapshot.documents.filter((item) => item.sharedWith.length > 0).length;
  const expiringCount = snapshot.documents.filter((item) => item.parseStatus === 'expiring').length;
  const missingCount = snapshot.documents.filter((item) => item.parseStatus === 'missing').length;

  return (
    <AppScreen>
      <HeroCard>
        <StatusChip label="Vault intelligence" tone="amber" />
        <Text style={[styles.headline, { color: theme.colors.text }]}>A household archive where each document carries context, ownership, and urgency.</Text>
        <Text style={[styles.body, { color: theme.colors.textSecondary }]}>Track parse state, owner, expiry, and why each file matters to family readiness.</Text>
        <View style={styles.statsRow}>
          <VaultStat label="Shared" value={`${sharedCount}`} />
          <VaultStat label="Expiring" value={`${expiringCount}`} />
          <VaultStat label="Missing" value={`${missingCount}`} />
        </View>
        <PrimaryCTA label="Upload document" onPress={() => showToast('Upload flow is ready for backend wiring next')} />
      </HeroCard>

      <SegmentedControl items={segments} value={segment} onChange={setSegment} />

      <ContentCard>
        <SectionHeader eyebrow="Archive health" title={`${documents.length} records in view`} />
        {documents.map((document) => (
          <Pressable key={document.id} style={[styles.documentCard, { borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceRaised }]} onPress={() => router.push(`/document/${document.id}`)}>
            <View style={styles.docTop}>
              <StatusChip label={document.parseStatus === 'missing' ? 'Missing' : document.parseStatus === 'expiring' ? 'Expiring' : document.parseStatus === 'review' ? 'Needs review' : 'Parsed'} tone={document.parseStatus === 'missing' ? 'rose' : document.parseStatus === 'expiring' ? 'amber' : 'blue'} />
              <Ionicons name="arrow-forward" size={16} color={theme.colors.textMuted} />
            </View>
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
  headline: { fontFamily: 'CormorantGaramond_600SemiBold', fontSize: 36, lineHeight: 38 },
  body: { fontFamily: 'Manrope_500Medium', fontSize: 14, lineHeight: 22 },
  statsRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  statCard: { flex: 1, minWidth: 90, borderWidth: 1, borderRadius: 20, padding: 14, gap: 4 },
  statValue: { fontFamily: 'CormorantGaramond_600SemiBold', fontSize: 26, lineHeight: 26 },
  statLabel: { fontFamily: 'Manrope_600SemiBold', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 },
  documentCard: { borderWidth: 1, borderRadius: 22, padding: 16, gap: 8 },
  docTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  docTitle: { fontFamily: 'CormorantGaramond_600SemiBold', fontSize: 24 },
  docMeta: { fontFamily: 'Manrope_600SemiBold', fontSize: 12 },
  docHighlight: { fontFamily: 'Manrope_700Bold', fontSize: 13 },
});
