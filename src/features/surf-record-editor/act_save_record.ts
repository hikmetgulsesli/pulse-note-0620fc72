/**
 * ACT_SAVE_RECORD — Record Editor form submit.
 *
 * The generated Record Editor screen renders a `<form>` containing a title
 * input, body textarea, Cancel button, and Save Record submit button. The
 * form is owned by the screen contract, so the integration layer in App.tsx
 * binds this hook to the `save-record-2` action id and additionally wires
 * a delegated `submit` listener on the editor form so that pressing Enter
 * inside the title or pressing the Save Record button both fire this hook.
 *
 * Behaviour:
 *  - Pull the latest draft from the shared store (so it reflects every
 *    keystroke that landed through the delegated `input` listeners).
 *  - Validate: a non-empty title is required; otherwise surface a field
 *    error via `reportError` and abort the commit.
 *  - Build a `PulseRecord` (new or update of the previously selected
 *    record) and an `ActivityEvent`, dispatch through `commitRecord`, and
 *    return to the operations surface.
 *  - Clear any stale transient error on success.
 */

import { useCallback } from "react";

import {
  usePulseNote,
  nextActivityId,
  nextRecordId,
} from "../pulse-note/pulse-note.store";
import type { PulseRecord } from "../pulse-note/pulse-note.types";

export function useActSaveRecord(): () => void {
  const {
    state,
    commitRecord,
    reportError,
    resetTransientError,
    setSurface,
  } = usePulseNote();

  return useCallback(() => {
    const draft = state.editorDraft;
    if (!draft) return;

    const title = draft.title.trim();
    const body = draft.body;

    if (title.length === 0) {
      reportError("Title is required to save a record.");
      return;
    }

    const now = Date.now();
    const existing = state.selectedRecordId
      ? state.records.find((record) => record.id === state.selectedRecordId)
      : undefined;

    const record: PulseRecord = existing
      ? {
          ...existing,
          title,
          body,
          updatedAt: now,
        }
      : {
          id: nextRecordId(now),
          title,
          body,
          status: "active",
          createdAt: now,
          updatedAt: now,
        };

    const activity = {
      id: nextActivityId(now),
      kind: existing ? ("update" as const) : ("create" as const),
      recordId: record.id,
      at: now,
    };

    commitRecord(record, activity);
    resetTransientError();
    setSurface("operations");
  }, [
    state.editorDraft,
    state.records,
    state.selectedRecordId,
    commitRecord,
    reportError,
    resetTransientError,
    setSurface,
  ]);
}
