/**
 * ACT_FILTER_INSIGHTS — Insights screen "Filter" button (`filter-4`).
 *
 * The Insights screen renders a Filter button bound to
 * `data-action-id="filter-4"`. Clicking it cycles the persisted
 * `preferences.filters.status` through `all → active → archived → all`
 * so the user can narrow the insights scope without losing the active
 * filter when they leave the surface.
 *
 * Behaviour:
 *  - Read the current persisted filter status from the shared store.
 *  - Compute the next status in the cycle and dispatch
 *    `setFilterStatus(next)` so the value persists across surfaces.
 *  - Clear any stale transient error so a previous filter attempt does
 *    not re-surface as a banner after a successful filter change.
 *  - Return the resolved next status so callers (and runtime evidence)
 *    can observe the value without a separate read of the store.
 */

import { useCallback } from "react";

import { usePulseNote } from "../pulse-note/pulse-note.store";
import type { RecordFilterStatus } from "../pulse-note/pulse-note.types";

const FILTER_CYCLE: ReadonlyArray<RecordFilterStatus> = [
  "all",
  "active",
  "archived",
];

export function useActFilterInsights(): () => RecordFilterStatus {
  const {
    state,
    setFilterStatus,
    resetTransientError,
  } = usePulseNote();

  return useCallback(() => {
    const current = state.preferences.filters.status;
    const index = FILTER_CYCLE.indexOf(current);
    const next = FILTER_CYCLE[(index + 1) % FILTER_CYCLE.length] ?? "all";
    setFilterStatus(next);
    resetTransientError();
    return next;
  }, [
    state.preferences.filters.status,
    setFilterStatus,
    resetTransientError,
  ]);
}