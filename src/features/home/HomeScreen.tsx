import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { DebitCardShowcase } from '@/src/components/domain/DebitCardShowcase';
import { TaskCard, RiskCard } from '@/src/components/domain/RiskCard';
import { PrimaryCTA, SecondaryCTA } from '@/src/components/primitives/Buttons';
import { AppScreen } from '@/src/components/primitives/AppScreen';
import { ContentCard, HeroCard } from '@/src/components/primitives/Panels';
import { SectionHeader } from '@/src/components/primitives/SectionHeader';
import { StatusChip } from '@/src/components/primitives/StatusChip';
import { useAppTheme, useCopilot, useHousehold, useToast } from '@/src/lib/providers/AppProviders';

function StatPill({ label, value }: { label: string; value: string }) {
  const theme = useAppTheme();
  return (
    <View style={[styles.statPill, { backgroundColor: theme.colors.surfaceGlass, borderColor: theme.colors.border }]}> 
      <Text style={[styles.statValue, { color: theme.colors.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: theme.colors.textMuted }]}>{label}</Text>
    </View>
  );
}

export function HomeScreen() {
  const theme = useAppTheme();
  const { snapshot, loading } = useHousehold();
  const { setPromptDraft } = useCopilot();
  const { showToast } = useToast();

  if (loading || !snapshot) {
    return <AppScreen><ContentCard><Text style={[styles.body, { color: theme.colors.textSecondary }]}>Loading household pulse...</Text></ContentCard></AppScreen>;
  }

  const quickActions = snapshot.quickPrompts.slice(0, 4);
  const urgentDocuments = snapshot.documents.filter((item) => item.parseStatus !== 'parsed').slice(0, 2);

  return (
    <AppScreen>
      <View style={styles.headerBlock}>
        <Text style={[styles.greeting, { color: theme.colors.textSecondary }]}>{snapshot.greeting}</Text>
        <Text style={[styles.headline, { color: theme.colors.text }]}>{snapshot.pulseHeadline}</Text>
      </View>

      <HeroCard>
        <StatusChip label={`Household pulse ${snapshot.pulseScore}`} tone="blue" />
        <Text style={[styles.heroTitle, { color: theme.colors.text }]}>{snapshot.pulseSummary}</Text>
        <Text style={[styles.body, { color: theme.colors.textSecondary }]}>{snapshot.summaryLine}</Text>
        <View style={styles.statRow}>
          <StatPill label="Will stage" value={snapshot.will.coverage.progressLabel} />
          <StatPill label="Next risk" value={snapshot.risks[0]?.title ?? 'No urgent risk'} />
        </View>
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
        <SectionHeader eyebrow="Access" title="Household card" actionLabel="Open vault" onPressAction={() => router.push('/(tabs)/vault')} />
        <DebitCardShowcase onActionPress={(action) => showToast(`${action} flow can route into Copilot or Vault next`)} />
      </ContentCard>

      <Pressable
        style={[styles.askBar, { backgroundColor: theme.colors.surfaceGlass, borderColor: theme.colors.border }]}
        onPress={() => {
          setPromptDraft(snapshot.quickPrompts[0] ?? 'What should I do next?');
          router.push('/(tabs)/copilot');
        }}>
        <View style={[styles.askIcon, { backgroundColor: theme.colors.blueSoft }]}>
          <Ionicons name="sparkles-outline" size={16} color={theme.colors.text} />
        </View>
        <View style={styles.askCopy}>
          <Text style={[styles.askTitle, { color: theme.colors.text }]}>Ask your copilot</Text>
          <Text style={[styles.askBody, { color: theme.colors.textMuted }]}>{snapshot.quickPrompts[1] ?? 'What the agent sees right now'}</Text>
        </View>
        <Ionicons name="arrow-forward" size={18} color={theme.colors.textMuted} />
      </Pressable>

      <ContentCard>
        <SectionHeader eyebrow="Today" title="Priority loop" actionLabel="View all" onPressAction={() => showToast('Expanded task board comes next')} />
        {snapshot.tasks.slice(0, 2).map((task) => (
          <TaskCard key={task.id} task={task} onPress={() => router.push(task.target.kind === 'liability' ? `/liability/${task.target.id}` : task.target.id === 'onboarding' ? '/onboarding' : '/will')} />
        ))}
      </ContentCard>

      <ContentCard>
        <SectionHeader eyebrow="Will" title="Readiness" actionLabel="Open flow" onPressAction={() => router.push('/will')} />
        <Text style={[styles.sectionLead, { color: theme.colors.text }]}>{snapshot.will.coverage.summary}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalRow}>
          {snapshot.will.coverage.unresolved.map((item) => (
            <StatusChip key={item} label={item} tone="amber" />
          ))}
        </ScrollView>
      </ContentCard>

      <ContentCard>
        <SectionHeader eyebrow="Agent" title="What the agent found" actionLabel="Open copilot" onPressAction={() => router.push('/(tabs)/copilot')} />
        {snapshot.risks.slice(0, 2).map((risk) => (
          <RiskCard key={risk.id} signal={risk} onPress={() => risk.entity ? router.push(`/${risk.entity.kind}/${risk.entity.id}` as never) : undefined} />
        ))}
      </ContentCard>

      <ContentCard>
        <SectionHeader eyebrow="Quick ask" title="Prompt starters" />
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
          <View style={[styles.ringOuter, { borderColor: theme.colors.hairline }]} />
          <View style={[styles.ringInner, { borderColor: theme.colors.hairline }]} />
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
            <Text style={[styles.centerSub, { color: theme.colors.textMuted }]}>{snapshot.people.length} people linked</Text>
          </View>
        </View>
      </ContentCard>

      <ContentCard>
        <SectionHeader eyebrow="Documents" title="Needs action" actionLabel="Open vault" onPressAction={() => router.push('/(tabs)/vault')} />
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
  headerBlock: { gap: 6 },
  greeting: { fontFamily: 'Manrope_600SemiBold', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1.1 },
  headline: { fontFamily: 'CormorantGaramond_600SemiBold', fontSize: 40, lineHeight: 40 },
  heroTitle: { fontFamily: 'CormorantGaramond_600SemiBold', fontSize: 32, lineHeight: 33 },
  body: { fontFamily: 'Manrope_500Medium', fontSize: 14, lineHeight: 22 },
  row: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  statRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  statPill: { flex: 1, minWidth: 140, borderWidth: 1, borderRadius: 20, padding: 14, gap: 4 },
  statValue: { fontFamily: 'CormorantGaramond_600SemiBold', fontSize: 24, lineHeight: 24 },
  statLabel: { fontFamily: 'Manrope_600SemiBold', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 },
  askBar: { borderWidth: 1, borderRadius: 24, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 },
  askIcon: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  askCopy: { flex: 1, gap: 2 },
  askTitle: { fontFamily: 'Manrope_700Bold', fontSize: 14 },
  askBody: { fontFamily: 'Manrope_500Medium', fontSize: 12 },
  sectionLead: { fontFamily: 'CormorantGaramond_600SemiBold', fontSize: 26, lineHeight: 28 },
  horizontalRow: { gap: 10 },
  promptChip: { borderWidth: 1, borderRadius: 22, paddingHorizontal: 14, paddingVertical: 12, maxWidth: 240 },
  promptText: { fontFamily: 'Manrope_600SemiBold', fontSize: 13, lineHeight: 18 },
  miniGraph: { height: 250, justifyContent: 'center', alignItems: 'center' },
  ringOuter: { position: 'absolute', width: 260, height: 260, borderRadius: 130, borderWidth: 1 },
  ringInner: { position: 'absolute', width: 170, height: 170, borderRadius: 85, borderWidth: 1 },
  centerNode: { width: 128, height: 128, borderRadius: 64, borderWidth: 1, alignItems: 'center', justifyContent: 'center', gap: 4 },
  centerText: { fontFamily: 'CormorantGaramond_600SemiBold', fontSize: 24 },
  centerSub: { fontFamily: 'Manrope_500Medium', fontSize: 11 },
  node: { position: 'absolute', width: 86, height: 86, borderRadius: 43, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  nodeLabel: { fontFamily: 'Manrope_700Bold', fontSize: 13 },
  nodeTop: { top: 6 },
  nodeRight: { right: 16 },
  nodeBottom: { bottom: 6 },
  nodeLeft: { left: 16 },
});
