import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { AppScreen } from '@/src/components/primitives/AppScreen';
import { ContentCard, HeroCard } from '@/src/components/primitives/Panels';
import { PrimaryCTA, SecondaryCTA } from '@/src/components/primitives/Buttons';
import { SectionHeader } from '@/src/components/primitives/SectionHeader';
import { SegmentedControl } from '@/src/components/primitives/SegmentedControl';
import { StatusChip } from '@/src/components/primitives/StatusChip';
import { useAppTheme, useHousehold, useRepositories, useSheet } from '@/src/lib/providers/AppProviders';
import type { GraphSelection, HouseholdGraphOverlayState } from '@/src/entities/types';

const filters = ['People', 'Assets', 'Liabilities', 'Documents', 'Estate'] as const;
const overlays: HouseholdGraphOverlayState['mode'][] = ['relationship', 'gaps', 'estate', 'documents'];
const positions = [
  { top: 20, left: 34 },
  { top: 20, right: 34 },
  { top: 118, right: 10 },
  { bottom: 24, right: 70 },
  { bottom: 24, left: 70 },
  { top: 118, left: 10 },
];

export function HouseholdScreen() {
  const theme = useAppTheme();
  const { snapshot } = useHousehold();
  const { household } = useRepositories();
  const { openSheet } = useSheet();
  const [filter, setFilter] = useState<(typeof filters)[number]>('People');
  const [overlayMode, setOverlayMode] = useState<HouseholdGraphOverlayState['mode']>('relationship');
  const [selection, setSelection] = useState<GraphSelection>({ kind: 'none' });
  const [graph, setGraph] = useState<{ clusters: any[]; focus: any; overlay: HouseholdGraphOverlayState } | null>(null);

  useEffect(() => {
    void household.getHouseholdGraphView(selection, filter, overlayMode).then(setGraph);
  }, [filter, household, overlayMode, selection]);

  if (!snapshot || !graph) {
    return <AppScreen><ContentCard><Text style={[styles.body, { color: theme.colors.textSecondary }]}>Loading household graph...</Text></ContentCard></AppScreen>;
  }

  return (
    <AppScreen>
      <HeroCard>
        <StatusChip label="Household intelligence" tone="blue" />
        <Text style={[styles.headline, { color: theme.colors.text }]}>A mobile lens into how your family structure, assets, and evidence actually connect.</Text>
        <Text style={[styles.body, { color: theme.colors.textSecondary }]}>{graph.overlay.headline}</Text>
        <View style={styles.row}>
          <PrimaryCTA label="Continue will" onPress={() => router.push('/will')} />
          <SecondaryCTA label="Open overlay" onPress={() => setOverlayMode(overlayMode === 'gaps' ? 'relationship' : 'gaps')} />
        </View>
      </HeroCard>

      <SegmentedControl items={filters} value={filter} onChange={setFilter} />
      <SegmentedControl items={overlays} value={overlayMode} onChange={setOverlayMode} />

      <ContentCard>
        <SectionHeader eyebrow="Overview" title="Constellation" />
        <View style={styles.graphCard}>
          <View style={[styles.ringLarge, { borderColor: theme.colors.hairline }]} />
          <View style={[styles.ringSmall, { borderColor: theme.colors.hairline }]} />
          <View style={[styles.householdCore, { backgroundColor: theme.colors.blueSoft, borderColor: theme.colors.borderStrong }]}>
            <Text style={[styles.coreTitle, { color: theme.colors.text }]}>Household</Text>
            <Text style={[styles.coreSub, { color: theme.colors.textSecondary }]}>{snapshot.householdName}</Text>
          </View>
          {graph.clusters.map((cluster, index) => (
            <Pressable
              key={cluster.id}
              style={[styles.clusterBubble, positions[index], { backgroundColor: theme.colors.surfaceRaised, borderColor: theme.colors.border }]}
              onPress={() => setSelection({ kind: 'cluster', id: cluster.id })}>
              <Text style={[styles.clusterTitle, { color: theme.colors.text }]}>{cluster.label}</Text>
              <Text style={[styles.clusterCount, { color: theme.colors.textMuted }]}>{cluster.count} linked</Text>
            </Pressable>
          ))}
        </View>
      </ContentCard>

      <ContentCard>
        <SectionHeader eyebrow="People" title="Focus lens" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.personRail}>
          {snapshot.people.map((person) => (
            <Pressable
              key={person.id}
              onPress={() => setSelection({ kind: 'person', id: person.id })}
              style={[styles.personChip, { backgroundColor: theme.colors.canvasMuted, borderColor: theme.colors.border }]}>
              <Text style={[styles.personName, { color: theme.colors.text }]}>{person.name}</Text>
              <Text style={[styles.personRole, { color: theme.colors.textMuted }]}>{person.role}</Text>
            </Pressable>
          ))}
        </ScrollView>
        {graph.focus ? (
          <View style={styles.focusWrap}>
            <View style={styles.focusHeader}>
              <View>
                <Text style={[styles.focusAnchor, { color: theme.colors.text }]}>{graph.focus.anchor.title}</Text>
                <Text style={[styles.body, { color: theme.colors.textSecondary }]}>{graph.focus.facts.join(' • ')}</Text>
              </View>
              <Ionicons name="sparkles-outline" size={18} color={theme.colors.blue} />
            </View>
            <View style={styles.satelliteWrap}>
              {graph.focus.satellites.map((item: any) => (
                <Pressable
                  key={item.id}
                  style={[styles.satelliteChip, { borderColor: theme.colors.border, backgroundColor: theme.colors.surfaceRaised }]}
                  onPress={() => router.push(item.kind === 'asset' ? `/asset/${item.id}` : item.kind === 'liability' ? `/liability/${item.id}` : item.kind === 'document' ? `/document/${item.id}` : `/person/${item.id}`)}>
                  <Text style={[styles.satelliteText, { color: theme.colors.text }]}>{item.title}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        ) : null}
      </ContentCard>

      <ContentCard>
        <SectionHeader eyebrow="Overlay" title="What the agent found" />
        {graph.overlay.highlights.map((signal) => {
          const href = signal.entity ? `/${signal.entity.kind}/${signal.entity.id}` : null;
          return (
            <Pressable
              key={signal.id}
              onPress={() =>
                openSheet(
                  signal.title,
                  'Agent interpretation',
                  <View style={styles.sheetBlock}>
                    <Text style={[styles.body, { color: theme.colors.textSecondary }]}>{signal.detail}</Text>
                    {href ? <SecondaryCTA label={`Open ${signal.entity?.title ?? 'entity'}`} onPress={() => router.push(href as never)} /> : null}
                  </View>
                )
              }>
              <View style={[styles.overlayRow, { borderColor: theme.colors.border }]}> 
                <View style={styles.overlayTop}>
                  <Text style={[styles.overlayTitle, { color: theme.colors.text }]}>{signal.title}</Text>
                  <Ionicons name="eye-outline" size={16} color={theme.colors.textMuted} />
                </View>
                <Text style={[styles.body, { color: theme.colors.textSecondary }]}>{signal.detail}</Text>
              </View>
            </Pressable>
          );
        })}
      </ContentCard>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  headline: { fontFamily: 'CormorantGaramond_600SemiBold', fontSize: 34, lineHeight: 36 },
  body: { fontFamily: 'Manrope_500Medium', fontSize: 14, lineHeight: 22 },
  graphCard: { height: 330, justifyContent: 'center', alignItems: 'center' },
  ringLarge: { position: 'absolute', width: 290, height: 290, borderRadius: 145, borderWidth: 1 },
  ringSmall: { position: 'absolute', width: 190, height: 190, borderRadius: 95, borderWidth: 1 },
  householdCore: { width: 140, height: 140, borderRadius: 70, borderWidth: 1, alignItems: 'center', justifyContent: 'center', gap: 5 },
  coreTitle: { fontFamily: 'CormorantGaramond_600SemiBold', fontSize: 28 },
  coreSub: { fontFamily: 'Manrope_500Medium', fontSize: 11 },
  clusterBubble: { position: 'absolute', width: 122, minHeight: 74, borderRadius: 22, borderWidth: 1, padding: 12, justifyContent: 'center', gap: 2 },
  clusterTitle: { fontFamily: 'Manrope_700Bold', fontSize: 13 },
  clusterCount: { fontFamily: 'Manrope_500Medium', fontSize: 11 },
  personRail: { gap: 10 },
  personChip: { borderWidth: 1, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 12, width: 168, gap: 2 },
  personName: { fontFamily: 'Manrope_700Bold', fontSize: 14 },
  personRole: { fontFamily: 'Manrope_500Medium', fontSize: 12 },
  focusWrap: { gap: 12 },
  focusHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 },
  focusAnchor: { fontFamily: 'CormorantGaramond_600SemiBold', fontSize: 30 },
  satelliteWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  satelliteChip: { borderWidth: 1, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 10 },
  satelliteText: { fontFamily: 'Manrope_600SemiBold', fontSize: 12 },
  overlayRow: { borderWidth: 1, borderRadius: 22, padding: 16, gap: 8 },
  overlayTop: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  overlayTitle: { fontFamily: 'CormorantGaramond_600SemiBold', fontSize: 24, flex: 1 },
  sheetBlock: { gap: 14 },
});
