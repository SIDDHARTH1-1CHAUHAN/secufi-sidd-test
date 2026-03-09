import { useDeferredValue } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';

import { AnswerCard } from '@/src/components/domain/AnswerCard';
import { PrimaryCTA } from '@/src/components/primitives/Buttons';
import { AppScreen } from '@/src/components/primitives/AppScreen';
import { ContentCard, HeroCard } from '@/src/components/primitives/Panels';
import { SectionHeader } from '@/src/components/primitives/SectionHeader';
import { useAppTheme, useCopilot, useHousehold, useToast } from '@/src/lib/providers/AppProviders';

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
        <Text style={[styles.kicker, { color: theme.colors.textMuted }]}>Copilot</Text>
        <Text style={[styles.headline, { color: theme.colors.text }]}>Ask about household gaps, documents, liabilities, or inheritance.</Text>
        <Text style={[styles.body, { color: theme.colors.textSecondary }]}>
          {agentAvailable
            ? 'The agent is grounded in your household snapshot, not a generic finance chat.'
            : 'Live AI is temporarily unavailable. You can still use the curated action guidance below.'}
        </Text>
      </HeroCard>

      <ContentCard>
        <SectionHeader eyebrow="Suggestions" title="Prompt starters" />
        <View style={styles.promptWrap}>
          {snapshot.quickPrompts.map((prompt) => (
            <Pressable
              key={prompt}
              style={[styles.promptChip, { borderColor: theme.colors.border, backgroundColor: theme.colors.canvasMuted }]}
              onPress={() => setPromptDraft(prompt)}>
              <Text style={[styles.promptText, { color: theme.colors.text }]}>{prompt}</Text>
            </Pressable>
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
        <TextInput
          value={promptDraft}
          onChangeText={setPromptDraft}
          placeholder="Ask what the agent sees..."
          placeholderTextColor={theme.colors.textMuted}
          style={[styles.input, { color: theme.colors.text }]}
          multiline
        />
        <PrimaryCTA label={pending ? 'Thinking...' : 'Send'} onPress={() => void sendPrompt(deferredPrompt)} />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  kicker: { fontFamily: 'Manrope_600SemiBold', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 },
  headline: { fontFamily: 'CormorantGaramond_600SemiBold', fontSize: 34, lineHeight: 36 },
  body: { fontFamily: 'Manrope_500Medium', fontSize: 14, lineHeight: 22 },
  promptWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  promptChip: { borderWidth: 1, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 12, width: '48%' },
  promptText: { fontFamily: 'Manrope_600SemiBold', fontSize: 12, lineHeight: 18 },
  feed: { gap: 12 },
  inputBar: { borderWidth: 1, borderRadius: 28, padding: 14, gap: 12 },
  input: { minHeight: 88, fontFamily: 'Manrope_500Medium', fontSize: 14, textAlignVertical: 'top' },
});
