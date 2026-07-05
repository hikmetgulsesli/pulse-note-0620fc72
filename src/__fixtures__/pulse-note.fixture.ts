/**
 * Pulse Note fixture data.
 *
 * These fixtures are referenced by future tests and by the test bridge.
 * They are exported as plain constants so any story can reuse them without
 * a runtime cost. Numbers are deterministic (frozen timestamps) so that
 * snapshot-style tests stay reproducible.
 */

import { DEFAULT_PREFERENCES } from "../features/pulse-note/pulse-note.repo";
import type {
  ActivityEvent,
  Preferences,
  PulseNoteState,
  PulseRecord,
} from "../features/pulse-note/pulse-note.types";

export const FIXTURE_TIMESTAMP = 1_716_800_000_000; // 2024-05-27T12:53:20.000Z

export const fixtureRecords: PulseRecord[] = [
  {
    id: "rec-morning-standup",
    title: "Morning standup talking points",
    body:
      "Sync with the on-call rotation. Confirm the export summary job completed and surface the retry queue size.",
    status: "active",
    createdAt: FIXTURE_TIMESTAMP - 1000 * 60 * 60 * 26,
    updatedAt: FIXTURE_TIMESTAMP - 1000 * 60 * 60 * 2,
  },
  {
    id: "rec-incident-2024-05-26",
    title: "Incident: insights export failed",
    body:
      "Export summary job exited with a 502 from the analytics worker. Records unaffected. Awaiting worker health check.",
    status: "active",
    createdAt: FIXTURE_TIMESTAMP - 1000 * 60 * 60 * 12,
    updatedAt: FIXTURE_TIMESTAMP - 1000 * 60 * 30,
  },
  {
    id: "rec-shared-with-design",
    title: "Notes shared with design",
    body:
      "Drafted three prompts for the design review session. Shared with the design pod via the archive link.",
    status: "active",
    createdAt: FIXTURE_TIMESTAMP - 1000 * 60 * 60 * 96,
    updatedAt: FIXTURE_TIMESTAMP - 1000 * 60 * 60 * 30,
  },
  {
    id: "rec-archived-onboarding",
    title: "Archived onboarding draft",
    body: "Earlier exploration of the onboarding flow. Superseded by the new record layout.",
    status: "archived",
    createdAt: FIXTURE_TIMESTAMP - 1000 * 60 * 60 * 24 * 30,
    updatedAt: FIXTURE_TIMESTAMP - 1000 * 60 * 60 * 24 * 14,
  },
];

export const fixtureActivities: ActivityEvent[] = [
  {
    id: "act-1",
    kind: "create",
    recordId: "rec-morning-standup",
    at: FIXTURE_TIMESTAMP - 1000 * 60 * 60 * 26,
  },
  {
    id: "act-2",
    kind: "update",
    recordId: "rec-incident-2024-05-26",
    at: FIXTURE_TIMESTAMP - 1000 * 60 * 30,
  },
  {
    id: "act-3",
    kind: "share",
    recordId: "rec-shared-with-design",
    at: FIXTURE_TIMESTAMP - 1000 * 60 * 60 * 28,
  },
  {
    id: "act-4",
    kind: "archive",
    recordId: "rec-archived-onboarding",
    at: FIXTURE_TIMESTAMP - 1000 * 60 * 60 * 24 * 14,
  },
];

export const fixturePreferences: Preferences = {
  ...DEFAULT_PREFERENCES,
  searchQuery: "standup",
  filters: {
    status: "all",
    sort: "newest",
  },
};

export const fixtureState: PulseNoteState = {
  records: fixtureRecords,
  activities: fixtureActivities,
  preferences: fixturePreferences,
  activeSurface: "operations",
  selectedRecordId: "rec-incident-2024-05-26",
  storageStatus: "available",
  loadStatus: "ready",
  lastError: null,
  editorDraft: {
    title: "",
    body: "",
    dirty: false,
  },
};

export function makeFixtureState(
  overrides: Partial<PulseNoteState> = {},
): PulseNoteState {
  return {
    ...fixtureState,
    records: [...fixtureState.records],
    activities: [...fixtureState.activities],
    preferences: {
      ...fixtureState.preferences,
      ...(overrides.preferences ?? {}),
      filters: {
        ...fixtureState.preferences.filters,
        ...(overrides.preferences?.filters ?? {}),
      },
    },
    ...overrides,
  };
}
