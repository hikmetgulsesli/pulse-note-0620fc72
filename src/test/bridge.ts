/**
 * Pulse Note test bridge.
 *
 * The bridge is the single, story-blessed place where tests poke at the app
 * shell internals. It exposes:
 *   - a fake storage adapter with the same shape as `window.localStorage`,
 *   - a `renderWithShell` helper that wraps the component under test with
 *     `<PulseNoteProvider>` and a storage override,
 *   - selectors that read the current shell state from the rendered tree.
 *
 * The bridge never reads or rewrites DOM directly — it always goes through
 * the public store API. That keeps the shell's invariants testable from the
 * outside and stops tests from re-implementing reducer logic.
 */

import { cleanup, render, type RenderOptions, type RenderResult } from "@testing-library/react";
import { afterEach } from "vitest";
import { createElement, type ReactElement, type ReactNode } from "react";

import {
  INITIAL_STATE,
} from "../features/pulse-note/pulse-note.repo";
import { PulseNoteProvider } from "../features/pulse-note/pulse-note.store";
import type {
  PulseNoteState,
} from "../features/pulse-note/pulse-note.types";

export interface FakeStorage extends Storage {
  /** Replace the underlying map (test-only). */
  __reset(next?: Record<string, string>): void;
  /** Snapshot of all keys currently stored. */
  __keys(): string[];
}

export function makeFakeStorage(initial: Record<string, string> = {}): FakeStorage {
  const store = new Map<string, string>();
  for (const [key, value] of Object.entries(initial)) {
    store.set(key, value);
  }

  const fail = (op: string) => () => {
    throw new Error(`FakeStorage.${op} denied`);
  };

  const backing: FakeStorage = {
    get length() {
      return store.size;
    },
    clear() {
      store.clear();
    },
    getItem(key: string): string | null {
      return store.has(key) ? (store.get(key) as string) : null;
    },
    key(index: number): string | null {
      return Array.from(store.keys())[index] ?? null;
    },
    removeItem(key: string): void {
      store.delete(key);
    },
    setItem(key: string, value: string): void {
      store.set(key, value);
    },
    __reset(next: Record<string, string> = {}): void {
      store.clear();
      for (const [k, v] of Object.entries(next)) store.set(k, v);
    },
    __keys(): string[] {
      return Array.from(store.keys());
    },
  };

  // Allow tests to opt into a hard-deny mode by reassigning methods.
  Object.defineProperty(backing, "deny", {
    value: (): void => {
      backing.getItem = fail("getItem") as typeof Storage.prototype.getItem;
      backing.setItem = fail("setItem") as typeof Storage.prototype.setItem;
      backing.removeItem = fail("removeItem") as typeof Storage.prototype.removeItem;
      backing.clear = fail("clear") as typeof Storage.prototype.clear;
    },
    configurable: true,
  });

  return backing;
}

export interface RenderWithShellOptions extends Omit<RenderOptions, "wrapper"> {
  /** Override the storage adapter used by the shell during the test. */
  storage?: Storage | null;
  /** Seed the shell with a deterministic initial state. */
  initialState?: Partial<PulseNoteState>;
}

export interface ShellRender extends RenderResult {
  storage: Storage | null;
}

export function renderWithShell(
  ui: ReactElement,
  options: RenderWithShellOptions = {},
): ShellRender {
  const { storage = null, initialState, ...renderOptions } = options;
  const seeded: PulseNoteState = {
    ...INITIAL_STATE,
    ...initialState,
    preferences: {
      ...INITIAL_STATE.preferences,
      ...(initialState?.preferences ?? {}),
      filters: {
        ...INITIAL_STATE.preferences.filters,
        ...(initialState?.preferences?.filters ?? {}),
      },
    },
  };

  const wrapper = ({ children }: { children: ReactNode }) =>
    createElement(
      PulseNoteProvider,
      { storage: storage ?? undefined, fallbackState: seeded, children },
    );

  const result = render(ui, { wrapper, ...renderOptions });
  return { ...result, storage };
}

afterEach(() => {
  cleanup();
});
