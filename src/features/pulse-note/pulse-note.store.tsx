/**
 * Pulse Note shared app shell store.
 *
 * US-001 owns the AppState bootstrap and the persistence boundary. The store
 * is a pure React reducer wrapped by a Context provider so that any surface
 * (operations / editor / insights) can read the canonical shell state and
 * dispatch typed actions.
 *
 * The store deliberately does NOT call into `window.localStorage` directly:
 * persistence is delegated to `pulse-note.repo.ts`. This keeps the reducer
 * pure (and therefore testable) and lets the repo surface recover from
 * corruption / quota errors without coupling the UI to those conditions.
 *
 * Three considerations drive the API shape:
 *  1. The shell must own `records`, `activities`, `preferences`, the active
 *     surface, the selected record, the active panel, item counts, the
 *     storage status, the load status, the last error, and the editor draft.
 *  2. Each dispatch must be synchronous — the reducer is pure; side effects
 *     live in `useEffect` inside the provider.
 *  3. Re-renders must be contained: `usePulseNoteState` reads state, and
 *     `usePulseNoteDispatch` exposes a stable dispatch function.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";

import {
  DEFAULT_PREFERENCES,
  INITIAL_STATE,
  isStorageAvailable,
  readPulseNoteState,
  writePulseNoteState,
} from "./pulse-note.repo";
import type {
  ActivityEvent,
  ActivityEventKind,
  EditorDraft,
  PanelId,
  PulseNoteAction,
  PulseNoteState,
  PulseRecord,
  RecordFilterStatus,
  RecordSort,
  StorageStatus,
  SurfaceId,
} from "./pulse-note.types";

export type PulseNoteDispatch = (action: PulseNoteAction) => void;

export interface PulseNoteApi {
  state: PulseNoteState;
  dispatch: PulseNoteDispatch;
  setSurface: (surface: SurfaceId) => void;
  selectRecord: (id: string | null) => void;
  openEditorDraft: (draft?: Partial<EditorDraft>) => void;
  updateEditorDraft: (patch: Partial<EditorDraft>) => void;
  discardEditorDraft: () => void;
  commitRecord: (record: PulseRecord, activity: ActivityEvent) => void;
  archiveRecord: (id: string, activity: ActivityEvent) => void;
  setPanel: (panel: PanelId) => void;
  setSearch: (query: string) => void;
  setFilterStatus: (status: RecordFilterStatus) => void;
  setFilterSort: (sort: RecordSort) => void;
  reportError: (message: string | null) => void;
  resetTransientError: () => void;
}

const PulseNoteContext = createContext<PulseNoteApi | null>(null);

function clampPreferences(
  preferences: PulseNoteState["preferences"],
): PulseNoteState["preferences"] {
  const validPanels: PanelId[] = ["list", "preview", "metrics"];
  const validStatuses: RecordFilterStatus[] = ["all", "active", "archived"];
  const validSorts: RecordSort[] = ["newest", "oldest", "title"];
  return {
    activePanel: validPanels.includes(preferences.activePanel)
      ? preferences.activePanel
      : DEFAULT_PREFERENCES.activePanel,
    searchQuery:
      typeof preferences.searchQuery === "string"
        ? preferences.searchQuery
        : DEFAULT_PREFERENCES.searchQuery,
    filters: {
      status: validStatuses.includes(preferences.filters.status)
        ? preferences.filters.status
        : DEFAULT_PREFERENCES.filters.status,
      sort: validSorts.includes(preferences.filters.sort)
        ? preferences.filters.sort
        : DEFAULT_PREFERENCES.filters.sort,
    },
  };
}

function nextRecordId(now: number): string {
  return `rec-${now.toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function nextActivityId(now: number): string {
  return `act-${now.toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function reducer(
  state: PulseNoteState,
  action: PulseNoteAction,
): PulseNoteState {
  switch (action.type) {
    case "BOOTSTRAP":
      return {
        ...action.payload,
        preferences: clampPreferences(action.payload.preferences),
      };

    case "SET_SURFACE":
      return { ...state, activeSurface: action.surface };

    case "SELECT_RECORD":
      return { ...state, selectedRecordId: action.id };

    case "OPEN_EDITOR_DRAFT":
      return {
        ...state,
        editorDraft: {
          title: action.draft?.title ?? "",
          body: action.draft?.body ?? "",
          dirty: action.draft?.dirty ?? false,
        },
        activeSurface: "editor",
      };

    case "UPDATE_EDITOR_DRAFT": {
      if (!state.editorDraft) return state;
      const nextTitle =
        action.draft.title !== undefined
          ? action.draft.title
          : state.editorDraft.title;
      const nextBody =
        action.draft.body !== undefined ? action.draft.body : state.editorDraft.body;
      const nextDirty =
        action.draft.dirty !== undefined
          ? action.draft.dirty
          : state.editorDraft.dirty || nextTitle.length > 0 || nextBody.length > 0;
      return {
        ...state,
        editorDraft: {
          title: nextTitle,
          body: nextBody,
          dirty: nextDirty,
        },
      };
    }

    case "DISCARD_EDITOR_DRAFT":
      return { ...state, editorDraft: null, activeSurface: "operations" };

    case "COMMIT_RECORD": {
      const nextRecords = state.records.some(
        (record) => record.id === action.record.id,
      )
        ? state.records.map((record) =>
            record.id === action.record.id ? action.record : record,
          )
        : [action.record, ...state.records];
      return {
        ...state,
        records: nextRecords,
        activities: [action.activity, ...state.activities],
        selectedRecordId: action.record.id,
        editorDraft: null,
        activeSurface: "operations",
        lastError: null,
      };
    }

    case "ARCHIVE_RECORD":
      return {
        ...state,
        records: state.records.map((record) =>
          record.id === action.id
            ? {
                ...record,
                status: "archived" as const,
                updatedAt: action.activity.at,
              }
            : record,
        ),
        activities: [action.activity, ...state.activities],
      };

    case "SET_PANEL":
      return {
        ...state,
        preferences: { ...state.preferences, activePanel: action.panel },
      };

    case "SET_SEARCH":
      return {
        ...state,
        preferences: { ...state.preferences, searchQuery: action.query },
      };

    case "SET_FILTER_STATUS":
      return {
        ...state,
        preferences: {
          ...state.preferences,
          filters: { ...state.preferences.filters, status: action.status },
        },
      };

    case "SET_FILTER_SORT":
      return {
        ...state,
        preferences: {
          ...state.preferences,
          filters: { ...state.preferences.filters, sort: action.sort },
        },
      };

    case "REPORT_STORAGE":
      return {
        ...state,
        storageStatus: action.status,
        lastError: action.reason ?? state.lastError,
      };

    case "REPORT_LOAD":
      return { ...state, loadStatus: action.status };

    case "REPORT_ERROR":
      return { ...state, lastError: action.message };

    default:
      return state;
  }
}

function resolveStorage(storage?: Storage | null): Storage | null {
  if (storage !== undefined) return storage;
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export interface PulseNoteProviderProps {
  children: ReactNode;
  /** Injected for tests. When omitted, defaults to `window.localStorage`. */
  storage?: Storage | null;
  /**
   * Skip the localStorage read entirely and start from this state.
   * Useful for SSR / sandboxed tests and for the initial render so the
   * shell remains usable on first paint.
   */
  fallbackState?: PulseNoteState;
}

