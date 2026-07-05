/**
 * ACT_SEARCH_RECORDS — Record Operations persistent search input.
 *
 * The Record Operations top-nav search input has no `onChange` in the
 * generated JSX (layout is owned by the screen contract). The integration
 * layer in App.tsx attaches a delegated `input` listener to the rendered
 * input and forwards every keystroke through this hook so the persisted
 * `preferences.searchQuery` follows the user's typing.
 */

import { useCallback } from "react";

import { usePulseNote } from "../pulse-note/pulse-note.store";

export function useActSearchRecords(): (query: string) => void {
  const { setSearch } = usePulseNote();

  return useCallback(
    (query: string) => {
      setSearch(query);
    },
    [setSearch],
  );
}
