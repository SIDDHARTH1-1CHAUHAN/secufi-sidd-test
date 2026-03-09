import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { TaskCard, RiskCard } from '@/src/components/domain/RiskCard';
import { PrimaryCTA, SecondaryCTA } from '@/src/components/primitives/Buttons';
import { AppScreen } from '@/src/components/primitives/AppScreen';
import { ContentCard, HeroCard } from '@/src/components/primitives/Panels';
import { SectionHeader } from '@/src/components/primitives/SectionHeader';
import { StatusChip } from '@/src/components/primitives/StatusChip';
import { useAppTheme, useCopilot, useHousehold, useToast } from '@/src/lib/providers/AppProviders';

export function HomeScreen() {
  const theme = useAppTheme();
  const { snapshot, loading } = useHousehold();
  const { setPromptDraft } = useCopilot();
  const { showToast } = useToast();

  if (loading || !snapshot) {
    return <AppScreen><ContentCard><Text style={[styles.body, { color: theme.colors.textSecondary }]}>Loading household pulse...</Text></ContentCard></AppScreen>;
  }

  const quickActions = snapshot.quickPrompts.slice(0, 3);
  const urgentDocuments = snapshot.documents.filter((item) => item.parseStatus !== 'parsed').slice(0, 3);

  return (
    <AppScreen>
      <Text style={[styles.greeting, { color: theme.colors.textSecondary }]}>{snapshot.greeting}</Text>
      <Text style={[styles.headline, { color: theme.colors.text }]}>{snapshot.pulseHeadline}</Text>

      <HeroCard>
        <StatusChip label={`Household pulse ${snapshot.pulseScore}`} tone="blue" />
        <Text style={[styles.heroTitle, { color: theme.colors.text }]}>{snapshot.pulseSummary}</Text>
        <Text style={[styles.body, { color: theme.colors.textSecondary }]}>{snapshot.summaryLine}</Text>
        <View style={styles.row}>
          <PrimaryCTA label={snapshot.will.coverage.stage === 'not_started' ? 'Create will' : 'Continue will'} onPress={() => router.push('/will')} />
          <SecondaryCTA
            label="Ask copilot"
            onPress={() => {
              setPromptDraft(snapshot.quickPrompts[0] ?? 'What should I do next?');
              router.push('/(tabs)/copilot');
            }}
          />
        </View>
      </HeroCard>

      <ContentCard>
        <SectionHeader eyebrow="Today" title="Needs attention" actionLabel="See all" onPressAction={() => showToast('Full task view comes next')} />
        {snapshot.tasks.slice(0, 2).map((task) => (
          <TaskCard key={task.id} task={task} onPress={() => router.push(task.target.kind === 'liability' ? `/liability/${task.target.id}` : task.target.id === 'onboarding' ? '/onboarding' : '/will')} />
        ))}
      </ContentCard>

      <ContentCard>
        <SectionHeader eyebrow="Will" title="Readiness" />
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{snapshot.will.coverage.progressLabel}</Text>
        <Text style={[styles.body, { color: theme.colors.textSecondary }]}>{snapshot.will.coverage.summary}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalRow}>
          {snapshot.will.coverage.unresolved.map((item) => (
            <StatusChip key={item} label={item} tone="amber" />
          ))}
        </ScrollView>
      </ContentCard>

      <ContentCard>
        <SectionHeader eyebrow="Quick ask" title="Ask your copilot" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalRow}>
          {quickActions.map((prompt) => (
            <Pressable
              key={prompt}
              style={[styles.promptChip, { backgroundColor: theme.colors.canvasMuted, borderColor: theme.colors.border }]}
              onPress={() => {
                setPromptDraft(prompt);
                router.push('/(tabs)/copilot');
              }}>
              <Text style={[styles.promptText, { color: theme.colors.text }]}>{prompt}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </ContentCard>

      <ContentCard>
        <SectionHeader eyebrow="Household" title="Map teaser" actionLabel="Open graph" onPressAction={() => router.push('/(tabs)/household')} />
        <View style={styles.miniGraph}>
          {snapshot.people.slice(0, 4).map((person, index) => {
            const positions = [styles.nodeTop, styles.nodeRight, styles.nodeBottom, styles.nodeLeft];
            return (
              <Pressable key={person.id} style={[styles.node, positions[index], { backgroundColor: theme.colors.surfaceRaised, borderColor: theme.colors.border }]} onPress={() => router.push('/(tabs)/household')}>
                <Text style={[styles.nodeLabel, { color: theme.colors.text }]}>{person.name.split(' ')[0]}</Text>
              </Pressable>
            );
          })}
          <View style={[styles.centerNode, { backgroundColor: theme.colors.blueSoft, borderColor: theme.colors.borderStrong }]}>
            <Text style={[styles.centerText, { color: theme.colors.text }]}>Household</Text>
          </View>
        </View>
      </ContentCard>

      <ContentCard>
        <SectionHeader eyebrow="Documents" title="Expiring, missing, and shared" />
        {urgentDocuments.map((document) => (
          <RiskCard
            key={document.id}
            signal={{ id: document.id, title: document.title, detail: document.whyItMatters, tone: document.parseStatus === 'missing' ? 'rose' : document.parseStatus === 'expiring' ? 'amber' : 'blue' }}
            onPress={() => router.push(`/document/${document.id}`)}
          />
        ))}
      </ContentCard>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  greeting: { fontFamily: 'Manrope_600SemiBold', fontSize: 13, textTransform: 'uppercase', letterSpacing: 1 },
  headline: { fontFamily: 'CormorantGaramond_600SemiBold', fontSize: 36, lineHeight: 38 },
  heroTitle: { fontFamily: 'CormorantGaramond_600SemiBold', fontSize: 30, lineHeight: 32 },
  body: { fontFamily: 'Manrope_500Medium', fontSize: 14, lineHeight: 22 },
  row: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  sectionTitle: { fontFamily: 'CormorantGaramond_600SemiBold', fontSize: 24 },
  horizontalRow: { gap: 10 },
  promptChip: { borderWidth: 1, borderRadius: 22, paddingHorizontal: 14, paddingVertical: 12, maxWidth: 220 },
  promptText: { fontFamily: 'Manrope_600SemiBold', fontSize: 13 },
  miniGraph: { height: 240, justifyContent: 'center', alignItems: 'center' },
  centerNode: { width: 120, height: 120, borderRadius: 60, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  centerText: { fontFamily: 'CormorantGaramond_600SemiBold', fontSize: 24 },
  node: { position: 'absolute', width: 84, height: 84, borderRadius: 42, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  nodeLabel: { fontFamily: 'Manrope_700Bold', fontSize: 13 },
  nodeTop: { top: 12 },
  nodeRight: { right: 18 },
  nodeBottom: { bottom: 12 },
  nodeLeft: { left: 18 },
});
