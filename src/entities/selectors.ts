import type { DocumentSummary, EntityKind, EntityRef, HouseholdSnapshot } from '@/src/entities/types';

export function findEntity(snapshot: HouseholdSnapshot, entityType: EntityKind | 'person', id: string) {
  if (entityType === 'person') {
    return snapshot.people.find((item) => item.id === id) ?? null;
  }
  if (entityType === 'asset') {
    return snapshot.assets.find((item) => item.id === id) ?? null;
  }
  if (entityType === 'liability') {
    return snapshot.liabilities.find((item) => item.id === id) ?? null;
  }
  if (entityType === 'document') {
    return snapshot.documents.find((item) => item.id === id) ?? null;
  }
  if (entityType === 'task') {
    return snapshot.tasks.find((item) => item.id === id) ?? null;
  }
  return null;
}

export function documentMeta(document: DocumentSummary, snapshot: HouseholdSnapshot) {
  const owner = snapshot.people.find((item) => item.id === document.ownerId)?.name ?? 'Household member';
  const sharedCount = document.sharedWith.length;
  return `${document.category} • ${owner}${sharedCount ? ` • Shared with ${sharedCount}` : ''}`;
}

export function personRef(id: string, snapshot: HouseholdSnapshot): EntityRef | null {
  const person = snapshot.people.find((item) => item.id === id);
  return person ? { id: person.id, kind: 'person', title: person.name, subtitle: person.role } : null;
}
