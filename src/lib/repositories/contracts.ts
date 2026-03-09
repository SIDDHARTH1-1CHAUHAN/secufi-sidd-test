import type {
  AppScenario,
  CopilotThreadItem,
  GraphSelection,
  HouseholdGraphCluster,
  HouseholdGraphFocusView,
  HouseholdGraphOverlayState,
  HouseholdSnapshot,
  WillDraft,
} from '@/src/entities/types';

export type HouseholdRepository = {
  getHouseholdSnapshot(): Promise<HouseholdSnapshot>;
  getHouseholdGraphView(selection: GraphSelection, filter: string, overlayMode: HouseholdGraphOverlayState['mode']): Promise<{
    clusters: HouseholdGraphCluster[];
    focus: HouseholdGraphFocusView | null;
    overlay: HouseholdGraphOverlayState;
  }>;
};

export type VaultRepository = {
  getVaultOverview(segment: string, filter: string): Promise<HouseholdSnapshot['documents']>;
};

export type CopilotRepository = {
  getInitialThread(): Promise<CopilotThreadItem[]>;
  sendCopilotPrompt(prompt: string, context: HouseholdSnapshot): Promise<CopilotThreadItem>;
};

export type WillRepository = {
  getWillDraft(): Promise<WillDraft>;
  saveWillStep(step: string, payload: Partial<WillDraft>): Promise<WillDraft>;
};

export type RepositoryBundle = {
  scenario: AppScenario;
  household: HouseholdRepository;
  vault: VaultRepository;
  copilot: CopilotRepository;
  will: WillRepository;
};
