import { useState } from "react";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { checkinStore, getCheckinFor, prioritiesStore, getPrioritiesFor } from "@/lib/stores";
import { todayKey } from "@/lib/date";
import { uid } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";

/* ---------------- mood & energy check-in ---------------- */

const MOODS: { value: 1 | 2 | 3 | 4 | 5; label: string }[] = [
  { value: 1, label: "Very low" },
  { value: 2, label: "Low" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Good" },
  { value: 5, label: "Very good" },
];

const ENERGY: { value: 1 | 2 | 3 | 4 | 5; label: string }[] = [
  { value: 1, label: "Very low" },
  { value: 2, label: "Low" },
  { value: 3, label: "Moderate" },
  { value: 4, label: "High" },
  { value: 5, label: "Very high" },
];

export function CheckinCard() {
  const checkins = checkinStore.use();
  const existing = getCheckinFor(checkins);
  const [mood, setMood] = useState<1 | 2 | 3 | 4 | 5 | null>(existing?.mood ?? null);
  const [energy, setEnergy] = useState<1 | 2 | 3 | 4 | 5 | null>(existing?.energy ?? null);
  const [note, setNote] = useState(existing?.note ?? "");
  const [saved, setSaved] = useState(false);

  const save = () => {
    if (!mood || !energy) return;
    const trimmed = note.trim();
    checkinStore.set((all) => {
      const date = todayKey();
      const others = all.filter((c) => c.date !== date);
      const record: DailyCheckIn = { id: existing?.id ?? uid(), date, mood, energy };
      if (trimmed) record.note = trimmed;
      return [...others, record];
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  return (
    <section className="rounded-2xl border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">How are you?</h2>
        <Link to="/insights" className="text-xs text-primary underline-offset-2 hover:underline">
          History
        </Link>
      </div>

      <p className="mt-3 text-xs font-medium text-muted-foreground">Mood</p>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {MOODS.map((m) => (
          <button
            key={m.value}
            onClick={() => setMood(m.value)}
            className={cn(
              "tap rounded-full border px-3 py-1.5 text-xs transition-colors",
              mood === m.value ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-muted-foreground",
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      <p className="mt-3 text-xs font-medium text-muted-foreground">Energy</p>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {ENERGY.map((m) => (
          <button
            key={m.value}
            onClick={() => setEnergy(m.value)}
            className={cn(
              "tap rounded-full border px-3 py-1.5 text-xs transition-colors",
              energy === m.value ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-muted-foreground",
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      <Input
        value={note}
        onChange={(e) => setNote(e.target.value.slice(0, 200))}
        placeholder="Optional note about today…"
        className="mt-3 h-9 text-sm"
      />

      <Button className="tap mt-3 w-full rounded-xl" disabled={!mood || !energy} onClick={save}>
        {saved ? (
          <>
            <Check className="h-4 w-4" /> Saved
          </>
        ) : existing ? (
          "Update check-in"
        ) : (
          "Save check-in"
        )}
      </Button>
    </section>
  );
}

/* ---------------- three daily priorities ---------------- */

export function PrioritiesCard({ expanded = false }: { expanded?: boolean }) {
  const priorities = prioritiesStore.use();
  const todays = getPrioritiesFor(priorities);
  const [text, setText] = useState("");

  const add = () => {
    const value = text.trim();
    if (!value || todays.length >= 3) return;
    prioritiesStore.set((all) => [...all, { id: uid(), date: todayKey(), text: value, done: false, createdAt: new Date().toISOString() }]);
    setText("");
  };

  const move = (id: string, dir: -1 | 1) => {
    prioritiesStore.set((all) => {
      const date = todayKey();
      const todays = getPrioritiesFor(all).filter((p) => p.date === date);
      const idx = todays.findIndex((p) => p.id === id);
      const target = idx + dir;
      if (idx < 0 || target < 0 || target >= todays.length) return all;
      const a = todays[idx]!;
      const b = todays[target]!;
      return all.map((p) => (p.id === a.id ? { ...p, createdAt: b.createdAt } : p.id === b.id ? { ...p, createdAt: a.createdAt } : p));
    });
  };

  return (
    <section className="rounded-2xl border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">Three priorities</h2>
        <span className="text-xs text-muted-foreground">{todays.filter((p) => p.done).length}/{todays.length || 0} done</span>
      </div>
      <p className="text-xs text-muted-foreground">What would make today feel well spent?</p>

      <ul className="mt-3 space-y-2">
        {todays.map((p, i) => (
          <li key={p.id} className="flex items-center gap-2.5 rounded-xl border px-3 py-2.5">
            <button
              className={cn(
                "tap flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors",
                p.done ? "border-primary bg-primary text-primary-foreground" : "border-border",
              )}
              onClick={() => prioritiesStore.set((all) => all.map((x) => (x.id === p.id ? { ...x, done: !x.done } : x)))}
              aria-label={p.done ? "Mark not done" : "Mark done"}
            >
              {p.done ? <Check className="h-3.5 w-3.5" /> : null}
            </button>
            <span className={cn("min-w-0 flex-1 truncate text-sm", p.done && "text-muted-foreground line-through")}>{p.text}</span>
            {expanded ? (
              <div className="flex shrink-0 items-center">
                <button className="tap px-1 text-muted-foreground hover:text-foreground" onClick={() => move(p.id, -1)} disabled={i === 0} aria-label="Move up">
                  ↑
                </button>
                <button className="tap px-1 text-muted-foreground hover:text-foreground" onClick={() => move(p.id, 1)} disabled={i === todays.length - 1} aria-label="Move down">
                  ↓
                </button>
                <button
                  className="tap px-1 text-muted-foreground hover:text-destructive"
                  onClick={() => prioritiesStore.set((all) => all.filter((x) => x.id !== p.id))}
                  aria-label="Delete priority"
                >
                  <span aria-hidden>✕</span>
                </button>
              </div>
            ) : null}
          </li>
        ))}
        {todays.length === 0 ? <li className="py-1 text-center text-sm text-muted-foreground">No priorities yet for today.</li> : null}
      </ul>

      {todays.length < 3 ? (
        <form
          className="mt-3 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            add();
          }}
        >
          <Input value={text} onChange={(e) => setText(e.target.value)} placeholder={todays.length === 0 ? "First priority…" : "Another priority…"} className="h-9 flex-1 text-sm" maxLength={80} />
          <Button type="submit" size="sm" className="tap rounded-xl px-3" disabled={!text.trim()}>
            Add
          </Button>
        </form>
      ) : (
        <p className="mt-3 text-center text-xs text-muted-foreground">Three is enough for one day.</p>
      )}
      {!expanded ? (
        <Link to="/insights/priorities" className="mt-2 block text-center text-xs text-primary underline-offset-2 hover:underline">
          Full view & history
        </Link>
      ) : null}
    </section>
  );
}
