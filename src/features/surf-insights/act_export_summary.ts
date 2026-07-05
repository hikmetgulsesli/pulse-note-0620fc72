/**
 * ACT_EXPORT_SUMMARY — Insights screen "Export Summary" button
 * (`export-summary-5`).
 *
 * The Insights screen renders an Export Summary button bound to
 * `data-action-id="export-summary-5"`. Clicking it generates a JSON
 * export snapshot from the currently visible records (i.e. records
 * filtered by the active `preferences.filters.status`) plus the active
 * filter metadata, and writes it to `window.localStorage` under a
 * dedicated export key.
 *
 * Behaviour:
 *  - Filter the canonical records list by the active filter status.
 *  - Build a stable JSON payload (records, filter, schema version,
 *    exported-at timestamp) with a versioned schema key.
 *  - Write to `localStorage`; on quota / denied errors, surface the
 *    failure via `reportError` and report `storageStatus` so the shell
 *    diagnostics mirror it without forcing a visible chrome change.
 *  - Reset any stale transient error on success.
 *  - Return the export outcome so callers (and runtime evidence) can
 *    observe the result without a separate read of the store.
 */

import { useCallback } from "react";

import { usePulseNote } from "../pulse-note/pulse-note.store";
import type {
  PulseRecord,
  RecordFilterStatus,
} from "../pulse-note/pulse-note.types";

export const PULSE_NOTE_EXPORT_STORAGE_KEY = "pulse-note:export-summary:v1";
export const PULSE_NOTE_EXPORT_SCHEMA_VERSION = 1;

export interface PulseNoteExportPayload {
  schemaVersion: number;
  exportedAt: number;
  filterStatus: RecordFilterStatus;
  recordCount: number;
  records: PulseRecord[];
}

export interface PulseNoteExportResult {
  ok: boolean;
  at: number;
  reason: string | null;
  recordCount: number;
}

function buildExportPayload(
  records: readonly PulseRecord[],
  filterStatus: RecordFilterStatus,
  now: number,
): PulseNoteExportPayload {
  const visibleRecords =
    filterStatus === "all"
      ? records
      : records.filter((record) => record.status === filterStatus);

  return {
    schemaVersion: PULSE_NOTE_EXPORT_SCHEMA_VERSION,
    exportedAt: now,
    filterStatus,
    recordCount: visibleRecords.length,
    records: visibleRecords.map((record) => ({ ...record })),
  };
}

function writeExport(payload: PulseNoteExportPayload): PulseNoteExportResult {
  const now = payload.exportedAt;
  if (typeof window === "undefined") {
    return {
      ok: false,
      at: now,
      reason: "window_unavailable",
      recordCount: payload.recordCount,
    };
  }

  let storage: Storage | null = null;
  try {
    storage = window.localStorage;
  } catch {
    storage = null;
  }

  if (!storage) {
    return {
      ok: false,
      at: now,
      reason: "storage_unavailable",
      recordCount: payload.recordCount,
    };
  }

  let serialized: string;
  try {
    serialized = JSON.stringify(payload);
  } catch (error) {
    return {
      ok: false,
      at: now,
      reason: `serialize_failed: ${(error as Error).message}`,
      recordCount: payload.recordCount,
    };
  }

  try {
    storage.setItem(PULSE_NOTE_EXPORT_STORAGE_KEY, serialized);
  } catch (error) {
    const reason = (error as Error)?.name ?? "storage_write_failed";
    return {
      ok: false,
      at: now,
      reason,
      recordCount: payload.recordCount,
    };
  }

  return {
    ok: true,
    at: now,
    reason: null,
    recordCount: payload.recordCount,
  };
}

export function useActExportSummary(): () => PulseNoteExportResult {
  const {
    state,
    dispatch,
    reportError,
    resetTransientError,
  } = usePulseNote();

  return useCallback((): PulseNoteExportResult => {
    const now = Date.now();
    const filterStatus = state.preferences.filters.status;
    const payload = buildExportPayload(state.records, filterStatus, now);
    const result = writeExport(payload);

    if (result.ok) {
      resetTransientError();
    } else {
      reportError(`Export failed: ${result.reason ?? "unknown"}`);
      dispatch({
        type: "REPORT_STORAGE",
        status:
          result.reason === "QuotaExceededError"
            ? "quota_exceeded"
            : "denied",
        reason: result.reason,
      });
    }

    return result;
  }, [
    state.records,
    state.preferences.filters.status,
    dispatch,
    reportError,
    resetTransientError,
  ]);
}