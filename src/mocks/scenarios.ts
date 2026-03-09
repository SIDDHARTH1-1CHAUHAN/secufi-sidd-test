import type {
  AppScenario,
  AssetSummary,
  CopilotThreadItem,
  DocumentSummary,
  EntityRef,
  HouseholdSnapshot,
  LiabilitySummary,
  PersonSummary,
  TaskRecommendation,
} from '@/src/entities/types';

const people: PersonSummary[] = [
  {
    id: 'person-ravi',
    name: 'Ravi Chauhan',
    role: 'Primary earner',
    ageBand: '38 years',
    relationTone: 'Spouse and parent',
    readiness: 'watch',
    highlights: ['Home loan co-borrower', 'Needs executor confirmation'],
  },
  {
    id: 'person-meera',
    name: 'Meera Chauhan',
    role: 'Co-owner',
    ageBand: '35 years',
    relationTone: 'Spouse and co-planner',
    readiness: 'strong',
    highlights: ['Shared vault access', 'Main nominee for investments'],
  },
  {
    id: 'person-isha',
    name: 'Isha Chauhan',
    role: 'Minor child',
    ageBand: '7 years',
    relationTone: 'Guardian planning needed',
    readiness: 'watch',
    highlights: ['Guardianship not finalised', 'Education goal linked'],
  },
  {
    id: 'person-sarla',
    name: 'Sarla Devi',
    role: 'Dependent parent',
    ageBand: '66 years',
    relationTone: 'Medical and estate coverage needed',
    readiness: 'risk',
    highlights: ['No will coverage yet', 'Medical file not shared'],
  },
];

const assets: AssetSummary[] = [
  {
    id: 'asset-home',
    title: 'Noida apartment',
    type: 'Real estate',
    ownerId: 'person-ravi',
    valueLabel: 'Rs 1.4 Cr',
    nomineeStatus: 'Nominee incomplete',
    willIncluded: true,
    highlights: ['Linked to housing loan', 'Title papers parsed'],
  },
  {
    id: 'asset-mf',
    title: 'Family mutual funds',
    type: 'Investments',
    ownerId: 'person-meera',
    valueLabel: 'Rs 23.5 L',
    nomineeStatus: 'Nominee mapped',
    willIncluded: true,
    highlights: ['SIP active', 'Needs beneficiary review'],
  },
  {
    id: 'asset-gold',
    title: 'Gold holdings',
    type: 'Physical assets',
    ownerId: 'person-meera',
    valueLabel: 'Rs 8.2 L',
    nomineeStatus: 'Document proof missing',
    willIncluded: false,
    highlights: ['Locker details missing', 'Relevant for will distribution'],
  },
];

const liabilities: LiabilitySummary[] = [
  {
    id: 'liability-home-loan',
    title: 'Housing loan',
    type: 'EMI liability',
    ownerId: 'person-ravi',
    valueLabel: 'Rs 48 L outstanding',
    protectionStatus: 'Insurance gap',
    highlights: ['High household dependency', 'Protection review recommended'],
  },
  {
    id: 'liability-car-loan',
    title: 'Vehicle loan',
    type: 'Short-term liability',
    ownerId: 'person-meera',
    valueLabel: 'Rs 4.2 L outstanding',
    protectionStatus: 'Covered',
    highlights: ['Insurance current', 'EMI on track'],
  },
];

const documents: DocumentSummary[] = [
  {
    id: 'document-will-draft',
    title: 'Current will draft',
    category: 'Estate',
    ownerId: 'person-ravi',
    sharedWith: ['person-meera'],
    parseStatus: 'review',
    whyItMatters: 'This draft excludes Sarla Devi and does not confirm Isha guardianship.',
    highlights: ['Review ready', 'Needs legal assistance checkpoint'],
  },
  {
    id: 'document-health-policy',
    title: 'Family health insurance',
    category: 'Protection',
    ownerId: 'person-meera',
    sharedWith: ['person-ravi'],
    parseStatus: 'expiring',
    expiresIn: '9 days',
    whyItMatters: 'Renewal timing affects dependent parent coverage continuity.',
    highlights: ['Parent rider missing', 'Renew before month-end'],
  },
  {
    id: 'document-property-title',
    title: 'Property title packet',
    category: 'Asset proof',
    ownerId: 'person-ravi',
    sharedWith: [],
    parseStatus: 'parsed',
    whyItMatters: 'Needed for estate summary and home loan continuity.',
    highlights: ['OCR complete', 'Shared access missing'],
  },
  {
    id: 'document-parent-id',
    title: 'Sarla identity and medical file',
    category: 'KYC',
    ownerId: 'person-sarla',
    sharedWith: [],
    parseStatus: 'missing',
    whyItMatters: 'Missing documents block care planning and estate readiness for Sarla.',
    highlights: ['Needs upload', 'Consent not fully captured'],
  },
];

