export type EntityKind =
  | 'person'
  | 'asset'
  | 'liability'
  | 'document'
  | 'task'
  | 'protection'
  | 'goal';

export type EntityRef = {
  id: string;
  kind: EntityKind;
  title: string;
  subtitle?: string;
};

export type PersonSummary = {
  id: string;
  name: string;
  role: string;
  ageBand: string;
  relationTone: string;
  readiness: 'strong' | 'watch' | 'risk';
  highlights: string[];
};

export type RelationshipEdge = {
  id: string;
  from: string;
  to: string;
  label: string;
};

export type AssetSummary = {
  id: string;
  title: string;
  type: string;
  ownerId: string;
  valueLabel: string;
  nomineeStatus: string;
  willIncluded: boolean;
  highlights: string[];
};

export type LiabilitySummary = {
  id: string;
  title: string;
  type: string;
  ownerId: string;
  valueLabel: string;
  protectionStatus: string;
  highlights: string[];
};

export type DocumentSummary = {
  id: string;
  title: string;
  category: string;
  ownerId: string;
  sharedWith: string[];
  parseStatus: 'parsed' | 'review' | 'missing' | 'expiring';
  expiresIn?: string;
  whyItMatters: string;
  highlights: string[];
};

export type ProtectionSummary = {
  id: string;
  title: string;
  coverage: string;
  linkedEntityId: string;
  status: 'covered' | 'gap' | 'review';
};

export type GoalIntent = {
  id: string;
  title: string;
  target: string;
  confidence: string;
};

export type TaskRecommendation = {
  id: string;
  title: string;
  description: string;
  urgency: 'today' | 'soon' | 'watch';
  target: EntityRef;
  actionLabel: string;
};

export type WillCoverageStatus = {
  stage: 'not_started' | 'in_progress' | 'review_ready';
  progressLabel: string;
  summary: string;
  unresolved: string[];
};

export type WillDraft = {
  householdIds: string[];
  beneficiaryIds: string[];
  executorIds: string[];
  guardianIds: string[];
  assetIds: string[];
  distributionSummary: string;
  notes: string[];
  coverage: WillCoverageStatus;
};

export type HouseholdRiskSignal = {
  id: string;
  title: string;
  detail: string;
  tone: 'blue' | 'amber' | 'rose' | 'mint';
  entity?: EntityRef;
};

export type HouseholdSnapshot = {
  id: string;
  householdName: string;
  greeting: string;
  pulseHeadline: string;
  pulseSummary: string;
  pulseScore: number;
  summaryLine: string;
  people: PersonSummary[];
  relationships: RelationshipEdge[];
  assets: AssetSummary[];
  liabilities: LiabilitySummary[];
  documents: DocumentSummary[];
  protections: ProtectionSummary[];
  goals: GoalIntent[];
  tasks: TaskRecommendation[];
  risks: HouseholdRiskSignal[];
  will: WillDraft;
  recentActivity: string[];
  quickPrompts: string[];
};

export type HouseholdGraphCluster = {
  id: string;
  label: string;
  count: number;
  tone: 'blue' | 'amber' | 'rose' | 'mint';
  items: EntityRef[];
};

export type HouseholdGraphFocusView = {
  anchor: EntityRef;
  satellites: EntityRef[];
  facts: string[];
  actions: { label: string; href: string }[];
};

export type HouseholdGraphOverlayState = {
  mode: 'relationship' | 'gaps' | 'estate' | 'documents';
  headline: string;
  highlights: HouseholdRiskSignal[];
};

export type GraphSelection = {
  kind: 'none' | 'person' | 'cluster';
  id?: string;
};

export type CopilotResponseBlock = {
  id: string;
  title: string;
  body: string;
  type: 'answer' | 'why' | 'act' | 'related';
  actions?: { label: string; href: string }[];
};

export type CopilotThreadItem = {
  id: string;
  role: 'user' | 'assistant';
  prompt: string;
  blocks: CopilotResponseBlock[];
  related: EntityRef[];
};

export type AppScenario = {
  id: 'emptyHousehold' | 'partialOnboarding' | 'connectedFamily' | 'estateRiskHousehold' | 'aiUnavailable';
  label: string;
  agentAvailable: boolean;
  snapshot: HouseholdSnapshot;
};
