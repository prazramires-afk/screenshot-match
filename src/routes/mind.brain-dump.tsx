import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Check, Circle, Plus } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { ConfirmDelete } from "@/components/confirm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { brainDumpStore } from "@/lib/stores";
import { BRAIN_BUCKETS, ORGANIZER_CATEGORIES } from "@/lib/content";
import { uid } from "@/lib/storage";
import { pageHead } from "@/lib/head";
import type { BrainBucket, BrainDumpItem, OrganizerCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/mind/brain-dump")({
  head: () => pageHead("Brain Dump · Clear Mental State", "Capture everything occupying your mind, then process it one thought at a time."),
  component: BrainDump,
});

const FILTERS = ["open", "processed", "all"] as const;
type Filter = (typeof FILTERS)[number];

function BrainDump() {
  const items = brainDumpStore.use();
  const [bucket, setBucket] = useState<BrainBucket>("todo");
  const [filter, setFilter] = useState<Filter>("open");
  const [text, setText] = useState("");
  const [category, setCategory] = useState<OrganizerCategory>("personal");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const visible = useMemo(() => {
    return [...items]
      .filter((t) => t.bucket === bucket)
      .filter((t) => (filter === "all" ? true : filter === "open" ? !t.processed : t.processed))
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }, [items, bucket, filter]);

  const add = () => {
    const value = text.trim();
    if (!value) return;
    const now = new Date().toISOString();
    const item: BrainDumpItem = { id: uid(), text: value, bucket, category, processed: false, createdAt: now, updatedAt: now };
    brainDumpStore.set((all) => [...all, item]);
    setText("");
  };

  const saveEdit = () => {
    const value = editText.trim();
    if (!value || !editingId) return;
    brainDumpStore.set((all) => all.map((t) => (t.id === editingId ? { ...t, text: value, updatedAt: new Date().toISOString() } : t)));
    setEditingId(null);
  };

  const activeBucket = BRAIN_BUCKETS.find((b) => b.id === bucket)!;

  return (
    <div className="space-y-4">
      <PageHeader title="Brain dump" subtitle="Get it out of your head. Sort it later — or never." />

      <div className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4">
        {BRAIN_BUCKETS.map((b) => (
          <button
            key={b.id}
            onClick={() => setBucket(b.id)}
            className={cn(
              "tap shrink-0 rounded-full border px-3 py-1.5 text-xs",
              bucket === b.id ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground",
            )}
          >
            {b.label}
          </button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">{activeBucket.hint}</p>

      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          add();
        }}
      >
        <Input value={text} onChange={(e) => setText(e.target.value)} placeholder={`Add to “${activeBucket.label}”…`} className="h-10 flex-1 text-sm" maxLength={200} />
        <Button type="submit" size="icon" className="tap shrink-0 rounded-xl" disabled={!text.trim()} aria-label="Add thought">
          <Plus className="h-4 w-4" />
        </Button>
      </form>

      <div className="flex gap-1.5">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn("tap rounded-full border px-3 py-1 text-[11px] capitalize", filter === f ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground")}
          >
            {f}
          </button>
        ))}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as OrganizerCategory)}
          className="ml-auto rounded-full border border-border bg-background px-2 py-1 text-[11px] text-muted-foreground"
          aria-label="Category for new thoughts"
        >
          {ORGANIZER_CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {visible.length === 0 ? (
        <EmptyState icon={Circle} title="Nothing here" description="Whatever is circling in your mind — drop it in above. Writing it down releases it." />
      ) : (
        <ul className="grid gap-2">
          {visible.map((t) => (
            <li key={t.id} className="flex items-start gap-2.5 rounded-xl border bg-card px-3 py-2.5">
              <button
                className={cn(
                  "tap mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors",
                  t.processed ? "border-primary bg-primary text-primary-foreground" : "border-border",
                )}
                onClick={() => brainDumpStore.set((all) => all.map((x) => (x.id === t.id ? { ...x, processed: !x.processed, updatedAt: new Date().toISOString() } : x)))}
                aria-label={t.processed ? "Mark unprocessed" : "Mark processed"}
              >
                {t.processed ? <Check className="h-3.5 w-3.5" /> : null}
              </button>
              {editingId === t.id ? (
                <div className="flex min-w-0 flex-1 gap-2">
                  <Input value={editText} onChange={(e) => setEditText(e.target.value)} className="h-8 text-sm" autoFocus maxLength={200} />
                  <Button size="sm" className="tap rounded-lg px-2" onClick={saveEdit} disabled={!editText.trim()}>
                    Save
                  </Button>
                  <Button size="sm" variant="ghost" className="tap rounded-lg px-2" onClick={() => setEditingId(null)}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <>
                  <div className="min-w-0 flex-1">
                    <p className={cn("text-sm", t.processed && "text-muted-foreground line-through")}>{t.text}</p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">
                      {ORGANIZER_CATEGORIES.find((c) => c.id === t.category)?.label} · {new Date(t.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    </p>
                  </div>
                  <button
                    className="tap shrink-0 px-1 text-[11px] text-muted-foreground hover:text-foreground"
                    onClick={() => {
                      setEditingId(t.id);
                      setEditText(t.text);
                    }}
                    aria-label="Edit thought"
                  >
                    Edit
                  </button>
                  <ConfirmDelete onConfirm={() => brainDumpStore.set((all) => all.filter((x) => x.id !== t.id))} />
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
