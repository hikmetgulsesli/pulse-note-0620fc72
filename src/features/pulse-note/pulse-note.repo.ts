/**
 * Pulse Note persistence adapter.
 *
 * Wraps `window.localStorage` access. US-001 owns the persistence boundary,
 * not the screens. The repo is deliberately framework-agnostic so that it is
 * testable in isolation and so future stories can swap the transport without
 * touching the store reducer.
 *
 * Recovery contract:
 *  - Missing or empty storage                -> ok=true, recovered=false
 *  - Schema version mismatch                  -> ok=true, recovered=true (ignored)
 *  - JSON parse failure                       -> ok=true, recovered=true (reset)
 *  - Unexpected shape (non-object / wrong fields) -> ok=true, recovered=true (reset)
 *  - Storage access throws (Safari private mode, quota, blocked storage)
 *                                            -> ok=false, storageStatus="denied"
 */

import {
  PULSE_NOTE_SCHEMA_VERSION,
  PULSE_NOTE_STORAGE_KEY,
  type PersistedPulseNotePayload,
  type Preferences,
  type PulseNoteState,
  type StorageStatus,
} from "./pulse-note.types";

export const DEFAULT_PREFERENCES: Preferences = {
  activePanel: "list",
  searchQuery: "",
  filters: {
    status: "all",
    sort: "newest",
  },
};

export const INITIAL_STATE: PulseNoteState = {
  records: [],
  activities: [],
  preferences: DEFAULT_PREFERENCES,
  activeSurface: "operations",
  selectedRecordId: null,
  storageStatus: "available",
  loadStatus: "idle",
  lastError: null,
  editorDraft: null,
};

export interface RepoReadResult {
  ok: boolean;
  state: PulseNoteState;
  recovered: boolean;
  reason: string | null;
}

export interface RepoWriteResult {
  ok: boolean;
  storageStatus: StorageStatus;
  reason: string | null;
}

export interface RepoAccessibility {
  available: boolean;
  reason: string | null;
}