const tasks: TaskRecommendation[] = [
  {
    id: 'task-will-review',
    title: 'Review household will coverage',
    description: 'Add Sarla Devi, confirm Isha guardianship, and review gold distribution.',
    urgency: 'today',
    target: { id: 'will-review', kind: 'task', title: 'Continue will' },
    actionLabel: 'Continue will',
  },
  {
    id: 'task-loan-cover',
    title: 'Close the housing-loan protection gap',
    description: 'Ravi income dependency is still higher than the current insurance cover.',
    urgency: 'today',
    target: { id: 'liability-home-loan', kind: 'liability', title: 'Housing loan' },
    actionLabel: 'Review protection',
  },
  {
    id: 'task-parent-docs',
    title: 'Upload Sarla medical and KYC records',
    description: 'These records are blocking care continuity and estate visibility.',
    urgency: 'soon',
    target: { id: 'document-parent-id', kind: 'document', title: 'Sarla identity and medical file' },
    actionLabel: 'Open vault',
  },
];

const connectedFamilySnapshot: HouseholdSnapshot = {
  id: 'household-chauhan',
  householdName: 'Chauhan household',
  greeting: 'Good evening, Ravi',
  pulseHeadline: 'Your household is visible, but not yet fully protected.',
  pulseSummary: 'Will coverage is in progress, one major liability is underprotected, and two critical documents need attention.',
  pulseScore: 74,
  summaryLine: '4 members, 3 assets, 2 liabilities, 4 key documents, 3 active actions.',
  people,
  relationships: [
    { id: 'rel-1', from: 'person-ravi', to: 'person-meera', label: 'spouse' },
    { id: 'rel-2', from: 'person-ravi', to: 'person-isha', label: 'parent' },
    { id: 'rel-3', from: 'person-meera', to: 'person-isha', label: 'parent' },
    { id: 'rel-4', from: 'person-ravi', to: 'person-sarla', label: 'child-of' },
  ],
  assets,
  liabilities,
  documents,
  protections: [
    { id: 'protection-1', title: 'Term cover', coverage: 'Rs 75 L', linkedEntityId: 'liability-home-loan', status: 'gap' },
    { id: 'protection-2', title: 'Family health insurance', coverage: 'Current family floater', linkedEntityId: 'document-health-policy', status: 'review' },
  ],
  goals: [
    { id: 'goal-1', title: 'Education reserve', target: 'Rs 35 L', confidence: 'On track with 68% confidence' },
    { id: 'goal-2', title: 'Estate readiness', target: 'Review-ready household pack', confidence: 'Needs 3 actions' },
  ],
  tasks,
  risks: [
    {
      id: 'risk-1',
      title: 'Housing loan is not fully protected',
      detail: 'If Ravi income stops, the current protection cover will not comfortably absorb the outstanding loan.',
      tone: 'rose',
      entity: { id: 'liability-home-loan', kind: 'liability', title: 'Housing loan' },
    },
    {
      id: 'risk-2',
      title: 'Dependent parent is missing from will coverage',
      detail: 'Sarla Devi is present in the household graph but absent from the current will draft summary.',
      tone: 'amber',
      entity: { id: 'person-sarla', kind: 'person', title: 'Sarla Devi' },
    },
    {
      id: 'risk-3',
      title: 'Two files are not shared with the right family member',
      detail: 'Property title and Sarla medical records remain isolated in the vault.',
      tone: 'blue',
      entity: { id: 'document-property-title', kind: 'document', title: 'Property title packet' },
    },
  ],
  will: {
    householdIds: ['person-ravi', 'person-meera', 'person-isha'],
    beneficiaryIds: ['person-meera', 'person-isha'],
    executorIds: ['person-meera'],
    guardianIds: [],
    assetIds: ['asset-home', 'asset-mf'],
    distributionSummary: 'Home to Meera, investments split across Meera and Isha, gold not yet assigned.',
    notes: ['Guardian for Isha not confirmed', 'Sarla support intent not documented'],
    coverage: {
      stage: 'in_progress',
      progressLabel: '3 of 5 sections complete',
      summary: 'The draft covers major assets but misses Sarla and leaves guardianship unresolved.',
      unresolved: ['Add dependent parent coverage', 'Confirm guardian for Isha', 'Assign gold holdings'],
    },
  },
  recentActivity: ['Property title parsed today', 'Will draft reopened yesterday', 'Insurance renewal flagged for next week'],
  quickPrompts: [
    'What is my biggest household risk right now?',
    'What documents are still missing for Sarla?',
    'Show me what the will still does not cover.',
    'How exposed is the home loan?'
  ],
};

