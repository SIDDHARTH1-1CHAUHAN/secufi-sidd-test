import type {
  AppScenario,
  AssetSummary,
  CopilotThreadItem,
  DocumentSummary,
  EntityRef,
  GraphSelection,
  HouseholdGraphCluster,
  HouseholdGraphFocusView,
  HouseholdGraphOverlayState,
  LiabilitySummary,
  PersonSummary,
  WillDraft,
} from '@/src/entities/types';
import { scenarios, initialThread } from '@/src/mocks/scenarios';
import type { RepositoryBundle } from './contracts';

function toRef(item: PersonSummary | AssetSummary | LiabilitySummary | DocumentSummary, kind: EntityRef['kind']): EntityRef {
  return {
    id: item.id,
    kind,
    title: 'name' in item ? item.name : item.title,
    subtitle: 'role' in item ? item.role : 'type' in item ? item.type : item.category,
  };
}

function buildClusters(scenario: AppScenario): HouseholdGraphCluster[] {
  const { snapshot } = scenario;

  return [
    {
      id: 'cluster-people',
      label: 'People',
      count: snapshot.people.length,
      tone: 'blue',
      items: snapshot.people.map((item) => toRef(item, 'person')),
    },
    {
      id: 'cluster-assets',
      label: 'Assets',
      count: snapshot.assets.length,
      tone: 'mint',
      items: snapshot.assets.map((item) => toRef(item, 'asset')),
    },
    {
      id: 'cluster-liabilities',
      label: 'Liabilities',
      count: snapshot.liabilities.length,
      tone: 'rose',
      items: snapshot.liabilities.map((item) => toRef(item, 'liability')),
    },
    {
      id: 'cluster-documents',
      label: 'Documents',
      count: snapshot.documents.length,
      tone: 'amber',
      items: snapshot.documents.map((item) => toRef(item, 'document')),
    },
  ];
}

function buildFocus(scenario: AppScenario, selection: GraphSelection): HouseholdGraphFocusView | null {
  if (selection.kind === 'none' || !selection.id) {
    return null;
  }

  if (selection.kind === 'cluster') {
    const cluster = buildClusters(scenario).find((item) => item.id === selection.id);
    if (!cluster) {
      return null;
    }

    return {
      anchor: { id: cluster.id, kind: 'goal', title: cluster.label, subtitle: `${cluster.count} connected` },
      satellites: cluster.items.slice(0, 6),
      facts: [`${cluster.count} items connected`, 'Tap an item to inspect household dependencies', 'Overflow stays clustered to keep the graph readable'],
      actions: [{ label: 'Open Household', href: '/(tabs)/household' }],
    };
  }

  const person = scenario.snapshot.people.find((item) => item.id === selection.id);
  if (!person) {
    return null;
  }

  return {
    anchor: toRef(person, 'person'),
    satellites: [
      ...scenario.snapshot.assets.filter((item) => item.ownerId === person.id).map((item) => toRef(item, 'asset')),
      ...scenario.snapshot.liabilities.filter((item) => item.ownerId === person.id).map((item) => toRef(item, 'liability')),
      ...scenario.snapshot.documents.filter((item) => item.ownerId === person.id).map((item) => toRef(item, 'document')),
    ].slice(0, 6),
    facts: person.highlights,
    actions: [
      { label: 'View profile', href: `/person/${person.id}` },
      { label: 'Continue will', href: '/will' },
    ],
  };
}

function buildOverlay(scenario: AppScenario, overlayMode: HouseholdGraphOverlayState['mode']): HouseholdGraphOverlayState {
  const toneLabel = {
    relationship: 'Household structure',
    gaps: 'What the agent sees as missing',
    estate: 'Estate and will readiness',
    documents: 'Document access and expiry',
  }[overlayMode];

  return {
    mode: overlayMode,
    headline: toneLabel,
    highlights: scenario.snapshot.risks.slice(0, 3),
  };
}

export function createMockRepositories(scenarioId: AppScenario['id']): RepositoryBundle {
  const scenario = scenarios[scenarioId];
  let draft: WillDraft = scenario.snapshot.will;

  return {
    scenario,
    household: {
      async getHouseholdSnapshot() {
        return scenario.snapshot;
      },
      async getHouseholdGraphView(selection, _filter, overlayMode) {
        return {
          clusters: buildClusters(scenario),
          focus: buildFocus(scenario, selection),
          overlay: buildOverlay(scenario, overlayMode),
        };
      },
    },
    vault: {
      async getVaultOverview(segment) {
        if (segment === 'Shared') {
          return scenario.snapshot.documents.filter((item) => item.sharedWith.length > 0);
        }
        if (segment === 'Expiring') {
          return scenario.snapshot.documents.filter((item) => item.parseStatus === 'expiring');
        }
        if (segment === 'Missing') {
          return scenario.snapshot.documents.filter((item) => item.parseStatus === 'missing');
        }
        if (segment === 'By Person') {
          return scenario.snapshot.documents.sort((a, b) => a.ownerId.localeCompare(b.ownerId));
        }
        return scenario.snapshot.documents;
      },
    },
    copilot: {
      async getInitialThread() {
        return initialThread;
      },
      async sendCopilotPrompt(prompt, context) {
        const lower = prompt.toLowerCase();
        let answer = 'Your next best action is to keep the will and document trail in sync with the household graph.';
        let why = 'The household has more structure than gaps right now, so the highest value work is around coverage and shared access.';
        let action = { label: 'Continue will', href: '/will' };
        let related: EntityRef[] = [{ id: 'will-review', kind: 'task', title: 'Continue will' }];

        if (lower.includes('loan')) {
          answer = 'Your housing loan is the most sensitive risk because it depends heavily on Ravi income and the current cover is thin.';
          why = 'The loan, protection gap, and property title packet all sit on the same dependency path.';
          action = { label: 'Review liability', href: '/liability/liability-home-loan' };
          related = [{ id: 'liability-home-loan', kind: 'liability', title: 'Housing loan' }];
        } else if (lower.includes('sarla') || lower.includes('parent')) {
          answer = 'Sarla needs both document visibility and explicit estate consideration.';
          why = 'She appears in the family structure but not cleanly in the supporting document and will layers.';
          action = { label: 'Open parent file', href: '/document/document-parent-id' };
          related = [{ id: 'person-sarla', kind: 'person', title: 'Sarla Devi' }];
        } else if (lower.includes('will')) {
          answer = 'The will is already underway, but it still misses dependent-parent coverage, guardianship, and gold allocation.';
          why = 'Those missing choices affect both estate clarity and family continuity.';
          action = { label: 'Resume will', href: '/will' };
          related = [{ id: 'document-will-draft', kind: 'document', title: 'Current will draft' }];
        }

        return {
          id: `thread-${Date.now()}`,
          role: 'assistant',
          prompt,
          blocks: [
            { id: `answer-${Date.now()}`, type: 'answer', title: 'Answer', body: answer },
            { id: `why-${Date.now()}`, type: 'why', title: 'Why the agent thinks this', body: why },
            { id: `act-${Date.now()}`, type: 'act', title: 'What to do now', body: action.label, actions: [action] },
            { id: `related-${Date.now()}`, type: 'related', title: 'Related entities', body: related.map((item) => item.title).join(' • ') },
          ],
          related,
        } satisfies CopilotThreadItem;
      },
    },
    will: {
      async getWillDraft() {
        return draft;
      },
      async saveWillStep(_step, payload) {
        draft = { ...draft, ...payload };
        return draft;
      },
    },
  };
}
