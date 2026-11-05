import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Check, Heart, Save } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { MonthCalendar } from "@/components/month-calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { gratitudeStore } from "@/lib/stores";
import { formatDayLabel, todayKey } from "@/lib/date";
import { uid } from "@/lib/storage";
import { pageHead } from "@/lib/head";

export const Route = createFileRoute("/mind/gratitude")({
  head: () => pageHead("Gratitude · Clear Mental State", "Three things you appreciate today — small, specific, real."),
  component: Gratitude,
});

function Gratitude() {
  const entries = gratitudeStore.use();
  const today = todayKey();
  const existing = entries.find((e) => e.date === today);
  const [items, setItems] = useState<string[]>(existing?.items ?? ["", "", ""]);
  const [saved, setSaved] = useState(false);

  const history = useMemo(() => [...entries].sort((a, b) => (a.date < b.date ? 1 : -1)), [entries]);
  const marked = useMemo(() => new Set(entries.map((e) => e.date)), [entries]);

  const save = () => {
    const filled = items.map((i) => i.trim()).filter(Boolean);
    if (filled.length === 0) return;
    gratitudeStore.set((all) => {
      const others = all.filter((e) => e.date !== today);
      return [...others, { id: existing?.id ?? uid(), date: today, items: filled, createdAt: existing?.createdAt ?? new Date().toISOString() }];
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-4">
      <PageHeader title="Gratitude" subtitle="Three good things, however small." />

      <section className="rounded-2xl border bg-card p-5 shadow-sm">
        <div className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
            <Heart className="h-5 w-5 text-primary" strokeWidth={1.6} />
          </span>
          <div>
            <h2 className="font-display text-base font-semibold">Today</h2>
            <p className="text-xs text-muted-foreground">{formatDayLabel(today)}</p>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          {[0, 1, 2].map((i) => (
            <Input
              key={i}
              value={items[i] ?? ""}
              onChange={(e) => setItems((prev) => prev.map((v, j) => (j === i ? e.target.value.slice(0, 120) : v)))}
              placeholder={["First good thing…", "Second good thing…", "Third good thing…"][i]}
              className="h-10 text-sm"
            />
          ))}
        </div>
        <Button className="tap mt-3 w-full rounded-xl" onClick={save} disabled={items.every((i) => !i.trim())}>
          <Save className="h-4 w-4" /> {saved ? "Saved" : existing ? "Update today" : "Save today's three"}
        </Button>
      </section>

      {entries.length > 0 ? (
        <>
          <section className="rounded-2xl border bg-card p-4 shadow-sm">
            <MonthCalendar marked={marked} />
            <p className="mt-2 text-center text-[11px] text-muted-foreground">Days of gratitude</p>
          </section>
          <section className="space-y-2">
            <h3 className="font-display text-base font-semibold">History</h3>
            {history.map((e) => (
              <div key={e.id} className="rounded-xl border bg-card px-4 py-3">
                <p className="text-xs font-medium text-muted-foreground">{formatDayLabel(e.date)}</p>
                <ul className="mt-1.5 space-y-1">
                  {e.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        </>
      ) : (
        <EmptyState icon={Heart} title="No entries yet" description="Write today's three and watch the calendar fill in over the weeks." />
      )}
    </div>
  );
}
