import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Check, CircleSlash, Pencil, Plus, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Ring } from "@/components/charts";
import { routineLogStore, routineStore } from "@/lib/stores";
import { todayKey } from "@/lib/date";
import { uid } from "@/lib/storage";
import type { RoutineActivity, RoutineKind } from "@/lib/types";
import { cn } from "@/lib/utils";

const KIND_LABEL: Record<RoutineKind, string> = {
  "brain-dump": "Declutter",
  breathing: "Breathe",
  focus: "Focus",
  observation: "Observe",
  reflection: "Reflect",
  custom: "Custom",
};

const KIND_LINK: Partial<Record<RoutineKind, string>> = {
  "brain-dump": "/mind/brain-dump",
  breathing: "/calm/breathing",
  focus: "/focus",
  reflection: "/mind/guided",
};

export function RoutineCard() {
  const routine = routineStore.use();
  const logs = routineLogStore.use();
  const today = todayKey();
  const todaysLog = useMemo(() => logs.filter((l) => l.date === today), [logs, today]);
  const enabled = routine.activities.filter((a) => a.enabled);
  const doneCount = enabled.filter((a) => todaysLog.some((l) => l.activityId === a.id && l.status === "done")).length;
  const [editorOpen, setEditorOpen] = useState(false);

  return (
    <section className="rounded-2xl border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-semibold">Daily routine</h2>
          <p className="text-xs text-muted-foreground">
            {doneCount} of {enabled.length} complete · {enabled.reduce((s, a) => s + a.minutes, 0)} min total
          </p>
        </div>
        <Ring value={doneCount} max={Math.max(enabled.length, 1)} size={52} />
      </div>

      <ul className="mt-4 space-y-2">
        {enabled.map((a) => {
          const entry = todaysLog.find((l) => l.activityId === a.id);
          const link = KIND_LINK[a.kind];
          return (
            <li
              key={a.id}
              className={cn(
                "flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors",
                entry?.status === "done" && "border-primary/30 bg-primary/5",
                entry?.status === "skipped" && "opacity-60",
              )}
            >
              <button
                className={cn(
                  "tap flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors",
                  entry?.status === "done" ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background",
                )}
                onClick={() => toggleActivity(a.id, entry?.status)}
                aria-label={entry?.status === "done" ? "Mark not done" : "Mark done"}
              >
                {entry?.status === "done" ? <Check className="h-4 w-4" /> : <span className="text-[10px] text-muted-foreground">{a.minutes}′</span>}
              </button>
              <div className="min-w-0 flex-1">
                <p className={cn("truncate text-sm font-medium", entry?.status === "skipped" && "line-through")}>{a.title}</p>
                <p className="text-[11px] text-muted-foreground">
                  {KIND_LABEL[a.kind]} · {a.minutes} min
                  {entry?.status === "skipped" ? " · skipped" : ""}
                </p>
              </div>
              {link ? (
                <Link to={link}>
                  <Button variant="ghost" size="sm" className="tap h-8 rounded-full px-3 text-xs text-primary">
                    Open
                  </Button>
                </Link>
              ) : null}
              {entry?.status !== "done" ? (
                <button
                  className="tap text-muted-foreground hover:text-foreground"
                  onClick={() => setActivityStatus(a.id, entry?.status === "skipped" ? undefined : "skipped")}
                  aria-label="Skip"
                >
                  <CircleSlash className="h-4 w-4" />
                </button>
              ) : null}
            </li>
          );
        })}
        {enabled.length === 0 ? <li className="py-2 text-center text-sm text-muted-foreground">No activities enabled yet — add some below.</li> : null}
      </ul>

      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="tap mt-3 w-full rounded-xl">
            <Pencil className="h-3.5 w-3.5" /> Customize routine
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Customize your routine</DialogTitle>
          </DialogHeader>
          <RoutineEditor />
        </DialogContent>
      </Dialog>
    </section>
  );
}

/** Prevents duplicate log entries: one record per (date, activity). */
function toggleActivity(activityId: string, current?: "done" | "skipped") {
  routineLogStore.set((logs) => {
    const date = todayKey();
    const others = logs.filter((l) => !(l.date === date && l.activityId === activityId));
    if (current === "done") return others;
    return [...others, { date, activityId, status: "done" }];
  });
}

function setActivityStatus(activityId: string, status?: "done" | "skipped") {
  routineLogStore.set((logs) => {
    const date = todayKey();
    const others = logs.filter((l) => !(l.date === date && l.activityId === activityId));
    if (!status) return others;
    return [...others, { date, activityId, status }];
  });
}

function RoutineEditor() {
  const routine = routineStore.use();

  const update = (id: string, patch: Partial<RoutineActivity>) => {
    routineStore.set((r) => ({ activities: r.activities.map((a) => (a.id === id ? { ...a, ...patch } : a)) }));
  };
  const remove = (id: string) => {
    routineStore.set((r) => ({ activities: r.activities.filter((a) => a.id !== id) }));
  };
  const move = (id: string, dir: -1 | 1) => {
    routineStore.set((r) => {
      const idx = r.activities.findIndex((a) => a.id === id);
      const target = idx + dir;
      if (idx < 0 || target < 0 || target >= r.activities.length) return r;
      const activities = [...r.activities];
      [activities[idx], activities[target]] = [activities[target]!, activities[idx]!];
      return { activities };
    });
  };
  const add = () => {
    const activity: RoutineActivity = { id: uid(), title: "", minutes: 5, kind: "custom", enabled: true };
    routineStore.set((r) => ({ activities: [...r.activities, activity] }));
  };

  return (
    <div className="space-y-3">
      {routine.activities.map((a, i) => (
        <div key={a.id} className="rounded-xl border p-3">
          <div className="flex items-center gap-2">
            <Input
              value={a.title}
              placeholder="Activity name"
              className="h-9 flex-1 text-sm"
              onChange={(e) => update(a.id, { title: e.target.value.slice(0, 60) })}
            />
            <div className="flex flex-col">
              <button className="tap text-muted-foreground hover:text-foreground" onClick={() => move(a.id, -1)} disabled={i === 0} aria-label="Move up">
                <ArrowUp className="h-3.5 w-3.5" />
              </button>
              <button
                className="tap text-muted-foreground hover:text-foreground"
                onClick={() => move(a.id, 1)}
                disabled={i === routine.activities.length - 1}
                aria-label="Move down"
              >
                <ArrowDown className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <label className="flex items-center gap-1.5">
              Minutes
              <Input
                type="number"
                min={1}
                max={120}
                value={a.minutes}
                className="h-8 w-16 text-sm"
                onChange={(e) => update(a.id, { minutes: Math.max(1, Math.min(120, Number(e.target.value) || 1)) })}
              />
            </label>
            <div className="ml-auto flex items-center gap-2">
              <Switch checked={a.enabled} onCheckedChange={(v) => update(a.id, { enabled: v })} aria-label="Enabled" />
              <button className="tap text-destructive" onClick={() => remove(a.id)} aria-label="Delete activity">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
      <Button variant="outline" className="tap w-full rounded-xl" onClick={add}>
        <Plus className="h-4 w-4" /> Add activity
      </Button>
      <p className="flex items-start gap-2 text-xs text-muted-foreground">
        <X className="mt-0.5 h-3.5 w-3.5 shrink-0" /> Skipping is always okay. The routine is here to support you, not to score you.
      </p>
    </div>
  );
}