function clonePreferences(preferences: Preferences): Preferences {
  return {
    activePanel: preferences.activePanel,
    searchQuery: preferences.searchQuery,
    filters: {
      status: preferences.filters.status,
      sort: preferences.filters.sort,
    },
  };
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(isString);
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isStorageAvailable(storage: Storage | null): RepoAccessibility {
  if (!storage) {
    return { available: false, reason: "storage-unavailable" };
  }
  try {
    const probeKey = `${PULSE_NOTE_STORAGE_KEY}:probe`;
    storage.setItem(probeKey, "1");
    storage.removeItem(probeKey);
    return { available: true, reason: null };
  } catch (error) {
    return {
      available: false,
      reason: error instanceof Error ? error.message : "storage-error",
    };
  }
}

export function readPulseNoteState(
  storage: Storage | null,
): RepoReadResult {
  const base: Pick<PulseNoteState, "preferences" | "records" | "activities" | "selectedRecordId"> = {
    records: [],
    activities: [],
    preferences: clonePreferences(DEFAULT_PREFERENCES),
    selectedRecordId: null,
  };

  if (!storage) {
    return {
      ok: false,
      state: { ...INITIAL_STATE, ...base, storageStatus: "missing" },
      recovered: false,
      reason: "storage-missing",
    };
  }

  let raw: string | null = null;
  try {
    raw = storage.getItem(PULSE_NOTE_STORAGE_KEY);
  } catch {
    return {
      ok: false,
      state: { ...INITIAL_STATE, ...base, storageStatus: "denied" },
      recovered: false,
      reason: "storage-denied",
    };
  }

  if (raw === null || raw === "") {
    return {
      ok: true,
      state: { ...INITIAL_STATE, ...base, storageStatus: "available" },
      recovered: false,
      reason: null,
    };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return {
      ok: true,
      state: { ...INITIAL_STATE, ...base, storageStatus: "recovered" },
      recovered: true,
      reason: "corrupted-json",
    };
  }

  if (!isPlainObject(parsed)) {
    return {
      ok: true,
      state: { ...INITIAL_STATE, ...base, storageStatus: "recovered" },
      recovered: true,
      reason: "payload-shape",
    };
  }

  const payload = parsed as Partial<PersistedPulseNotePayload> & {
    schemaVersion?: unknown;
  };

  if (payload.schemaVersion !== PULSE_NOTE_SCHEMA_VERSION) {
    return {
      ok: true,
      state: { ...INITIAL_STATE, ...base, storageStatus: "recovered" },
      recovered: true,
      reason: "schema-mismatch",
    };
  }

  if (!Array.isArray(payload.records) || !Array.isArray(payload.activities)) {
    return {
      ok: true,
      state: { ...INITIAL_STATE, ...base, storageStatus: "recovered" },
      recovered: true,
      reason: "payload-shape",
    };
  }

  if (!isPlainObject(payload.preferences)) {
    return {
      ok: true,
      state: { ...INITIAL_STATE, ...base, storageStatus: "recovered" },
      recovered: true,
      reason: "preferences-shape",
    };
  }

  const preferences = payload.preferences as Preferences;
  const validPanels = ["list", "preview", "metrics"] as const;
  const validStatuses = ["all", "active", "archived"] as const;
  const validSorts = ["newest", "oldest", "title"] as const;
  const safePreferences: Preferences = {
    activePanel: validPanels.includes(preferences.activePanel as typeof validPanels[number])
      ? (preferences.activePanel as Preferences["activePanel"])
      : DEFAULT_PREFERENCES.activePanel,
    searchQuery: isString(preferences.searchQuery)
      ? preferences.searchQuery
      : DEFAULT_PREFERENCES.searchQuery,
    filters: isPlainObject(preferences.filters)
      ? {
          status: validStatuses.includes(
            (preferences.filters as { status?: unknown }).status as typeof validStatuses[number],
          )
            ? ((preferences.filters as { status: Preferences["filters"]["status"] }).status)
            : DEFAULT_PREFERENCES.filters.status,
          sort: validSorts.includes(
            (preferences.filters as { sort?: unknown }).sort as typeof validSorts[number],
          )
            ? ((preferences.filters as { sort: Preferences["filters"]["sort"] }).sort)
            : DEFAULT_PREFERENCES.filters.sort,
        }
      : DEFAULT_PREFERENCES.filters,
  };

  const validRecordStatuses = ["active", "archived"] as const;
  const records = payload.records.filter(
    (entry): entry is PulseNoteState["records"][number] => {
      if (!isPlainObject(entry)) return false;
      const candidate = entry as {
        id?: unknown;
        title?: unknown;
        body?: unknown;
        status?: unknown;
        createdAt?: unknown;
        updatedAt?: unknown;
      };
      return (
        isString(candidate.id) &&
        isString(candidate.title) &&
        isString(candidate.body) &&
        isString(candidate.status) &&
        validRecordStatuses.includes(
          candidate.status as typeof validRecordStatuses[number],
        ) &&
        isFiniteNumber(candidate.createdAt) &&
        isFiniteNumber(candidate.updatedAt)
      );
    },
  );
  const activities = payload.activities.filter(
    (entry): entry is PulseNoteState["activities"][number] =>
      isPlainObject(entry) &&
      isString((entry as { id?: unknown }).id) &&
      isString((entry as { kind?: unknown }).kind) &&
      isString((entry as { recordId?: unknown }).recordId) &&
      isFiniteNumber((entry as { at?: unknown }).at),
  );
  const selectedRecordId = isString(payload.selectedRecordId)
    ? payload.selectedRecordId
    : null;

  return {
    ok: true,
    state: {
      ...INITIAL_STATE,
      records,
      activities,
      preferences: safePreferences,
      selectedRecordId,
      storageStatus: "available",
    },
    recovered: false,
    reason: null,
  };
}

export function writePulseNoteState(
  storage: Storage | null,
  state: PulseNoteState,
): RepoWriteResult {
  if (!storage) {
    return { ok: false, storageStatus: "missing", reason: "storage-missing" };
  }

  const payload: PersistedPulseNotePayload = {
    schemaVersion: PULSE_NOTE_SCHEMA_VERSION,
    records: state.records,
    activities: state.activities,
    preferences: clonePreferences(state.preferences),
    selectedRecordId: state.selectedRecordId,
  };

  try {
    storage.setItem(PULSE_NOTE_STORAGE_KEY, JSON.stringify(payload));
    return { ok: true, storageStatus: "available", reason: null };
  } catch (error) {
    const isQuota =
      error instanceof Error &&
      (error.name === "QuotaExceededError" ||
        error.name === "NS_ERROR_DOM_QUOTA_REACHED" ||
        /quota/i.test(error.message));
    return {
      ok: false,
      storageStatus: isQuota ? "quota_exceeded" : "denied",
      reason: error instanceof Error ? error.message : "storage-error",
    };
  }
}

export function buildInitialState(now: () => number): PulseNoteState {
  // `now` is parameterised so tests can freeze time.
  void now;
  return { ...INITIAL_STATE };
}
