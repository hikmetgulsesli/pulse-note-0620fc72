/**
 * Pulse Note shared app shell types.
 *
 * US-001 owns the shared app shell. The state shape below is the
 * authoritative contract for every cross-cutting concern the shell must own:
 *  - the active product surface (operations / editor / insights),
 *  - the currently selected record,
 *  - persistence / storage / load status,
 *  - the last reported error (UI banner source),
 *  - the active side panel and item counts derived from the records list,
 *  - the structured editor draft that survives a Cancel/Save round-trip.
 *
 * Persistence is conditional: it only runs when PRD or DESIGN_DOM requires
 * persistence. Pulse Note requires local persistence (records, activities,
 * preferences), so this surface owns it.
 */

export type SurfaceId = "operations" | "editor" | "insights";

export type PanelId = "list" | "preview" | "metrics";

export type RecordStatus = "active" | "archived";

export type RecordFilterStatus = RecordStatus | "all";

export type RecordSort = "newest" | "oldest" | "title";

export type LoadStatus = "idle" | "loading" | "ready" | "error";

export type StorageStatus =
  | "available"
  | "missing"
  | "recovered"
  | "denied"
  | "quota_exceeded";

export interface PulseRecord {
  id: string;
  title: string;
  body: string;
  status: RecordStatus;
  createdAt: number;
  updatedAt: number;
}

export type ActivityEventKind =
  | "create"
  | "update"
  | "archive"
  | "share"
  | "view";

export interface ActivityEvent {
  id: string;
  kind: ActivityEventKind;
  recordId: string;
  at: number;
}

export interface PreferenceFilters {
  status: RecordFilterStatus;
  sort: RecordSort;
}

export interface Preferences {
  activePanel: PanelId;
  searchQuery: string;
  filters: PreferenceFilters;
}

export interface ValidationError {
  field: "title" | "body";
  message: string;
}

export interface EditorDraft {
  title: string;
  body: string;
  dirty: boolean;
}

export interface PulseNoteState {
  records: PulseRecord[];
  activities: ActivityEvent[];
  preferences: Preferences;
  activeSurface: SurfaceId;
  selectedRecordId: string | null;
  storageStatus: StorageStatus;
  loadStatus: LoadStatus;
  lastError: string | null;
  editorDraft: EditorDraft | null;
}

export interface PersistedPulseNotePayload {
  schemaVersion: number;
  records: PulseRecord[];
  activities: ActivityEvent[];
  preferences: Preferences;
  selectedRecordId: string | null;
}

export interface ItemCounts {
  total: number;
  active: number;
  archived: number;
}

export type PulseNoteAction =
  | { type: "BOOTSTRAP"; payload: PulseNoteState }
  | { type: "SET_SURFACE"; surface: SurfaceId }
  | { type: "SELECT_RECORD"; id: string | null }
  | { type: "OPEN_EDITOR_DRAFT"; draft: Partial<EditorDraft> }
  | { type: "UPDATE_EDITOR_DRAFT"; draft: Partial<EditorDraft> }
  | { type: "DISCARD_EDITOR_DRAFT" }
  | {
      type: "COMMIT_RECORD";
      record: PulseRecord;
      activity: ActivityEvent;
    }
  | {
      type: "ARCHIVE_RECORD";
      id: string;
      activity: ActivityEvent;
    }
  | { type: "SET_PANEL"; panel: PanelId }
  | { type: "SET_SEARCH"; query: string }
  | { type: "SET_FILTER_STATUS"; status: RecordFilterStatus }
  | { type: "SET_FILTER_SORT"; sort: RecordSort }
  | { type: "REPORT_STORAGE"; status: StorageStatus; reason?: string | null }
  | { type: "REPORT_LOAD"; status: LoadStatus }
  | { type: "REPORT_ERROR"; message: string | null };

export const PULSE_NOTE_STORAGE_KEY = "pulse-note:v1";
export const PULSE_NOTE_SCHEMA_VERSION = 1;

export const SURFACE_IDS: readonly SurfaceId[] = [
  "operations",
  "editor",
  "insights",
] as const;

export function countRecords(records: readonly PulseRecord[]): ItemCounts {
  let active = 0;
  let archived = 0;
  for (const record of records) {
    if (record.status === "active") active += 1;
    else if (record.status === "archived") archived += 1;
  }
  return { total: records.length, active, archived };
}
