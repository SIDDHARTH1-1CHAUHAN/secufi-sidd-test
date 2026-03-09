import { createContext, startTransition, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';

import { theme } from '@/src/design';
import type { AppScenario, CopilotThreadItem, HouseholdSnapshot, WillDraft } from '@/src/entities/types';
import { featureFlags } from '@/src/lib/flags';
import type { RepositoryBundle } from '@/src/lib/repositories/contracts';
import { createMockRepositories } from '@/src/lib/repositories/mockRepositories';

type HouseholdState = {
  loading: boolean;
  scenarioId: AppScenario['id'];
  scenarioLabel: string;
  snapshot: HouseholdSnapshot | null;
  setScenarioId: (value: AppScenario['id']) => void;
};

type CopilotState = {
  thread: CopilotThreadItem[];
  pending: boolean;
  agentAvailable: boolean;
  promptDraft: string;
  setPromptDraft: (value: string) => void;
  sendPrompt: (prompt?: string) => Promise<void>;
};

type WillState = {
  draft: WillDraft | null;
  saveDraft: (step: string, payload: Partial<WillDraft>) => Promise<void>;
};

type ToastItem = { id: number; message: string } | null;

type ToastState = {
  showToast: (message: string) => void;
};

type SheetState = {
  openSheet: (title: string, subtitle: string, content: ReactNode) => void;
  closeSheet: () => void;
};

const ThemeContext = createContext(theme);
const RepositoryContext = createContext<RepositoryBundle | null>(null);
const HouseholdContext = createContext<HouseholdState | null>(null);
const CopilotContext = createContext<CopilotState | null>(null);
const WillContext = createContext<WillState | null>(null);
const ToastContext = createContext<ToastState | null>(null);
const SheetContext = createContext<SheetState | null>(null);

export function AppProviders({ children }: { children: ReactNode }) {
  const [scenarioId, setScenarioId] = useState<AppScenario['id']>(featureFlags.defaultScenario);
  const repositories = useMemo(() => createMockRepositories(scenarioId), [scenarioId]);
  const [snapshot, setSnapshot] = useState<HouseholdSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [thread, setThread] = useState<CopilotThreadItem[]>([]);
  const [pending, setPending] = useState(false);
  const [promptDraft, setPromptDraft] = useState('');
  const [draft, setDraft] = useState<WillDraft | null>(null);
  const [toast, setToast] = useState<ToastItem>(null);
  const [sheet, setSheet] = useState<{ title: string; subtitle: string; content: ReactNode } | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      const [nextSnapshot, nextThread, nextDraft] = await Promise.all([
        repositories.household.getHouseholdSnapshot(),
        repositories.copilot.getInitialThread(),
        repositories.will.getWillDraft(),
      ]);

      if (!active) {
        return;
      }

      startTransition(() => {
        setSnapshot(nextSnapshot);
        setThread(nextThread);
        setDraft(nextDraft);
        setLoading(false);
        setPromptDraft('');
      });
    }

    void load();

    return () => {
      active = false;
    };
  }, [repositories]);

  const householdValue: HouseholdState = {
    loading,
    scenarioId,
    scenarioLabel: repositories.scenario.label,
    snapshot,
    setScenarioId,
  };

  const copilotValue: CopilotState = {
    thread,
    pending,
    agentAvailable: repositories.scenario.agentAvailable,
    promptDraft,
    setPromptDraft,
    async sendPrompt(overridePrompt) {
      const prompt = (overridePrompt ?? promptDraft).trim();
      if (!prompt || !snapshot) {
        return;
      }

      setPending(true);
      void Haptics.selectionAsync();

      const userMessage: CopilotThreadItem = {
        id: `user-${Date.now()}`,
        role: 'user',
        prompt,
        blocks: [{ id: `user-block-${Date.now()}`, title: 'You asked', body: prompt, type: 'answer' }],
        related: [],
      };

      setThread((current) => [...current, userMessage]);

      if (!repositories.scenario.agentAvailable) {
        setThread((current) => [
          ...current,
          {
            id: `fallback-${Date.now()}`,
            role: 'assistant',
            prompt,
            blocks: [
              {
                id: `fallback-body-${Date.now()}`,
                title: 'Copilot is reconnecting',
                body: 'Live AI guidance is temporarily unavailable. You can still continue the will, review household risks, and work from the vault.',
                type: 'answer',
              },
            ],
            related: [],
          },
        ]);
        setPromptDraft('');
        setPending(false);
        return;
      }

      const reply = await repositories.copilot.sendCopilotPrompt(prompt, snapshot);
      setThread((current) => [...current, reply]);
      setPromptDraft('');
      setPending(false);
    },
  };

  const willValue: WillState = {
    draft,
    async saveDraft(step, payload) {
      const nextDraft = await repositories.will.saveWillStep(step, payload);
      setDraft(nextDraft);
      setSnapshot((current) => (current ? { ...current, will: nextDraft } : current));
    },
  };

  const toastValue: ToastState = {
    showToast(message) {
      const id = Date.now();
      setToast({ id, message });
      setTimeout(() => {
        setToast((current) => (current?.id === id ? null : current));
      }, 2400);
    },
  };

  const sheetValue: SheetState = {
    openSheet(title, subtitle, content) {
      void Haptics.selectionAsync();
      setSheet({ title, subtitle, content });
    },
    closeSheet() {
      setSheet(null);
    },
  };

  return (
    <ThemeContext.Provider value={theme}>
      <RepositoryContext.Provider value={repositories}>
        <HouseholdContext.Provider value={householdValue}>
          <CopilotContext.Provider value={copilotValue}>
            <WillContext.Provider value={willValue}>
              <ToastContext.Provider value={toastValue}>
                <SheetContext.Provider value={sheetValue}>
                  {children}
                  <ToastHost toast={toast} />
                  <SheetHost sheet={sheet} onClose={sheetValue.closeSheet} />
                </SheetContext.Provider>
              </ToastContext.Provider>
            </WillContext.Provider>
          </CopilotContext.Provider>
        </HouseholdContext.Provider>
      </RepositoryContext.Provider>
    </ThemeContext.Provider>
  );
}

