import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Ring } from "@/components/charts";
import { focusSessionsStore, focusTimerStore, settingsStore } from "@/lib/stores";
import { notifyIfEnabled } from "@/lib/notify";
import { uid } from "@/lib/storage";
import type { LiveTimer } from "@/lib/types";
import { cn } from "@/lib/utils";

type Mode = LiveTimer["mode"];

const MODES: { id: Mode; label: string; focus: number; brk: number }[] = [
  { id: "pomodoro", label: "Pomodoro", focus: 25, brk: 5 },
  { id: "deep", label: "Deep Work", focus: 50, brk: 10 },
  { id: "single-task", label: "Single Task", focus: 25, brk: 0 },
  { id: "custom", label: "Custom", focus: 25, brk: 0 },
];

/** Persistent focus timer. Remaining time is derived from endsAt (epoch ms),
 * so backgrounding, reloading, or closing the app never loses the countdown. */
export function FocusTimer({ compact = false }: { compact?: boolean }) {
  const timer = focusTimerStore.use();
  const settings = settingsStore.use();
  const [, force] = useState(0);
  const notifyDone = useRef(false);

  useEffect(() => {
    const id = window.setInterval(() => force((n) => n + 1), 500);
    return () => window.clearInterval(id);
  }, []);

  /* phase completion: runs on every render while running */
  useEffect(() => {
    if (timer.status !== "running" || !timer.endsAt) return;
    if (Date.now() < timer.endsAt) return;
    if (notifyDone.current) return;
    notifyDone.current = true;

    const nowIso = new Date().toISOString();
    if (timer.phase === "focus") {
      focusSessionsStore.set((all) => [
        ...all,
        {
          id: uid(),
          title: timer.title,
          mode: timer.mode,
          minutes: timer.durationMin,
          startedAt: timer.startedAt ?? nowIso,
          endedAt: nowIso,
        },
      ]);
      notifyIfEnabled(settings, "Focus session complete", "Well done. Time for a short break.");
      if (timer.breakMin > 0) {
        focusTimerStore.set((t) => ({ ...t, phase: "break", durationMin: t.breakMin, endsAt: Date.now() + t.breakMin * 60_000, remainingMs: undefined }));
      } else {
        focusTimerStore.set((t) => ({ ...t, status: "idle", phase: "focus", endsAt: undefined, remainingMs: undefined }));
      }
    } else {
      notifyIfEnabled(settings, "Break over", "Ready for another focused session?");
      focusTimerStore.set((t) => ({ ...t, status: "idle", phase: "focus", endsAt: undefined, remainingMs: undefined }));
    }
  }, [timer, settings]);

  useEffect(() => {
    if (timer.status !== "running") notifyDone.current = false;
  }, [timer.status]);

  const totalMs = timer.durationMin * 60_000;
  const remaining = timer.status === "running" && timer.endsAt ? Math.max(timer.endsAt - Date.now(), 0) : timer.status === "paused" ? (timer.remainingMs ?? totalMs) : totalMs;
  const minutes = Math.floor(remaining / 60_000);
  const seconds = Math.floor((remaining % 60_000) / 1000);
  const pct = totalMs > 0 ? remaining / totalMs : 0;
  const activeMode = MODES.find((m) => m.id === timer.mode) ?? MODES[0]!;

  const setMode = (mode: Mode) => {
    const m = MODES.find((x) => x.id === mode)!;
    const focus = mode === "custom" ? timer.durationMin || settings.defaultFocusDuration : m.focus;
    focusTimerStore.set((t) => ({ ...t, mode, status: "idle", phase: "focus", durationMin: focus, breakMin: m.brk, endsAt: undefined, remainingMs: undefined, title: mode === "single-task" ? t.title : undefined }));
  };

  const start = () => {
    focusTimerStore.set((t) => ({ ...t, status: "running", endsAt: Date.now() + (t.remainingMs ?? t.durationMin * 60_000), startedAt: t.phase === "focus" ? new Date().toISOString() : t.startedAt, remainingMs: undefined }));
  };
  const pause = () => {
    focusTimerStore.set((t) => ({ ...t, status: "paused", remainingMs: Math.max((t.endsAt ?? 0) - Date.now(), 0), endsAt: undefined }));
  };
  const reset = () => {
    focusTimerStore.set((t) => ({ ...t, status: "idle", phase: "focus", durationMin: t.mode === "custom" ? t.durationMin : activeMode.focus, endsAt: undefined, remainingMs: undefined, startedAt: undefined }));
  };

  return (
    <section className="rounded-2xl border bg-card p-4 shadow-sm">
      <div className={cn("flex gap-1.5", compact && "flex-wrap")}>
        {MODES.map((m) => (
          <button
            key={m.id}
            disabled={timer.status !== "idle"}
            onClick={() => setMode(m.id)}
            className={cn(
              "tap flex-1 rounded-full border px-2 py-1.5 text-[11px] font-medium transition-colors disabled:opacity-60",
              timer.mode === m.id ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground",
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="mt-5 flex flex-col items-center">
        <Ring value={pct} max={1} size={compact ? 150 : 190} stroke={8} label={`${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`} />
        <p className="mt-3 text-sm text-muted-foreground">
          {timer.status === "idle" && timer.phase === "focus" && `${activeMode.label} · ${timer.durationMin} min focus${timer.breakMin ? ` + ${timer.breakMin} min break` : ""}`}
          {timer.status === "idle" && timer.phase === "break" && `Break · ${timer.durationMin} min`}
          {timer.status === "running" && (timer.phase === "focus" ? "Focusing — stay with one thing" : "Break — rest your eyes and stretch")}
          {timer.status === "paused" && "Paused"}
        </p>
        {timer.mode === "single-task" || timer.mode === "custom" ? (
          <Input
            value={timer.title ?? ""}
            disabled={timer.status !== "idle"}
            onChange={(e) => focusTimerStore.set((t) => ({ ...t, title: e.target.value.slice(0, 80) }))}
            placeholder={timer.mode === "single-task" ? "What is the one task?" : "Session title (optional)"}
            className="mt-3 h-9 text-center text-sm"
          />
        ) : null}
      </div>

      <div className="mt-5 flex items-center justify-center gap-3">
        {timer.status === "running" ? (
          <Button size="lg" className="tap min-w-32 rounded-full" onClick={pause}>
            <Pause className="h-4 w-4" /> Pause
          </Button>
        ) : (
          <Button size="lg" className="tap min-w-32 rounded-full" onClick={start}>
            <Play className="h-4 w-4" /> {timer.status === "paused" ? "Resume" : timer.phase === "break" ? "Start break" : "Start"}
          </Button>
        )}
        <Button variant="outline" size="icon" className="tap rounded-full" onClick={reset} aria-label="Reset timer" disabled={timer.status === "idle"}>
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {timer.mode === "custom" && timer.status === "idle" ? (
        <div className="mt-4 flex items-center justify-center gap-3 text-sm text-muted-foreground">
          <Button
            variant="ghost"
            size="sm"
            className="tap rounded-full"
            onClick={() => focusTimerStore.set((t) => ({ ...t, durationMin: Math.max(5, t.durationMin - 5) }))}
          >
            −5
          </Button>
          <span className="w-20 text-center font-medium text-foreground">{timer.durationMin} min</span>
          <Button
            variant="ghost"
            size="sm"
            className="tap rounded-full"
            onClick={() => focusTimerStore.set((t) => ({ ...t, durationMin: Math.min(180, t.durationMin + 5) }))}
          >
            +5
          </Button>
        </div>
      ) : null}
    </section>
  );
}
