/**
 * Pulse Note root component.
 *
 * US-001 owns the shared app shell. App.tsx is responsible for:
 *  - wiring `<PulseNoteProvider>` so screens can read shell state,
 *  - rendering the persistent shell chrome (header, navigation, status),
 *  - reaching every product surface declared in DESIGN_BRIEF (operations,
 *    editor, insights) without deleting or bypassing previously reachable
 *    surfaces,
 *  - surfacing the storage / last-error banner when the shell has something
 *    to say to the user,
 *  - keeping the existing `setfarm-app-root` test hook so older assertions
 *    remain valid.
 */

import { useCallback, useEffect, useMemo } from "react";

import { PulseNoteProvider, usePulseNote } from "./features/pulse-note/pulse-note.store";
import type { PulseNoteState, SurfaceId } from "./features/pulse-note/pulse-note.types";
import {
  InsightsPulseNote,
  RecordEditorPulseNote,
  RecordOperationsPulseNote,
} from "./screens";

function SurfaceSwitch(): JSX.Element {
  const { state } = usePulseNote();

  if (state.activeSurface === "editor") {
    return (
      <section
        data-surface="editor"
        data-testid="pulse-note-surface-editor"
        aria-label="Record editor"
      >
        <RecordEditorPulseNote />
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
        <InsightsPulseNote />
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
      <RecordOperationsPulseNote />
    </section>
  );
}

function statusLabel(status: PulseNoteState["storageStatus"]): string {
  switch (status) {
    case "available":
      return "Saved locally";
    case "missing":
      return "In-memory only";
    case "recovered":
      return "Recovered clean shell";
    case "denied":
      return "Storage denied";
    case "quota_exceeded":
      return "Storage full";
    default:
      return "Unknown";
  }
}

function ShellChrome(): JSX.Element {
  const { state, setSurface, openEditorDraft, resetTransientError } = usePulseNote();
  const { activeSurface, lastError, storageStatus } = state;

  const navItems: ReadonlyArray<{ id: SurfaceId; label: string; actionId: string; testId: string }> = useMemo(
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

  const handleDismissError = useCallback(() => {
    resetTransientError();
  }, [resetTransientError]);

  // Show a transient banner only when the error is informative (not null).
  // Errors stay dismissible so the user is never stuck.
  useEffect(() => {
    if (!lastError) return;
    if (typeof window === "undefined") return;
    const handle = window.setTimeout(() => {
      resetTransientError();
    }, 8000);
    return () => window.clearTimeout(handle);
  }, [lastError, resetTransientError]);

  return (
    <div
      className="min-h-screen flex flex-col bg-surface text-on-surface"
      data-shell-state={activeSurface}
    >
      <header
        className="flex flex-wrap items-center gap-md px-md lg:px-xl py-sm bg-surface-container-lowest border-outline-variant"
        style={{ borderBottomWidth: 1 }}
        data-testid="pulse-note-header"
      >
        <div className="flex items-center gap-sm">
          <span
            aria-hidden="true"
            className="inline-flex items-center justify-center rounded-full bg-primary text-on-primary"
            style={{ width: 28, height: 28, fontWeight: 700 }}
          >
            P
          </span>
          <h1 className="font-headline-md text-headline-md text-on-surface">
            Pulse Note
          </h1>
        </div>
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
        </nav>
        <div className="flex items-center gap-sm ml-sm">
          <button
            type="button"
            onClick={handleNewRecord}
            data-action-id="shell.new-record"
            data-testid="shell-new-record"
            className="px-md py-sm rounded font-label-md text-label-md bg-primary text-on-primary hover:opacity-90"
          >
            New Record
          </button>
        </div>
        <div
          className="ml-sm px-sm py-xs rounded font-label-sm text-label-sm text-on-surface-variant bg-surface-container-low"
          data-testid="shell-storage-status"
          data-storage-status={storageStatus}
        >
          {statusLabel(storageStatus)}
        </div>
      </header>

      {lastError ? (
        <div
          role="status"
          aria-live="polite"
          className="flex items-center gap-md px-md py-sm bg-error-container text-on-error-container"
          data-testid="pulse-note-error-banner"
          data-error-banner="true"
        >
          <span className="font-body-sm text-body-sm flex-1">{lastError}</span>
          <button
            type="button"
            onClick={handleDismissError}
            data-action-id="shell.dismiss-error"
            data-testid="shell-dismiss-error"
            className="font-label-md text-label-md underline hover:opacity-80"
          >
            Dismiss
          </button>
        </div>
      ) : null}

      <main
        className="flex-1 p-md lg:p-xl bg-surface"
        data-testid="pulse-note-main"
        data-active-surface={activeSurface}
      >
        <SurfaceSwitch />
      </main>

      <footer
        className="px-md py-sm text-on-surface-variant font-label-sm text-label-sm bg-surface-container-lowest"
        data-testid="pulse-note-footer"
      >
        <span>US-001 shell · records stored locally when available.</span>
      </footer>
    </div>
  );
}

export default function App(): JSX.Element {
  return (
    <PulseNoteProvider>
      <div
        data-setfarm-root="pulse-note"
        data-testid="setfarm-app-root"
        data-app="pulse-note"
        className="min-h-screen"
      >
        <ShellChrome />
      </div>
    </PulseNoteProvider>
  );
}
