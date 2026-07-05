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
 */
function ShellDiagnostics(): null {
  const { state } = usePulseNote();
  const { activeSurface, lastError, storageStatus, loadStatus } = state;

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
    };
    (globalThis as unknown as { app: Record<string, unknown> }).app = next;
  }, [activeSurface, lastError, storageStatus, loadStatus]);

  return null;
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
        <ShellDiagnostics />
        <ShellNavigation />
        <SurfaceSwitch />
      </div>
    </PulseNoteProvider>
  );
}
