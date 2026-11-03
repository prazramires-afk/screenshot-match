import { Store } from "./storage";
import type {
  BrainDumpItem,
  BreathingSession,
  CognitiveResult,
  DailyCheckIn,
  DailyPriority,
  DetoxSession,
  DistractionRecord,
  FocusSession,
  GratitudeEntry,
  Habit,
  HabitCompletion,
  JournalEntry,
  LiveTimer,
  MeditationSession,
  RoutineConfig,
  RoutineLogEntry,
  Settings,
  WeeklyReflection,
} from "./types";
import { DEFAULT_ROUTINE, DEFAULT_SETTINGS } from "./content";
import { todayKey } from "./date";

const isNum = (v: unknown) => typeof v === "number" && Number.isFinite(v);
const isStr = (v: unknown) => typeof v === "string";

export const settingsStore = new Store<Settings>("settings", DEFAULT_SETTINGS, (v) => {
  const s = v as Partial<Settings>;
  return isPlain(s) && ["light", "dark", "system"].includes(String(s.theme)) && isNum(s.defaultFocusDuration);
});

export const routineStore = new Store<RoutineConfig>("routine", { activities: DEFAULT_ROUTINE }, (v) => {
  const r = v as Partial<RoutineConfig>;
  return isPlain(r) && Array.isArray(r.activities);
});

export const routineLogStore = new Store<RoutineLogEntry[]>("routineLogs", [], (v) => Array.isArray(v));

export const habitsStore = new Store<Habit[]>("habits", [], (v) => Array.isArray(v));
export const habitCompletionsStore = new Store<HabitCompletion[]>("habitCompletions", [], (v) => Array.isArray(v));

export const journalStore = new Store<JournalEntry[]>("journal", [], (v) => Array.isArray(v));
export const brainDumpStore = new Store<BrainDumpItem[]>("brainDump", [], (v) => Array.isArray(v));
export const gratitudeStore = new Store<GratitudeEntry[]>("gratitude", [], (v) => Array.isArray(v));

export const focusSessionsStore = new Store<FocusSession[]>("focusSessions", [], (v) => Array.isArray(v));
export const focusTimerStore = new Store<LiveTimer>("focusTimer", {
  status: "idle",
  mode: "pomodoro",
  phase: "focus",
  durationMin: 25,
  breakMin: 5,
});

export const distractionsStore = new Store<DistractionRecord[]>("distractions", [], (v) => Array.isArray(v));

export const meditationSessionsStore = new Store<MeditationSession[]>("meditationSessions", [], (v) => Array.isArray(v));
export const breathingSessionsStore = new Store<BreathingSession[]>("breathingSessions", [], (v) => Array.isArray(v));

export const checkinStore = new Store<DailyCheckIn[]>("checkins", [], (v) => Array.isArray(v));
export const prioritiesStore = new Store<DailyPriority[]>("priorities", [], (v) => Array.isArray(v));
export const detoxSessionsStore = new Store<DetoxSession[]>("detoxSessions", [], (v) => Array.isArray(v));
export const weeklyReflectionsStore = new Store<WeeklyReflection[]>("weeklyReflections", [], (v) => Array.isArray(v));
export const noteBookmarksStore = new Store<string[]>("noteBookmarks", [], (v) => Array.isArray(v));
export const cognitiveResultsStore = new Store<CognitiveResult[]>("cognitiveResults", [], (v) => Array.isArray(v));

function isPlain(v: unknown): boolean {
  return typeof v === "object" && v !== null;
}

/* ---------- convenience selectors ---------- */

export function getCheckinFor(checkins: DailyCheckIn[], date = todayKey()): DailyCheckIn | undefined {
  return checkins.find((c) => c.date === date);
}

export function getPrioritiesFor(all: DailyPriority[], date = todayKey()): DailyPriority[] {
  return all
    .filter((p) => p.date === date)
    .sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1));
}

export function getRoutineLogFor(logs: RoutineLogEntry[], date = todayKey()): RoutineLogEntry[] {
  return logs.filter((l) => l.date === date);
}

export function isHabitDone(completions: HabitCompletion[], habitId: string, date = todayKey()): boolean {
  return completions.some((c) => c.habitId === habitId && c.date === date);
}

/** Consecutive-day streak ending today or yesterday (0 counts as none). */
export function habitStreak(completions: HabitCompletion[], habitId: string, today = todayKey()): number {
  const dates = new Set(completions.filter((c) => c.habitId === habitId).map((c) => c.date));
  let streak = 0;
  const cursor = new Date(today + "T00:00:00");
  if (!dates.has(today)) cursor.setDate(cursor.getDate() - 1); // grace: today not done yet
  while (dates.has(cursor.toISOString().slice(0, 10))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
