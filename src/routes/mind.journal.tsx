import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, PenLine, Search } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { MonthCalendar } from "@/components/month-calendar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { journalStore } from "@/lib/stores";
import { CATEGORY_LABELS, ORGANIZER_CATEGORIES } from "@/lib/content";
import { pageHead } from "@/lib/head";
import type { OrganizerCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/mind/journal")({
  head: () => pageHead("Free Journal · Clear Mental State", "An unlimited, private journal with search, categories and calendar history."),
  component: JournalList,
});

function localDay(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function JournalList() {
  const entries = journalStore.use();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<OrganizerCategory | "all">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...entries]
      .filter((e) => (category === "all" ? true : e.category === category))
      .filter((e) => !q || e.title.toLowerCase().includes(q) || e.content.toLowerCase().includes(q))
      .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
  }, [entries, query, category]);

  const writtenDays = useMemo(() => new Set(entries.map((e) => localDay(e.createdAt))), [entries]);

  return (
    <div className="space-y-4">
      <PageHeader title="Free journal" subtitle={`${entries.length} ${entries.length === 1 ? "entry" : "entries"} · saved on this device`} />

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search entries…" className="h-10 pl-9 text-sm" />
        </div>
        <Button asChild className="tap rounded-xl">
          <Link to="/mind/journal/new" className="flex items-center gap-1.5">
            <PenLine className="h-4 w-4" /> New
          </Link>
        </Button>
      </div>

      <div className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1">
        <button
          onClick={() => setCategory("all")}
          className={cn("tap shrink-0 rounded-full border px-3 py-1.5 text-xs", category === "all" ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground")}
        >
          All
        </button>
        {ORGANIZER_CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setCategory(c.id)}
            className={cn("tap shrink-0 rounded-full border px-3 py-1.5 text-xs", category === c.id ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground")}
          >
            {c.label}
          </button>
        ))}
      </div>

      {entries.length > 0 ? (
        <section className="rounded-2xl border bg-card p-4 shadow-sm">
          <MonthCalendar marked={writtenDays} />
          <p className="mt-2 text-center text-[11px] text-muted-foreground">Days you wrote</p>
        </section>
      ) : null}

      {filtered.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title={entries.length === 0 ? "Your journal is empty" : "Nothing matches"}
          description={entries.length === 0 ? "Write your first entry — a thought, a plan, or simply how today felt." : "Try another search word or category."}
          action={
            entries.length === 0 ? (
              <Button asChild className="tap rounded-xl">
                <Link to="/mind/journal/new">Write the first entry</Link>
              </Button>
            ) : undefined
          }
        />
      ) : (
        <ul className="grid gap-2.5">
          {filtered.map((e) => (
            <li key={e.id}>
              <Link to="/mind/journal/$id" params={{ id: e.id }} className="tap block rounded-2xl border bg-card px-4 py-3.5 shadow-sm transition-colors hover:border-primary/40">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="truncate font-display text-base font-semibold">{e.title || "Untitled"}</h3>
                  <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">{CATEGORY_LABELS[e.category]}</span>
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{e.content || "No text yet"}</p>
                <p className="mt-1.5 text-[11px] text-muted-foreground">{new Date(e.updatedAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
