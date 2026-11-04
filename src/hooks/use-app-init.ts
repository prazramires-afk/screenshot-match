import { useEffect } from "react";

import { settingsStore } from "@/lib/stores";
import { notifyIfEnabled } from "@/lib/notify";
import { todayKey } from "@/lib/date";

/**
 * Runs once per app session:
 * - applies the chosen theme (light / dark / system) to <html>
 * - records first-use time
 * - fires local reminders (morning / evening / habit) when supported
 */
export function useAppInit() {
  const settings = settingsStore.use();

  /* first use */
  useEffect(() => {
    if (!settingsStore.get().firstUsedAt) {
      settingsStore.set((s) => ({ ...s, firstUsedAt: new Date().toISOString() }));
    }
  }, []);

  /* theme */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const dark = settings.theme === "dark" || (settings.theme === "system" && mq.matches);
      document.documentElement.classList.toggle("dark", dark);
    };
    apply();
    if (settings.theme !== "system") return;
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [settings.theme]);

  /* reminders: check once a minute while the app is open */
  useEffect(() => {
    const LOG_KEY = "cms.reminderLog";
    const readLog = (): Record<string, Record<string, boolean>> => {
      try {
        return JSON.parse(window.localStorage.getItem(LOG_KEY) ?? "{}");
      } catch {
        return {};
      }
    };

    const check = () => {
      const s = settingsStore.get();
      if (!s.notificationsEnabled || !("Notification" in window) || Notification.permission !== "granted") return;
      const now = new Date();
      const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      const today = todayKey();
      const log = readLog();
      log[today] = log[today] ?? {};

      const fire = (kind: string, title: string, body: string) => {
        if (log[today]?.[kind]) return;
        log[today][kind] = true;
        window.localStorage.setItem(LOG_KEY, JSON.stringify(log));
        notifyIfEnabled(s, title, body);
      };

      if (s.morningReminder && time >= s.morningReminderTime) {
        fire("morning", "Good morning", "A few quiet minutes can shape the whole day.");
      }
      if (s.eveningReminder && time >= s.eveningReminderTime) {
        fire("evening", "Evening reflection", "Close the day's loops and put it down gently.");
      }
      if (s.habitReminders && time >= s.morningReminderTime) {
        fire("habits", "Habits check-in", "A small check-in keeps momentum going.");
      }
    };

    check();
    const id = window.setInterval(check, 60_000);
    return () => window.clearInterval(id);
  }, []);
}
