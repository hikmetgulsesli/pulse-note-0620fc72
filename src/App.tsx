/**
 * Pulse Note root component.
 *
 * US-001 owns the shared app shell. App.tsx is responsible for:
 *  - wiring `<PulseNoteProvider>` so screens can read shell state,
 *  - exposing a minimal functional surface switch (operations / editor / insights)
 *    with action-attached navigation buttons that other stories can drive,
 *  - surfacing storage / load / error / surface diagnostics through
 *    `globalThis.app.pulseNote` instead of visible app shell chrome, so the
 *    generated full-screen screens own the entire viewport on mobile and
 *    desktop without diagnostic banners pushing, covering, or overflowing
 *    their layout,
 *  - keeping the existing `setfarm-app-root` test hook so older assertions
 *    remain valid.
 *
 * US-002 owns the wiring of Record Editor and Record Operations actions.
 * `useEditorActions` and `useOperationsActions` build the typed action maps
 * consumed by the generated screens through their `actions` prop. The
 * generated screens ship with frozen DOM, so App.tsx also installs
 * delegated DOM listeners that mirror keystrokes into the shared store
 * (search input, editor title/body) without modifying the generated
 * layout.
 *
 * US-003 owns the wiring of Insights actions. `useInsightsActions` builds
 * the typed action map consumed by the Insights screen through its
 * `actions` prop. The Insights screen still renders its own DOM frozen
 * by the generated contract, so the integration layer only routes the
 * declared `data-action-id` values (filter-4, export-summary-5, …) into
 * the shared store and the diagnostic bridge — it does not modify the
 * generated layout.
 *
 * The shell deliberately does NOT render:
 *  - a visible storage-status badge,
 *  - a visible error banner,
 *  - a visible footer with debug strings,
 *  - decorative branding chrome around the generated screens.
 *
 * Smoke / debug state is exposed on `globalThis.app.pulseNote` for the
 * runtime evidence layer and for developer-tools inspection. Tests that
 * previously asserted visible chrome must read the same state through
 * `globalThis.app.pulseNote` or the public store API.
 */

import { useCallback, useEffect, useMemo } from "react";

import {
  PulseNoteProvider,
  usePulseNote,
} from "./features/pulse-note/pulse-note.store";
import type { SurfaceId } from "./features/pulse-note/pulse-note.types";
import { useActCancelEdit } from "./features/surf-record-editor/act_cancel_edit";
import { useActSaveRecord } from "./features/surf-record-editor/act_save_record";
import { useActCreateRecord } from "./features/surf-record-operations/act_create_record";
import { useActRetryLoad } from "./features/surf-record-operations/act_retry_load";
import { useActSearchRecords } from "./features/surf-record-operations/act_search_records";
import { useActSelectRecord } from "./features/surf-record-operations/act_select_record";
import { useActExportSummary } from "./features/surf-insights/act_export_summary";
import { useActFilterInsights } from "./features/surf-insights/act_filter_insights";
import {
  InsightsPulseNote,
  RecordEditorPulseNote,
  RecordOperationsPulseNote,
  type InsightsPulseNoteActionId,
  type RecordEditorPulseNoteActionId,
  type RecordOperationsPulseNoteActionId,
} from "./screens";

function useEditorActions(): Partial<Record<RecordEditorPulseNoteActionId, () => void>> {
  const cancelEdit = useActCancelEdit();
  const saveRecord = useActSaveRecord();

  return useMemo(
    () => ({
      "cancel-1": cancelEdit,
      "save-record-2": saveRecord,
    }),
    [cancelEdit, saveRecord],
  );
}

