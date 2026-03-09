import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { WillStepper } from '@/src/components/domain/WillStepper';
import { AppScreen } from '@/src/components/primitives/AppScreen';
import { ContentCard, HeroCard } from '@/src/components/primitives/Panels';
import { PrimaryCTA, SecondaryCTA } from '@/src/components/primitives/Buttons';
import { useAppTheme, useHousehold, useWillDraft } from '@/src/lib/providers/AppProviders';

export function WillIntroScreen() {
  const theme = useAppTheme();
  const { snapshot } = useHousehold();
  const { draft } = useWillDraft();

  return (
    <AppScreen>
      <WillStepper active={0} />
      <HeroCard>
        <Text style={[styles.headline, { color: theme.colors.text }]}>Build a will that matches the real household, not a cold legal form.</Text>
        <Text style={[styles.body, { color: theme.colors.textSecondary }]}>
          Capture who depends on whom, which assets matter, and what still needs clarity before the draft is ready.
        </Text>
        <PrimaryCTA label={draft?.coverage.stage === 'not_started' ? 'Start will' : 'Continue draft'} onPress={() => router.push('/will/people')} />
      </HeroCard>
      <ContentCard>
        <Text style={[styles.title, { color: theme.colors.text }]}>{snapshot?.will.coverage.summary}</Text>
        {snapshot?.will.coverage.unresolved.map((item) => (
          <Text key={item} style={[styles.bullet, { color: theme.colors.textSecondary }]}>{`• ${item}`}</Text>
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
        <Text style={[styles.headline, { color: theme.colors.text }]}>Choose who the draft should protect and who should act for the family.</Text>
        <Text style={[styles.body, { color: theme.colors.textSecondary }]}>Tap household members to include them as beneficiaries. Use the small actions below each card for executor and guardian roles.</Text>
      </HeroCard>
      {snapshot.people.map((person) => (
        <ContentCard key={person.id}>
          <Text style={[styles.title, { color: theme.colors.text }]}>{person.name}</Text>
          <Text style={[styles.body, { color: theme.colors.textSecondary }]}>{person.role} • {person.relationTone}</Text>
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
        <Text style={[styles.headline, { color: theme.colors.text }]}>Select the important assets that should clearly appear in the draft.</Text>
        <Text style={[styles.body, { color: theme.colors.textSecondary }]}>Assets missing here remain unclear in the estate summary and can create avoidable friction later.</Text>
      </HeroCard>
      {snapshot.assets.map((asset) => (
        <Pressable
          key={asset.id}
          onPress={() => void saveDraft('assets', { assetIds: selected.has(asset.id) ? draft.assetIds.filter((id) => id !== asset.id) : [...draft.assetIds, asset.id] })}>
          <ContentCard>
            <Text style={[styles.title, { color: theme.colors.text }]}>{asset.title}</Text>
            <Text style={[styles.body, { color: theme.colors.textSecondary }]}>{asset.type} • {asset.valueLabel}</Text>
            <Text style={[styles.selection, { color: selected.has(asset.id) ? theme.colors.mint : theme.colors.textMuted }]}>
              {selected.has(asset.id) ? 'Included in draft' : 'Tap to include'}
            </Text>
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
        <Text style={[styles.headline, { color: theme.colors.text }]}>Choose the plain-English distribution intent the agent will review with you.</Text>
        <Text style={[styles.body, { color: theme.colors.textSecondary }]}>This is not the final legal wording. It is the household instruction layer.</Text>
      </HeroCard>
      {options.map((option) => (
        <Pressable key={option} onPress={() => void saveDraft('distribution', { distributionSummary: option })}>
          <ContentCard>
            <Text style={[styles.body, { color: theme.colors.text }]}>{option}</Text>
            <Text style={[styles.selection, { color: draft.distributionSummary === option ? theme.colors.mint : theme.colors.textMuted }]}>
              {draft.distributionSummary === option ? 'Selected' : 'Tap to use'}
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
        <Text style={[styles.headline, { color: theme.colors.text }]}>Review what the draft now covers.</Text>
        <Text style={[styles.body, { color: theme.colors.textSecondary }]}>You can still return to any section. The goal here is clarity, not legal final wording yet.</Text>
      </HeroCard>
      <ContentCard>
        <Text style={[styles.title, { color: theme.colors.text }]}>Beneficiaries</Text>
        <Text style={[styles.body, { color: theme.colors.textSecondary }]}>{beneficiaryNames}</Text>
      </ContentCard>
      <ContentCard>
        <Text style={[styles.title, { color: theme.colors.text }]}>Assets included</Text>
        <Text style={[styles.body, { color: theme.colors.textSecondary }]}>{assetNames}</Text>
      </ContentCard>
      <ContentCard>
        <Text style={[styles.title, { color: theme.colors.text }]}>Distribution intent</Text>
        <Text style={[styles.body, { color: theme.colors.textSecondary }]}>{draft.distributionSummary || 'Not chosen yet'}</Text>
      </ContentCard>
      <ContentCard>
        <Text style={[styles.title, { color: theme.colors.text }]}>Still unresolved</Text>
        {snapshot.will.coverage.unresolved.map((item) => (
          <Text key={item} style={[styles.bullet, { color: theme.colors.textSecondary }]}>{`• ${item}`}</Text>
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
  headline: { fontFamily: 'CormorantGaramond_600SemiBold', fontSize: 34, lineHeight: 36 },
  body: { fontFamily: 'Manrope_500Medium', fontSize: 14, lineHeight: 22 },
  title: { fontFamily: 'CormorantGaramond_600SemiBold', fontSize: 26 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  bullet: { fontFamily: 'Manrope_500Medium', fontSize: 14, lineHeight: 22 },
  selection: { fontFamily: 'Manrope_700Bold', fontSize: 13 },
});
