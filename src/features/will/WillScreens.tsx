import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { WillStepper } from '@/src/components/domain/WillStepper';
import { AppScreen } from '@/src/components/primitives/AppScreen';
import { ContentCard, HeroCard } from '@/src/components/primitives/Panels';
import { PrimaryCTA, SecondaryCTA } from '@/src/components/primitives/Buttons';
import { StatusChip } from '@/src/components/primitives/StatusChip';
import { useAppTheme, useHousehold, useWillDraft } from '@/src/lib/providers/AppProviders';

function SummaryCard({ title, body, tone = 'blue' }: { title: string; body: string; tone?: 'blue' | 'amber' | 'rose' | 'mint' }) {
  const theme = useAppTheme();
  return (
    <ContentCard style={[styles.summaryCard, { backgroundColor: theme.colors.surfaceRaised }]}> 
      <StatusChip label={title} tone={tone} />
      <Text style={[styles.body, { color: theme.colors.textSecondary }]}>{body}</Text>
    </ContentCard>
  );
}

export function WillIntroScreen() {
  const theme = useAppTheme();
  const { snapshot } = useHousehold();
  const { draft } = useWillDraft();

  return (
    <AppScreen>
      <WillStepper active={0} />
      <HeroCard>
        <StatusChip label={draft?.coverage.stage === 'not_started' ? 'Not started' : 'In progress'} tone={draft?.coverage.stage === 'not_started' ? 'amber' : 'mint'} />
        <Text style={[styles.headline, { color: theme.colors.text }]}>A guided family protection flow, not a legal-looking form.</Text>
        <Text style={[styles.body, { color: theme.colors.textSecondary }]}>Capture dependents, beneficiaries, executors, and important assets in a way that still feels calm and understandable.</Text>
        <PrimaryCTA label={draft?.coverage.stage === 'not_started' ? 'Start will' : 'Continue draft'} onPress={() => router.push('/will/people')} />
      </HeroCard>
      <SummaryCard title="Coverage" tone="amber" body={snapshot?.will.coverage.summary ?? 'No household coverage yet'} />
      <ContentCard>
        <Text style={[styles.title, { color: theme.colors.text }]}>Still unresolved</Text>
        {snapshot?.will.coverage.unresolved.map((item) => (
          <View key={item} style={styles.bulletRow}>
            <Ionicons name="ellipse" size={8} color={theme.colors.amber} />
            <Text style={[styles.bullet, { color: theme.colors.textSecondary }]}>{item}</Text>
          </View>
        ))}
      </ContentCard>
    </AppScreen>
  );
}

export function WillPeopleScreen() {
  const theme = useAppTheme();
  const { snapshot } = useHousehold();
  const { draft, saveDraft } = useWillDraft();
  const selected = new Set(draft?.beneficiaryIds ?? []);
  const executors = new Set(draft?.executorIds ?? []);
  const guardians = new Set(draft?.guardianIds ?? []);

  if (!snapshot || !draft) {
    return null;
  }

  return (
    <AppScreen>
      <WillStepper active={1} />
      <HeroCard>
        <Text style={[styles.headline, { color: theme.colors.text }]}>Choose the people this draft should protect and who should act for the household.</Text>
        <Text style={[styles.body, { color: theme.colors.textSecondary }]}>Each tap updates the family instruction layer before the legal wording phase.</Text>
      </HeroCard>
      {snapshot.people.map((person) => (
        <ContentCard key={person.id}>
          <View style={styles.cardTop}>
            <View style={styles.cardTopCopy}>
              <Text style={[styles.title, { color: theme.colors.text }]}>{person.name}</Text>
              <Text style={[styles.body, { color: theme.colors.textSecondary }]}>{person.role} • {person.relationTone}</Text>
            </View>
            <StatusChip label={person.readiness === 'risk' ? 'Needs attention' : person.readiness === 'watch' ? 'Watch' : 'Connected'} tone={person.readiness === 'risk' ? 'rose' : person.readiness === 'watch' ? 'amber' : 'mint'} />
          </View>
          <View style={styles.row}>
            <SecondaryCTA
              label={selected.has(person.id) ? 'Included' : 'Include'}
              onPress={() => void saveDraft('people', { beneficiaryIds: selected.has(person.id) ? draft.beneficiaryIds.filter((id) => id !== person.id) : [...draft.beneficiaryIds, person.id] })}
            />
            <SecondaryCTA
              label={executors.has(person.id) ? 'Executor set' : 'Set executor'}
              onPress={() => void saveDraft('people', { executorIds: executors.has(person.id) ? draft.executorIds.filter((id) => id !== person.id) : [person.id] })}
            />
            {person.name.includes('Isha') ? null : (
              <SecondaryCTA
                label={guardians.has(person.id) ? 'Guardian set' : 'Set guardian'}
                onPress={() => void saveDraft('people', { guardianIds: guardians.has(person.id) ? draft.guardianIds.filter((id) => id !== person.id) : [person.id] })}
              />
            )}
          </View>
        </ContentCard>
      ))}
      <PrimaryCTA label="Continue to assets" onPress={() => router.push('/will/assets')} />
    </AppScreen>
  );
}

