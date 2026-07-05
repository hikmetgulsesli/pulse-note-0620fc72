/**
 * ACT_RETRY_LOAD — Record Operations secondary button.
 *
 * The generated Record Operations screen declares a Retry button as the
 * empty/error state CTA. It is currently rendered in a commented-out block
 * because the runtime list never produces an empty state in this build, so
 * the button is not visible. The hook still exists so the wiring contract
 * is honoured when an error UI is added in a later story: it re-anchors the
 * load status to `ready` and clears the transient error banner state.
 */

import { useCallback } from "react";

import { usePulseNote } from "../pulse-note/pulse-note.store";

export function useActRetryLoad(): () => void {
  const { state, dispatch, resetTransientError } = usePulseNote();

  return useCallback(() => {
    dispatch({
      type: "BOOTSTRAP",
      payload: { ...state, loadStatus: "ready", lastError: null },
    });
    resetTransientError();
  }, [state, dispatch, resetTransientError]);
}