const emptySnapshot: HouseholdSnapshot = {
  ...connectedFamilySnapshot,
  id: 'household-empty',
  householdName: 'Your household',
  greeting: 'Welcome to SecuFi',
  pulseHeadline: 'Start by adding your household so the agent can see what matters.',
  pulseSummary: 'No members, assets, or documents have been connected yet.',
  pulseScore: 0,
  summaryLine: 'No household data yet.',
  people: [],
  relationships: [],
  assets: [],
  liabilities: [],
  documents: [],
  protections: [],
  goals: [],
  tasks: [
    {
      id: 'task-start',
      title: 'Start your household profile',
      description: 'Add the people, assets, and essential records your family depends on.',
      urgency: 'today',
      target: { id: 'onboarding', kind: 'task', title: 'Onboarding' },
      actionLabel: 'Begin setup',
    },
  ],
  risks: [],
  will: {
    householdIds: [],
    beneficiaryIds: [],
    executorIds: [],
    guardianIds: [],
    assetIds: [],
    distributionSummary: '',
    notes: ['No will started yet'],
    coverage: {
      stage: 'not_started',
      progressLabel: 'Not started',
      summary: 'Create a will once your household members and important assets are connected.',
      unresolved: ['Add members', 'Add assets', 'Start will'],
    },
  },
  recentActivity: ['No household activity yet'],
  quickPrompts: ['How do I start setting up my household?'],
};

const partialSnapshot: HouseholdSnapshot = {
  ...connectedFamilySnapshot,
  id: 'household-partial',
  pulseHeadline: 'You have the basics in place, but the household story is still incomplete.',
  pulseSummary: 'Some members and documents are connected, but nominee and will data still need work.',
  pulseScore: 48,
  summaryLine: '2 members, 1 asset, 1 liability, 2 documents.',
  people: people.slice(0, 2),
  relationships: [{ id: 'rel-1', from: 'person-ravi', to: 'person-meera', label: 'spouse' }],
  assets: assets.slice(0, 1),
  liabilities: liabilities.slice(0, 1),
  documents: documents.slice(0, 2),
  tasks: tasks.slice(0, 2),
};

const aiUnavailableSnapshot: HouseholdSnapshot = {
  ...connectedFamilySnapshot,
  pulseHeadline: 'Your household view is ready. Live agent guidance is temporarily unavailable.',
  pulseSummary: 'Core readiness and document insights are still available while the agent reconnects.',
};

export const scenarios: Record<AppScenario['id'], AppScenario> = {
  emptyHousehold: { id: 'emptyHousehold', label: 'Empty household', agentAvailable: true, snapshot: emptySnapshot },
  partialOnboarding: { id: 'partialOnboarding', label: 'Partial onboarding', agentAvailable: true, snapshot: partialSnapshot },
  connectedFamily: { id: 'connectedFamily', label: 'Connected family', agentAvailable: true, snapshot: connectedFamilySnapshot },
  estateRiskHousehold: { id: 'estateRiskHousehold', label: 'Estate risk household', agentAvailable: true, snapshot: connectedFamilySnapshot },
  aiUnavailable: { id: 'aiUnavailable', label: 'AI unavailable', agentAvailable: false, snapshot: aiUnavailableSnapshot },
};

export const initialThread: CopilotThreadItem[] = [
  {
    id: 'thread-1',
    role: 'assistant',
    prompt: 'Household opening insight',
    blocks: [
      {
        id: 'thread-1-answer',
        type: 'answer',
        title: 'What the agent found',
        body: 'The biggest household issue is not missing data. It is unconnected protection: the housing loan, Sarla coverage, and the unfinished will all touch the same family risk.',
      },
      {
        id: 'thread-1-why',
        type: 'why',
        title: 'Why this matters',
        body: 'A single family event would affect repayment, dependent care, and inheritance clarity at the same time.',
      },
      {
        id: 'thread-1-act',
        type: 'act',
        title: 'Do this now',
        body: 'Continue the will review and then close the housing-loan cover gap.',
        actions: [
          { label: 'Continue will', href: '/will' },
          { label: 'Open household', href: '/(tabs)/household' }
        ],
      },
    ],
    related: [
      { id: 'liability-home-loan', kind: 'liability', title: 'Housing loan' },
      { id: 'person-sarla', kind: 'person', title: 'Sarla Devi' },
    ],
  },
];

export function entityRefsFromHousehold(snapshot: HouseholdSnapshot): EntityRef[] {
  return [
    ...snapshot.people.map((item) => ({ id: item.id, kind: 'person' as const, title: item.name, subtitle: item.role })),
    ...snapshot.assets.map((item) => ({ id: item.id, kind: 'asset' as const, title: item.title, subtitle: item.type })),
    ...snapshot.liabilities.map((item) => ({ id: item.id, kind: 'liability' as const, title: item.title, subtitle: item.type })),
    ...snapshot.documents.map((item) => ({ id: item.id, kind: 'document' as const, title: item.title, subtitle: item.category })),
    ...snapshot.tasks.map((item) => ({ id: item.id, kind: 'task' as const, title: item.title, subtitle: item.description })),
  ];
}