function useOperationsActions(): Partial<Record<RecordOperationsPulseNoteActionId, () => void>> {
  const createRecord = useActCreateRecord();
  const searchRecords = useActSearchRecords();
  const selectRecord = useActSelectRecord();
  const retryLoad = useActRetryLoad();
  const {
    state,
    selectRecord: storeSelect,
    setSurface,
    openEditorDraft,
    archiveRecord,
    setPanel,
    setFilterStatus,
    setFilterSort,
    reportError,
    updateEditorDraft,
  } = usePulseNote();

  // The generated Record Operations top-nav search input has no `onChange`
  // attribute (the screen contract freezes the rendered DOM). Attach a
  // delegated `input` listener that forwards every keystroke through
  // ACT_SEARCH_RECORDS so the persisted `preferences.searchQuery` follows
  // the user's typing without modifying the generated layout. The listener
  // is bound when the operations surface becomes active (and rebound when
  // the user returns to it after the editor unmounted the input).
  useEffect(() => {
    if (state.activeSurface !== "operations") return;
    if (typeof document === "undefined") return;
    const input = document.querySelector(
      'input[placeholder="Search records..."]',
    ) as HTMLInputElement | null;
    if (!input) return;
    const handler = (event: Event) => {
      const target = event.target as HTMLInputElement | null;
      if (!target) return;
      searchRecords(target.value);
    };
    input.addEventListener("input", handler);
    return () => {
      input.removeEventListener("input", handler);
    };
  }, [state.activeSurface, searchRecords]);

  // Mirror the persisted `preferences.searchQuery` from the store back into
  // the (uncontrolled) DOM input. The search input is unmounted whenever the
  // user leaves the operations surface, so we re-sync the value each time
  // the operations surface becomes active or the store's query changes.
  useEffect(() => {
    if (state.activeSurface !== "operations") return;
    if (typeof document === "undefined") return;
    const input = document.querySelector(
      'input[placeholder="Search records..."]',
    ) as HTMLInputElement | null;
    if (input && input.value !== state.preferences.searchQuery) {
      input.value = state.preferences.searchQuery;
    }
  }, [state.activeSurface, state.preferences.searchQuery]);

  // Bind the editor title/body input listeners once when the editor
  // surface becomes active. The bindings only depend on
  // `state.activeSurface` and `updateEditorDraft` so we never re-bind the
  // DOM listeners on every keystroke (avoids cursor jumping / input lag).
  useEffect(() => {
    if (state.activeSurface !== "editor") return;
    if (typeof document === "undefined") return;
    const titleInput = document.querySelector(
      'input#note-title',
    ) as HTMLInputElement | null;
    const bodyInput = document.querySelector(
      'textarea#note-content',
    ) as HTMLTextAreaElement | null;

    const titleHandler = (event: Event) => {
      const target = event.target as HTMLInputElement | null;
      if (!target) return;
      updateEditorDraft({ title: target.value, dirty: true });
    };
    const bodyHandler = (event: Event) => {
      const target = event.target as HTMLTextAreaElement | null;
      if (!target) return;
      updateEditorDraft({ body: target.value, dirty: true });
    };

    if (titleInput) titleInput.addEventListener("input", titleHandler);
    if (bodyInput) bodyInput.addEventListener("input", bodyHandler);
    return () => {
      if (titleInput) titleInput.removeEventListener("input", titleHandler);
      if (bodyInput) bodyInput.removeEventListener("input", bodyHandler);
    };
  }, [state.activeSurface, updateEditorDraft]);

  // Mirror the persisted editor draft back into the (uncontrolled) DOM
  // inputs whenever the store value changes while the editor surface is
  // active. Skipped while the input is focused so user typing is never
  // interrupted by a redundant write to the same value.
  useEffect(() => {
    if (state.activeSurface !== "editor") return;
    if (typeof document === "undefined") return;
    const titleInput = document.querySelector(
      'input#note-title',
    ) as HTMLInputElement | null;
    const bodyInput = document.querySelector(
      'textarea#note-content',
    ) as HTMLTextAreaElement | null;
    const draftTitle = state.editorDraft?.title ?? "";
    const draftBody = state.editorDraft?.body ?? "";
    if (titleInput && titleInput.value !== draftTitle) {
      titleInput.value = draftTitle;
    }
    if (bodyInput && bodyInput.value !== draftBody) {
      bodyInput.value = draftBody;
    }
  }, [
    state.activeSurface,
    state.editorDraft?.title,
    state.editorDraft?.body,
  ]);

  const archiveSelected = useCallback(() => {
    const id = state.selectedRecordId;
    if (!id) {
      reportError("Select a record before archiving.");
      return;
    }
    const now = Date.now();
    archiveRecord(id, {
      id: `act-${now.toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
      kind: "archive",
      recordId: id,
      at: now,
    });
  }, [archiveRecord, reportError, state.selectedRecordId]);

  const shareSelected = useCallback(() => {
    if (!state.selectedRecordId) {
      reportError("Select a record before sharing.");
      return;
    }
    reportError(null);
  }, [reportError, state.selectedRecordId]);

  return useMemo(
    () => ({
      "new-record-1": createRecord,
      "settings-2": () => setFilterStatus("archived"),
      "help-3": () => setFilterSort("title"),
      "edit-4": selectRecord(0),
      "edit-5": selectRecord(1),
      "edit-6": selectRecord(2),
      "retry-7": retryLoad,
      "close-8": () => {
        storeSelect(null);
        setPanel("list");
      },
      "edit-details-9": () => openEditorDraft(),
      "share-record-10": shareSelected,
      "archive-record-11": archiveSelected,
      "operations-1": () => setSurface("operations"),
      "insights-2": () => setSurface("insights"),
    }),
    [
      createRecord,
      selectRecord,
      retryLoad,
      storeSelect,
      openEditorDraft,
      setFilterStatus,
      setFilterSort,
      shareSelected,
      archiveSelected,
      setSurface,
    ],
  );
}

/**
 * US-003: typed action map for the Insights screen.
 *
 * The Insights screen ships with `data-action-id` attributes on every
 * interactive control but its `actions` prop is the only channel the
 * integration layer can use to wire behavior into the shared store.
 *
 *  - `settings-1`  /  `help-2`  — capture navigation intent into the
 *    shell diagnostics so the runtime evidence layer can observe it
 *    without forcing visible chrome.
 *  - `new-record-3` — opens a fresh editor draft and switches the
 *    active surface to the editor (ACT_CREATE).
 *  - `filter-4` — delegates to `useActFilterInsights` which cycles the
 *    persisted filter status through `all → active → archived → all`.
 *  - `export-summary-5` — delegates to `useActExportSummary` which
 *    writes the current visible records snapshot to localStorage and
 *    reports success/failure via diagnostics.
 *  - `more-vert-6`, `view-all-7`, `review-8`, `analyze-9` — secondary
 *    controls. Each clears the transient error and surfaces the
 *    diagnostic intent so the runtime evidence layer can observe it.
 *  - `operations-1` / `insights-2` — link navigation; switches the
 *    active surface to the requested screen.
 */
function useInsightsActions(): Partial<Record<InsightsPulseNoteActionId, () => void>> {
  const filterInsights = useActFilterInsights();
  const exportSummary = useActExportSummary();
  const {
    state,
    setSurface,
    openEditorDraft,
    selectRecord,
    resetTransientError,
  } = usePulseNote();

  const captureIntent = useCallback(
    (intent: string) => () => {
      if (typeof globalThis === "undefined") return;
      const root = (globalThis as unknown as {
        app?: Record<string, unknown>;
      }).app;
      const next = { ...(root ?? {}) } as Record<string, unknown>;
      const previous = (next.pulseNote ?? {}) as Record<string, unknown>;
      next.pulseNote = {
        ...previous,
        insightsIntent: intent,
        insightsIntentAt: Date.now(),
      };
      (globalThis as unknown as { app: Record<string, unknown> }).app = next;
    },
    [],
  );

  const handleNewRecord = useCallback(() => {
    selectRecord(null);
    openEditorDraft({ title: "", body: "", dirty: false });
    resetTransientError();
  }, [openEditorDraft, resetTransientError, selectRecord]);

  const handleReview = useCallback(() => {
    resetTransientError();
    captureIntent("review-pending-notes")();
  }, [captureIntent, resetTransientError]);

  const handleAnalyze = useCallback(() => {
    resetTransientError();
    captureIntent("analyze-completion-rate")();
  }, [captureIntent, resetTransientError]);

  const handleMoreVert = useCallback(() => {
    resetTransientError();
    captureIntent("chart-more-options")();
  }, [captureIntent, resetTransientError]);

  const handleViewAll = useCallback(() => {
    resetTransientError();
    captureIntent("view-all-activity")();
  }, [captureIntent, resetTransientError]);

  const handleSettings = useCallback(() => {
    resetTransientError();
    if (typeof globalThis !== "undefined") {
      const root = (globalThis as unknown as {
        app?: Record<string, unknown>;
      }).app;
      const next = { ...(root ?? {}) } as Record<string, unknown>;
      const previous = (next.pulseNote ?? {}) as Record<string, unknown>;
      next.pulseNote = {
        ...previous,
        navigationIntent: {
          href: "/settings",
          source: "insights.settings-1",
          at: Date.now(),
        },
      };
      (globalThis as unknown as { app: Record<string, unknown> }).app = next;
    }
  }, [resetTransientError]);

  const handleHelp = useCallback(() => {
    resetTransientError();
    captureIntent("help-insights")();
  }, [captureIntent, resetTransientError]);

  return useMemo(
    () => ({
      "settings-1": handleSettings,
      "help-2": handleHelp,
      "new-record-3": handleNewRecord,
      "filter-4": () => {
        filterInsights();
      },
      "export-summary-5": () => {
        exportSummary();
      },
      "more-vert-6": handleMoreVert,
      "view-all-7": handleViewAll,
      "review-8": handleReview,
      "analyze-9": handleAnalyze,
      "operations-1": () => setSurface("operations"),
      "insights-2": () => {
        // Already on insights — still clear any stale transient error so
        // the diagnostic mirror stays consistent.
        resetTransientError();
        if (state.activeSurface !== "insights") setSurface("insights");
      },
    }),
    [
      handleSettings,
      handleHelp,
      handleNewRecord,
      filterInsights,
      exportSummary,
      handleMoreVert,
      handleViewAll,
      handleReview,
      handleAnalyze,
      setSurface,
      resetTransientError,
      state.activeSurface,
    ],
  );
}

function SurfaceSwitch(): JSX.Element {
  const { state } = usePulseNote();
  const editorActions = useEditorActions();
  const operationsActions = useOperationsActions();
  const insightsActions = useInsightsActions();

  if (state.activeSurface === "editor") {
    return (
      <section
        data-surface="editor"
        data-testid="pulse-note-surface-editor"
        aria-label="Record editor"
      >
        <RecordEditorPulseNote actions={editorActions} />
      </section>
    );
  }
  if (state.activeSurface === "insights") {
    return (
      <section
        data-surface="insights"
        data-testid="pulse-note-surface-insights"
        aria-label="Insights"
      >
        <InsightsPulseNote actions={insightsActions} />
      </section>
    );
  }
  return (
    <section
      data-surface="operations"
      data-testid="pulse-note-surface-operations"
      aria-label="Record operations"
      data-default-surface="true"
    >
      <RecordOperationsPulseNote actions={operationsActions} />
    </section>
  );
}

/**
 * Functional navigation row. Only the buttons the runtime evidence layer
 * drives are rendered. There is no branding, status badge, or error banner
 * in this row — those live on `globalThis.app.pulseNote` for diagnostics.
 */
function ShellNavigation(): JSX.Element {
  const { state, setSurface, openEditorDraft } = usePulseNote();
  const { activeSurface } = state;

  const navItems: ReadonlyArray<{
    id: SurfaceId;
    label: string;
    actionId: string;
    testId: string;
  }> = useMemo(
    () => [
      {
        id: "operations",
        label: "Operations",
        actionId: "shell.nav.operations",
        testId: "shell-nav-operations",
      },
      {
        id: "insights",
        label: "Insights",
        actionId: "shell.nav.insights",
        testId: "shell-nav-insights",
      },
    ],
    [],
  );

  const handleSurface = useCallback(
    (surface: SurfaceId) => () => {
      if (surface !== "editor") {
        setSurface(surface);
      } else {
        openEditorDraft();
      }
    },
    [openEditorDraft, setSurface],
  );

  const handleNewRecord = useCallback(() => {
    openEditorDraft();
  }, [openEditorDraft]);

  return (
    <nav
      aria-label="Product surfaces"
      className="flex items-center gap-sm"
      data-testid="pulse-note-primary-nav"
    >
      {navItems.map((item) => {
        const isActive = activeSurface === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={handleSurface(item.id)}
            aria-current={isActive ? "page" : undefined}
            data-action-id={item.actionId}
            data-surface-id={item.id}
            data-testid={item.testId}
            className={
              "px-md py-sm rounded font-label-md text-label-md " +
              (isActive
                ? "bg-primary text-on-primary"
                : "text-on-surface-variant hover:text-primary hover:bg-surface-container-low")
            }
          >
            {item.label}
          </button>
        );
      })}
      <button
        type="button"
        onClick={handleNewRecord}
        data-action-id="shell.new-record"
        data-testid="shell-new-record"
        className="px-md py-sm rounded font-label-md text-label-md bg-primary text-on-primary hover:opacity-90"
      >
        New Record
      </button>
    </nav>
  );
}

/**
 * Diagnostic bridge: mirror shell smoke / debug state to `globalThis.app`
 * so runtime evidence tooling and developer-tools inspection can read
 * storage / load / error / surface state without forcing a visible banner
 * to be rendered around generated full-screen screens.
 *
 * US-003 extends the diagnostic mirror with the active Insights filter
 * status so the runtime evidence layer can observe ACT_FILTER_INSIGHTS /
 * ACT_EXPORT_SUMMARY without touching the generated screen layout.
 */
function ShellDiagnostics(): null {
  const { state } = usePulseNote();
  const {
    activeSurface,
    lastError,
    storageStatus,
    loadStatus,
    preferences,
  } = state;

  useEffect(() => {
    if (typeof globalThis === "undefined") return;
    const root = (globalThis as unknown as {
      app?: Record<string, unknown>;
    }).app;
    const next = { ...(root ?? {}) } as Record<string, unknown>;
    next.pulseNote = {
      activeSurface,
      storageStatus,
      loadStatus,
      lastError,
      insights: {
        filterStatus: preferences.filters.status,
      },
    };
    (globalThis as unknown as { app: Record<string, unknown> }).app = next;
  }, [
    activeSurface,
    lastError,
    storageStatus,
    loadStatus,
    preferences.filters.status,
  ]);

  return null;
}

export default function App(): JSX.Element {
  return (
    <PulseNoteProvider>
      <div
        data-setfarm-root="pulse-note"
        data-testid="setfarm-app-root"
        data-app="pulse-note"
        className="relative min-h-screen w-full overflow-hidden"
      >
        <ShellDiagnostics />
        <ShellNavigation />
        <SurfaceSwitch />
      </div>
    </PulseNoteProvider>
  );
}