function ToastHost({ toast }: { toast: ToastItem }) {
  if (!toast) {
    return null;
  }

  return (
    <View pointerEvents="none" style={styles.toastFrame}>
      <View style={styles.toastCard}>
        <Text style={styles.toastText}>{toast.message}</Text>
      </View>
    </View>
  );
}

function SheetHost({ sheet, onClose }: { sheet: { title: string; subtitle: string; content: ReactNode } | null; onClose: () => void }) {
  return (
    <Modal animationType="slide" transparent visible={Boolean(sheet)} onRequestClose={onClose}>
      <View style={styles.sheetScrim}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        {sheet ? (
          <View style={styles.sheetCard}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>{sheet.title}</Text>
            <Text style={styles.sheetSubtitle}>{sheet.subtitle}</Text>
            <View style={styles.sheetBody}>{sheet.content}</View>
          </View>
        ) : null}
      </View>
    </Modal>
  );
}

export function useAppTheme() {
  return useContext(ThemeContext);
}

export function useRepositories() {
  const value = useContext(RepositoryContext);
  if (!value) {
    throw new Error('useRepositories must be used within AppProviders');
  }
  return value;
}

export function useHousehold() {
  const value = useContext(HouseholdContext);
  if (!value) {
    throw new Error('useHousehold must be used within AppProviders');
  }
  return value;
}

export function useCopilot() {
  const value = useContext(CopilotContext);
  if (!value) {
    throw new Error('useCopilot must be used within AppProviders');
  }
  return value;
}

export function useWillDraft() {
  const value = useContext(WillContext);
  if (!value) {
    throw new Error('useWillDraft must be used within AppProviders');
  }
  return value;
}

export function useToast() {
  const value = useContext(ToastContext);
  if (!value) {
    throw new Error('useToast must be used within AppProviders');
  }
  return value;
}

export function useSheet() {
  const value = useContext(SheetContext);
  if (!value) {
    throw new Error('useSheet must be used within AppProviders');
  }
  return value;
}

const styles = StyleSheet.create({
  toastFrame: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 120,
    alignItems: 'center',
  },
  toastCard: {
    backgroundColor: '#132536',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(182, 204, 230, 0.18)',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  toastText: {
    color: '#F5EFE1',
    fontFamily: 'Manrope_600SemiBold',
    fontSize: 13,
  },
  sheetScrim: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(4, 10, 18, 0.6)',
  },
  sheetCard: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: '#102131',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderColor: 'rgba(182, 204, 230, 0.16)',
    minHeight: 260,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 48,
    height: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(245, 239, 225, 0.18)',
    marginBottom: 14,
  },
  sheetTitle: {
    color: '#F5EFE1',
    fontFamily: 'CormorantGaramond_600SemiBold',
    fontSize: 28,
  },
  sheetSubtitle: {
    color: '#B8C5D6',
    fontFamily: 'Manrope_500Medium',
    fontSize: 13,
    marginTop: 4,
  },
  sheetBody: {
    marginTop: 18,
    gap: 12,
  },
});
