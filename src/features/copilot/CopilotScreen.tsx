import { useDeferredValue } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { AnswerCard } from '@/src/components/domain/AnswerCard';
import { PrimaryCTA } from '@/src/components/primitives/Buttons';
import { AppScreen } from '@/src/components/primitives/AppScreen';
import { ContentCard, HeroCard } from '@/src/components/primitives/Panels';
import { SectionHeader } from '@/src/components/primitives/SectionHeader';
import { StatusChip } from '@/src/components/primitives/StatusChip';
import { useAppTheme, useCopilot, useHousehold, useToast } from '@/src/lib/providers/AppProviders';

const promptGroups = {
  Understand: ['Show me what belongs to whom', 'Summarize this household for me'],
  Gaps: ['What is missing right now?', 'Which risks matter first?'],
  Estate: ['What does the will still miss?', 'Who is not yet covered?'],
} as const;

export function CopilotScreen() {
  const theme = useAppTheme();
  const { snapshot } = useHousehold();
  const { thread, pending, promptDraft, setPromptDraft, sendPrompt, agentAvailable } = useCopilot();
  const { showToast } = useToast();
  const deferredPrompt = useDeferredValue(promptDraft);

  if (!snapshot) {
    return <AppScreen><ContentCard><Text style={[styles.body, { color: theme.colors.textSecondary }]}>Loading copilot context...</Text></ContentCard></AppScreen>;
  }

  return (
    <AppScreen>
      <HeroCard>
        <StatusChip label={agentAvailable ? 'Agent online' : 'Agent reconnecting'} tone={agentAvailable ? 'mint' : 'amber'} />
        <Text style={[styles.headline, { color: theme.colors.text }]}>A financial command surface grounded in the household, not a blank chat box.</Text>
        <Text style={[styles.body, { color: theme.colors.textSecondary }]}>
          {agentAvailable
            ? 'Ask for structure, gaps, evidence, or next-best action. The response cards stay connected to household entities.'
            : 'Live AI guidance is temporarily unavailable. Curated household actions are still available below.'}
        </Text>
      </HeroCard>

      <ContentCard>
        <SectionHeader eyebrow="Intent" title="Prompt groups" />
        <View style={styles.groupWrap}>
          {Object.entries(promptGroups).map(([group, prompts]) => (
            <View key={group} style={[styles.groupCard, { backgroundColor: theme.colors.surfaceRaised, borderColor: theme.colors.border }]}> 
              <Text style={[styles.groupTitle, { color: theme.colors.text }]}>{group}</Text>
              {prompts.map((prompt) => (
                <Pressable key={prompt} onPress={() => setPromptDraft(prompt)} style={styles.groupPrompt}>
                  <Text style={[styles.groupPromptText, { color: theme.colors.textSecondary }]}>{prompt}</Text>
                </Pressable>
              ))}
            </View>
          ))}
        </View>
      </ContentCard>

      <ContentCard>
        <SectionHeader eyebrow="Conversation" title="Answer, why, act" />
        <View style={styles.feed}>
          {thread.map((item) => (
            <AnswerCard
              key={item.id}
              item={item}
              onActionPress={(href) => {
                if (href.startsWith('/')) {
                  router.push(href as never);
                } else {
                  showToast('Action link not available yet');
                }
              }}
            />
          ))}
        </View>
      </ContentCard>

      <View style={[styles.inputBar, { backgroundColor: theme.colors.surfaceHero, borderColor: theme.colors.border }]}> 
        <View style={styles.inputHeader}>
          <View style={[styles.inputIcon, { backgroundColor: theme.colors.blueSoft }]}>
            <Ionicons name="sparkles-outline" size={16} color={theme.colors.text} />
          </View>
          <Text style={[styles.inputLabel, { color: theme.colors.text }]}>{agentAvailable ? 'Ask SecuFi' : 'Curated guidance only'}</Text>
        </View>
        <TextInput
          value={promptDraft}
          onChangeText={setPromptDraft}
          placeholder="Ask what the agent sees..."
          placeholderTextColor={theme.colors.textMuted}
          style={[styles.input, { color: theme.colors.text }]}
          multiline
          editable={agentAvailable}
        />
        <PrimaryCTA label={pending ? 'Thinking...' : agentAvailable ? 'Send' : 'Review actions'} onPress={() => void sendPrompt(deferredPrompt || 'What should I do next?')} />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  headline: { fontFamily: 'CormorantGaramond_600SemiBold', fontSize: 36, lineHeight: 38 },
  body: { fontFamily: 'Manrope_500Medium', fontSize: 14, lineHeight: 22 },
  groupWrap: { gap: 10 },
  groupCard: { borderWidth: 1, borderRadius: 22, padding: 14, gap: 8 },
  groupTitle: { fontFamily: 'CormorantGaramond_600SemiBold', fontSize: 24 },
  groupPrompt: { paddingVertical: 4 },
  groupPromptText: { fontFamily: 'Manrope_600SemiBold', fontSize: 13, lineHeight: 18 },
  feed: { gap: 12 },
  inputBar: { borderWidth: 1, borderRadius: 28, padding: 16, gap: 12 },
  inputHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  inputIcon: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  inputLabel: { fontFamily: 'Manrope_700Bold', fontSize: 14 },
  input: { minHeight: 92, fontFamily: 'Manrope_500Medium', fontSize: 14, textAlignVertical: 'top' },
});
