import type { Settings } from "./types";

/**
 * Best-effort local notifications. The app never depends on them:
 * without permission or Capacitor support every call is a silent no-op.
 */
export function canNotify(): boolean {
  return typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted";
}

export async function requestNotifyPermission(): Promise<boolean> {
  if (typeof window === "undefined" || !("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  try {
    return (await Notification.requestPermission()) === "granted";
  } catch {
    return false;
  }
}

export function notify(title: string, body?: string) {
  if (!canNotify()) return;
  try {
    new Notification(title, { body, icon: "/favicon.ico" });
  } catch {
    /* ignore */
  }
}

export function notifyIfEnabled(settings: Settings, title: string, body?: string) {
  if (settings.notificationsEnabled) notify(title, body);
}

/** "HH:MM" for a Date in local time. */
export function hhmm(d: Date): string {
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}
