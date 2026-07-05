/**
 * ACT_CREATE_RECORD — Record Operations primary button.
 *
 * The Record Operations screen renders a "New Record" CTA that drives the
 * user into the Record Editor. The integration layer in App.tsx binds this
 * hook to the `new-record-1` action id, so a click on the CTA opens a fresh
 * editor draft and clears any stale validation error from a previous save.
 */

import { useCallback } from "react";

import { usePulseNote } from "../pulse-note/pulse-note.store";

export function useActCreateRecord(): () => void {
  const { openEditorDraft, resetTransientError } = usePulseNote();

  return useCallback(() => {
    openEditorDraft({ title: "", body: "", dirty: false });
    resetTransientError();
  }, [openEditorDraft, resetTransientError]);
}
