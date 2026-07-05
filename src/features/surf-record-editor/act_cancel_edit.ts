/**
 * ACT_CANCEL_EDIT — Record Editor secondary button.
 *
 * The generated Record Editor screen renders a Cancel button bound to
 * `cancel-1`. Clicking it discards the in-progress draft, clears any
 * stale validation error, and returns the active surface to the
 * Record Operations list so the user lands back where they came from.
 */

import { useCallback } from "react";

import { usePulseNote } from "../pulse-note/pulse-note.store";

export function useActCancelEdit(): () => void {
  const { discardEditorDraft, resetTransientError, setSurface } = usePulseNote();

  return useCallback(() => {
    discardEditorDraft();
    resetTransientError();
    setSurface("operations");
  }, [discardEditorDraft, resetTransientError, setSurface]);
}
