import { useSyncExternalStore } from "react";

/**
 * Centralized LocalStorage persistence.
 * Every key stores a versioned envelope: { v: SCHEMA_VERSION, data }.
 * Reads are lazy + guarded (SSR-safe), writes are immediate and fail-safe.
 */

export const SCHEMA_VERSION = 1;
const PREFIX = "cms.";

export function uid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export class Store<T> {
  private listeners = new Set<() => void>();
  private snapshot: T | undefined;

  constructor(
    private key: string,
    private fallback: T,
    private validate?: (v: unknown) => boolean,
  ) {}

  private load(): T {
    if (typeof window === "undefined") return this.fallback;
    try {
      const raw = window.localStorage.getItem(PREFIX + this.key);
      if (!raw) return this.fallback;
      const env = JSON.parse(raw) as { v?: number; data?: unknown };
      if (!env || env.v !== SCHEMA_VERSION) return this.fallback;
      if (this.validate && !this.validate(env.data)) return this.fallback;
      return env.data as T;
    } catch {
      return this.fallback;
    }
  }

  get = (): T => {
    if (this.snapshot === undefined) this.snapshot = this.load();
    return this.snapshot;
  };

  set = (updater: T | ((prev: T) => T)) => {
    const next = typeof updater === "function" ? (updater as (p: T) => T)(this.get()) : updater;
    this.snapshot = next;
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(PREFIX + this.key, JSON.stringify({ v: SCHEMA_VERSION, data: next }));
      } catch (e) {
        console.warn("Could not persist data", e);
      }
    }
    this.listeners.forEach((l) => l());
  };

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  /** React hook bound to this store. */
  use = (): T => useSyncExternalStore(this.subscribe, this.get, this.get);

  reset = () => this.set(this.fallback);
}

export const COLLECTION_KEYS = [
  "settings",
  "routine",
  "routineLogs",
  "habits",
  "habitCompletions",
  "journal",
  "brainDump",
  "gratitude",
  "focusSessions",
  "focusTimer",
  "distractions",
  "meditationSessions",
  "breathingSessions",
  "checkins",
  "priorities",
  "detoxSessions",
  "weeklyReflections",
  "noteBookmarks",
  "cognitiveResults",
] as const;

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Serialize every app key into a single backup string. */
export function exportAllData(): string {
  const data: Record<string, unknown> = {};
  for (const key of COLLECTION_KEYS) {
    const raw = typeof window !== "undefined" ? window.localStorage.getItem(PREFIX + key) : null;
    if (raw) {
      try {
        data[key] = JSON.parse(raw);
      } catch {
        /* skip corrupt key */
      }
    }
  }
  return JSON.stringify({ app: "clear-mental-state", schemaVersion: SCHEMA_VERSION, exportedAt: new Date().toISOString(), data }, null, 2);
}

export interface ImportResult {
  ok: boolean;
  imported: number;
  error?: string;
}

/** Restore a backup produced by exportAllData. Writes keys, caller decides whether to reload. */
export function importAllData(json: string): ImportResult {
  if (typeof window === "undefined") return { ok: false, imported: 0, error: "Not available in this environment" };
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return { ok: false, imported: 0, error: "That file is not valid JSON." };
  }
  const obj = parsed as { app?: string; schemaVersion?: number; data?: Record<string, unknown> };
  if (!obj || obj.app !== "clear-mental-state" || !isPlainObject(obj.data)) {
    return { ok: false, imported: 0, error: "This file is not a Clear Mental State backup." };
  }
  if (obj.schemaVersion !== SCHEMA_VERSION) {
    return { ok: false, imported: 0, error: "This backup was made with a different app version." };
  }
  let imported = 0;
  for (const key of COLLECTION_KEYS) {
    const value = obj.data[key];
    if (value === undefined) continue;
    const env = value as { v?: number };
    if (!isPlainObject(value) || env.v !== SCHEMA_VERSION) continue;
    try {
      window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
      imported++;
    } catch {
      /* skip */
    }
  }
  return { ok: imported > 0, imported };
}

/** Remove every app key. */
export function clearAllData(): number {
  if (typeof window === "undefined") return 0;
  let removed = 0;
  for (const key of COLLECTION_KEYS) {
    if (window.localStorage.getItem(PREFIX + key) !== null) removed++;
    window.localStorage.removeItem(PREFIX + key);
  }
  return removed;
}