export function PulseNoteProvider({
  children,
  storage,
  fallbackState,
}: PulseNoteProviderProps): JSX.Element {
  const [state, dispatch] = useReducer<
    React.Reducer<PulseNoteState, PulseNoteAction>
  >(reducer, fallbackState ?? INITIAL_STATE);

  // Bootstrap: read persisted state once on mount.
  useEffect(() => {
    // When `fallbackState` is provided (SSR / sandboxed tests / preview
    // shells), the caller wants the store to stay deterministic. Skip the
    // localStorage read entirely and still emit a BOOTSTRAP dispatch so
    // `loadStatus` reaches its terminal "ready" state and downstream
    // persistence effects activate when a writable storage is supplied.
    if (fallbackState) {
      dispatch({
        type: "BOOTSTRAP",
        payload: { ...fallbackState, loadStatus: "ready" },
      });
      return;
    }
    const storageInstance = resolveStorage(storage);
    const accessibility = isStorageAvailable(storageInstance);
    if (!accessibility.available) {
      const status: StorageStatus =
        accessibility.reason === "storage-missing" ? "missing" : "denied";
      dispatch({
        type: "BOOTSTRAP",
        payload: { ...INITIAL_STATE, storageStatus: status, loadStatus: "ready" },
      });
      dispatch({
        type: "REPORT_ERROR",
        message: "Local storage unavailable. Records stay in memory only.",
      });
      return;
    }
    const result = readPulseNoteState(storageInstance);
    dispatch({
      type: "BOOTSTRAP",
      payload: {
        ...result.state,
        storageStatus: result.recovered ? "recovered" : result.state.storageStatus,
        loadStatus: "ready",
      },
    });
    if (result.recovered) {
      dispatch({
        type: "REPORT_ERROR",
        message:
          "Previous saved state was unreadable. Starting from a clean shell.",
      });
    }
    // We intentionally only bootstrap once; subsequent renders rely on the
    // reducer to mutate the in-memory state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persistence: write whenever persistence-relevant shell state changes.
  useEffect(() => {
    const storageInstance = resolveStorage(storage);
    if (!storageInstance) return;
    if (state.loadStatus !== "ready") return;
    if (state.storageStatus === "missing" || state.storageStatus === "denied") {
      return;
    }
    const write = writePulseNoteState(storageInstance, state);
    if (!write.ok) {
      dispatch({
        type: "REPORT_STORAGE",
        status: write.storageStatus,
        reason: write.reason,
      });
      dispatch({
        type: "REPORT_ERROR",
        message:
          write.storageStatus === "quota_exceeded"
            ? "Local storage quota exceeded. Older records were trimmed on next save."
            : "Local storage denied. Records stay in memory only.",
      });
    }
    // Persistence depends only on persisted fields, not on transient flags
    // (lastError, loadStatus) or local-only session state (editorDraft).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    state.records,
    state.activities,
    state.preferences,
    state.selectedRecordId,
    state.storageStatus,
  ]);

  const setSurface = useCallback(
    (surface: SurfaceId) => dispatch({ type: "SET_SURFACE", surface }),
    [],
  );
  const selectRecord = useCallback(
    (id: string | null) => dispatch({ type: "SELECT_RECORD", id }),
    [],
  );
  const openEditorDraft = useCallback(
    (draft?: Partial<EditorDraft>) =>
      dispatch({ type: "OPEN_EDITOR_DRAFT", draft: draft ?? {} }),
    [],
  );
  const updateEditorDraft = useCallback(
    (draft: Partial<EditorDraft>) =>
      dispatch({ type: "UPDATE_EDITOR_DRAFT", draft }),
    [],
  );
  const discardEditorDraft = useCallback(
    () => dispatch({ type: "DISCARD_EDITOR_DRAFT" }),
    [],
  );
  const commitRecord = useCallback(
    (record: PulseRecord, activity: ActivityEvent) =>
      dispatch({ type: "COMMIT_RECORD", record, activity }),
    [],
  );
  const archiveRecord = useCallback(
    (id: string, activity: ActivityEvent) =>
      dispatch({ type: "ARCHIVE_RECORD", id, activity }),
    [],
  );
  const setPanel = useCallback(
    (panel: PanelId) => dispatch({ type: "SET_PANEL", panel }),
    [],
  );
  const setSearch = useCallback(
    (query: string) => dispatch({ type: "SET_SEARCH", query }),
    [],
  );
  const setFilterStatus = useCallback(
    (status: RecordFilterStatus) =>
      dispatch({ type: "SET_FILTER_STATUS", status }),
    [],
  );
  const setFilterSort = useCallback(
    (sort: RecordSort) => dispatch({ type: "SET_FILTER_SORT", sort }),
    [],
  );
  const reportError = useCallback(
    (message: string | null) =>
      dispatch({ type: "REPORT_ERROR", message }),
    [],
  );
  const resetTransientError = useCallback(
    () => dispatch({ type: "REPORT_ERROR", message: null }),
    [],
  );

  const api = useMemo<PulseNoteApi>(
    () => ({
      state,
      dispatch,
      setSurface,
      selectRecord,
      openEditorDraft,
      updateEditorDraft,
      discardEditorDraft,
      commitRecord,
      archiveRecord,
      setPanel,
      setSearch,
      setFilterStatus,
      setFilterSort,
      reportError,
      resetTransientError,
    }),
    [
      state,
      setSurface,
      selectRecord,
      openEditorDraft,
      updateEditorDraft,
      discardEditorDraft,
      commitRecord,
      archiveRecord,
      setPanel,
      setSearch,
      setFilterStatus,
      setFilterSort,
      reportError,
      resetTransientError,
    ],
  );

  return (
    <PulseNoteContext.Provider value={api}>
      {children}
    </PulseNoteContext.Provider>
  );
}

export function usePulseNote(): PulseNoteApi {
  const ctx = useContext(PulseNoteContext);
  if (!ctx) {
    throw new Error("usePulseNote must be used inside <PulseNoteProvider>");
  }
  return ctx;
}

export function usePulseNoteState(): PulseNoteState {
  return usePulseNote().state;
}

export function usePulseNoteDispatch(): PulseNoteDispatch {
  return usePulseNote().dispatch;
}

export { nextRecordId, nextActivityId };
export type { ActivityEventKind };