export function WillAssetsScreen() {
  const theme = useAppTheme();
  const { snapshot } = useHousehold();
  const { draft, saveDraft } = useWillDraft();
  const selected = new Set(draft?.assetIds ?? []);

  if (!snapshot || !draft) {
    return null;
  }

  return (
    <AppScreen>
      <WillStepper active={2} />
      <HeroCard>
        <Text style={[styles.headline, { color: theme.colors.text }]}>Select the assets that should be unmistakably visible in the draft.</Text>
        <Text style={[styles.body, { color: theme.colors.textSecondary }]}>Missing assets create ambiguity later. This step keeps the estate summary usable on mobile.</Text>
      </HeroCard>
      {snapshot.assets.map((asset) => (
        <Pressable key={asset.id} onPress={() => void saveDraft('assets', { assetIds: selected.has(asset.id) ? draft.assetIds.filter((id) => id !== asset.id) : [...draft.assetIds, asset.id] })}>
          <ContentCard>
            <View style={styles.cardTop}>
              <View style={styles.cardTopCopy}>
                <Text style={[styles.title, { color: theme.colors.text }]}>{asset.title}</Text>
                <Text style={[styles.body, { color: theme.colors.textSecondary }]}>{asset.type} • {asset.valueLabel}</Text>
              </View>
              <StatusChip label={selected.has(asset.id) ? 'Included' : 'Review'} tone={selected.has(asset.id) ? 'mint' : 'amber'} />
            </View>
            <Text style={[styles.body, { color: theme.colors.textSecondary }]}>{asset.highlights.join(' • ')}</Text>
          </ContentCard>
        </Pressable>
      ))}
      <PrimaryCTA label="Continue to distribution" onPress={() => router.push('/will/distribution')} />
    </AppScreen>
  );
}

export function WillDistributionScreen() {
  const theme = useAppTheme();
  const { draft, saveDraft } = useWillDraft();
  const options = [
    'Protect spouse first, then split long-term assets for child support.',
    'Balance spouse security with dependent parent support.',
    'Keep real estate with spouse and investments flexible for the family.',
  ];

  if (!draft) {
    return null;
  }

  return (
    <AppScreen>
      <WillStepper active={3} />
      <HeroCard>
        <Text style={[styles.headline, { color: theme.colors.text }]}>Choose the plain-English intent the agent should carry into the draft review.</Text>
        <Text style={[styles.body, { color: theme.colors.textSecondary }]}>This is guidance for the family outcome, not final legal phrasing yet.</Text>
      </HeroCard>
      {options.map((option) => (
        <Pressable key={option} onPress={() => void saveDraft('distribution', { distributionSummary: option })}>
          <ContentCard style={[draft.distributionSummary === option && { borderColor: theme.colors.borderStrong, backgroundColor: theme.colors.surfaceRaised }]}>
            <Text style={[styles.body, { color: theme.colors.text }]}>{option}</Text>
            <Text style={[styles.selection, { color: draft.distributionSummary === option ? theme.colors.mint : theme.colors.textMuted }]}>
              {draft.distributionSummary === option ? 'Selected for review' : 'Tap to use'}
            </Text>
          </ContentCard>
        </Pressable>
      ))}
      <PrimaryCTA label="Review draft" onPress={() => router.push('/will/review')} />
    </AppScreen>
  );
}

export function WillReviewScreen() {
  const theme = useAppTheme();
  const { snapshot } = useHousehold();
  const { draft } = useWillDraft();
  const beneficiaryNames = useMemo(
    () => snapshot?.people.filter((person) => draft?.beneficiaryIds.includes(person.id)).map((person) => person.name).join(', ') ?? 'None selected',
    [draft?.beneficiaryIds, snapshot?.people]
  );
  const assetNames = useMemo(
    () => snapshot?.assets.filter((asset) => draft?.assetIds.includes(asset.id)).map((asset) => asset.title).join(', ') ?? 'None selected',
    [draft?.assetIds, snapshot?.assets]
  );

  if (!snapshot || !draft) {
    return null;
  }

  return (
    <AppScreen>
      <WillStepper active={4} />
      <HeroCard>
        <StatusChip label="Draft review" tone="mint" />
        <Text style={[styles.headline, { color: theme.colors.text }]}>Review what the draft now covers and what still needs a decision.</Text>
        <Text style={[styles.body, { color: theme.colors.textSecondary }]}>You can still step back into people, assets, or distribution before moving to legal finalization.</Text>
      </HeroCard>
      <SummaryCard title="Beneficiaries" body={beneficiaryNames} />
      <SummaryCard title="Assets included" body={assetNames} tone="mint" />
      <SummaryCard title="Distribution intent" body={draft.distributionSummary || 'Not chosen yet'} tone="amber" />
      <ContentCard>
        <Text style={[styles.title, { color: theme.colors.text }]}>Still unresolved</Text>
        {snapshot.will.coverage.unresolved.map((item) => (
          <View key={item} style={styles.bulletRow}>
            <Ionicons name="ellipse" size={8} color={theme.colors.amber} />
            <Text style={[styles.bullet, { color: theme.colors.textSecondary }]}>{item}</Text>
          </View>
        ))}
      </ContentCard>
      <View style={styles.row}>
        <PrimaryCTA label="Back to home" onPress={() => router.replace('/(tabs)/home')} />
        <SecondaryCTA label="Edit people" onPress={() => router.push('/will/people')} />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  headline: { fontFamily: 'CormorantGaramond_600SemiBold', fontSize: 36, lineHeight: 38 },
  body: { fontFamily: 'Manrope_500Medium', fontSize: 14, lineHeight: 22 },
  title: { fontFamily: 'CormorantGaramond_600SemiBold', fontSize: 26 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  bulletRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  bullet: { fontFamily: 'Manrope_500Medium', fontSize: 14, lineHeight: 22 },
  selection: { fontFamily: 'Manrope_700Bold', fontSize: 13 },
  summaryCard: { gap: 10 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' },
  cardTopCopy: { flex: 1, gap: 4 },
});
