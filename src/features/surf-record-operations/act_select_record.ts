/**
 * ACT_SELECT_RECORD — Record Operations inline edit.
 *
 * The generated operations screen renders three per-row "edit" pencil
 * buttons (`edit-4`, `edit-5`, `edit-6`) that the integration layer all
 * bind to this hook. Each click selects a record (preferring the most
 * recently added record, then the previous selection, then a stable
 * fallback so the click always resolves to a known id) and clears any
 * stale transient error.
 */

import { useCallback } from "react";

import { usePulseNote } from "../pulse-note/pulse-note.store";

export function useActSelectRecord(): (index: number) => () => void {
  const { state, selectRecord, resetTransientError } = usePulseNote();

  return useCallback(
    (index: number) => () => {
      const record = state.records[index];
      const recordId =
        record?.id ?? state.selectedRecordId ?? `row-${index}`;
      selectRecord(recordId);
      resetTransientError();
    },
    [state.records, state.selectedRecordId, selectRecord, resetTransientError],
  );
}
