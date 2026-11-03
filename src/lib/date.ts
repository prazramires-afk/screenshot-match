/** Local-date helpers. Daily records always use the device's local date. */

export function dateKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function todayKey(): string {
  return dateKey(new Date());
}

export function parseKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y ?? 1970, (m ?? 1) - 1, d ?? 1);
}

export function addDays(key: string, delta: number): string {
  const d = parseKey(key);
  d.setDate(d.getDate() + delta);
  return dateKey(d);
}

export function lastNDays(n: number, end: string = todayKey()): string[] {
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i--) out.push(addDays(end, -i));
  return out;
}

/** ISO week key like 2026-W44, computed from the local date. */
export function weekKey(d: Date = new Date()): string {
  const target = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const day = (target.getDay() + 6) % 7; // Monday = 0
  target.setDate(target.getDate() - day + 3); // move to this week's Thursday
  const firstThursday = new Date(target.getFullYear(), 0, 4);
  const firstDay = (firstThursday.getDay() + 6) % 7;
  firstThursday.setDate(firstThursday.getDate() - firstDay + 3);
  const week = 1 + Math.round((target.getTime() - firstThursday.getTime()) / (7 * 24 * 3600 * 1000));
  return `${target.getFullYear()}-W${String(week).padStart(2, "0")}`;
}

/** Monday of the week containing the given local date. */
export function weekStart(d: Date = new Date()): string {
  const target = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const day = (target.getDay() + 6) % 7;
  target.setDate(target.getDate() - day);
  return dateKey(target);
}

export function greetingFor(hour: number): string {
  if (hour < 5) return "Still awake";
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function dayOfYear(d: Date = new Date()): number {
  const start = new Date(d.getFullYear(), 0, 0);
  return Math.floor((d.getTime() - start.getTime()) / (24 * 3600 * 1000));
}

export function formatDayLabel(key: string): string {
  const d = parseKey(key);
  return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}

export function formatLongDate(d: Date = new Date()): string {
  return d.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
}
