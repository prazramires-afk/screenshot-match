export type ThemeMode = "light" | "dark" | "system";

export interface Settings {
  theme: ThemeMode;
  defaultFocusDuration: number; // minutes
  morningReminder: boolean;
  morningReminderTime: string; // "HH:MM"
  eveningReminder: boolean;
  eveningReminderTime: string;
  habitReminders: boolean;
  notificationsEnabled: boolean;
  firstUsedAt: string; // ISO
}

export type RoutineKind = "brain-dump" | "breathing" | "focus" | "observation" | "reflection" | "custom";

export interface RoutineActivity {
  id: string;
  title: string;
  minutes: number;
  kind: RoutineKind;
  enabled: boolean;
}

export interface RoutineConfig {
  activities: RoutineActivity[];
}

export interface RoutineLogEntry {
  date: string;
  activityId: string;
  status: "done" | "skipped";
}

export interface Habit {
  id: string;
  name: string;
  icon: string; // lucide icon name
  type: "daily" | "weekly";
  timesPerWeek: number; // only for weekly
  createdAt: string;
  archived?: boolean;
}

export interface HabitCompletion {
  id: string;
  habitId: string;
  date: string;
}

export type OrganizerCategory = "personal" | "work" | "relationships" | "goals" | "worries" | "ideas";

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  category: OrganizerCategory;
  createdAt: string;
  updatedAt: string;
}

export type BrainBucket = "todo" | "worry" | "remember" | "uncontrollable" | "random";

export interface BrainDumpItem {
  id: string;
  text: string;
  bucket: BrainBucket;
  category: OrganizerCategory;
  processed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GratitudeEntry {
  id: string;
  date: string;
  items: string[];
  createdAt: string;
}

export interface FocusSession {
  id: string;
  title?: string;
  mode: "pomodoro" | "deep" | "custom" | "single-task";
  minutes: number;
  startedAt: string; // ISO
  endedAt: string; // ISO
}

export interface LiveTimer {
  status: "idle" | "running" | "paused";
  mode: "pomodoro" | "deep" | "custom" | "single-task";
  phase: "focus" | "break";
  title?: string;
  durationMin: number;
  breakMin: number;
  endsAt?: number; // epoch ms while running
  remainingMs?: number; // while paused
  startedAt?: string; // ISO of the focus phase start
}

export type DistractionType = "phone" | "social" | "environment" | "thought" | "other";

export interface DistractionRecord {
  id: string;
  type: DistractionType;
  note?: string;
  at: string; // ISO
}

export interface MeditationSession {
  id: string;
  title: string;
  minutes: number;
  kind: "meditation" | "pause";
  at: string; // ISO
}

export interface BreathingSession {
  id: string;
  pattern: string;
  minutes: number;
  at: string; // ISO
}

export interface DailyCheckIn {
  id: string;
  date: string;
  mood: 1 | 2 | 3 | 4 | 5; // 5 = very good
  energy: 1 | 2 | 3 | 4 | 5; // 5 = very high
  note?: string;
}

export interface DailyPriority {
  id: string;
  date: string;
  text: string;
  done: boolean;
  createdAt: string;
}

export interface DetoxSession {
  id: string;
  challengeId: string;
  minutes: number;
  at: string; // ISO
}

export interface WeeklyReflection {
  id: string;
  weekKey: string;
  answers: [string, string, string, string];
  createdAt: string;
}

export interface CognitiveResult {
  id: string;
  exercise: string;
  difficulty: string;
  score: number; // 0-100
  detail?: string;
  at: string; // ISO
}
