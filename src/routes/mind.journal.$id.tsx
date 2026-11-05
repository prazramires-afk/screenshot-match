import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { Check, Trash2 } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { journalStore } from "@/lib/stores";
import { CATEGORY_LABELS, ORGANIZER_CATEGORIES } from "@/lib/content";
import { uid } from "@/lib/storage";
import { pageHead } from "@/lib/head";
import type { JournalEntry, OrganizerCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/mind/journal/$id")({
  head: () => pageHead("Write · Clear Mental State", "Write or edit a journal entry — it saves automatically as you type."),
  component: EntryEditor,
});

function EntryEditor() {
  const { id } = Route.useParams();
  const router = useRouter();
  const entries = journalStore.use();
  const isNew = id === "new";
  const existing = isNew ? undefined : entries.find((e) => e.id === id);

  const [title, setTitle] = useState(existing?.title ?? "");
  const [content, setContent] = useState(existing?.content ?? "");
  const [category, setCategory] = useState<OrganizerCategory>(existing?.category ?? "personal");
  const [createdId, setCreatedId] = useState<string | null>(isNew ? null : id);
  const [savedTick, setSavedTick] = useState(0);
  const timer = useRef<number | null>(null);
  const dirty = useRef(false);

  const save = (t: string, c: string, cat: OrganizerCategory) => {
    const now = new Date().toISOString();
    if (!createdId) {
      const newId = uid();
      const entry: JournalEntry = { id: newId, title: t, content: c, category: cat, createdAt: now, updatedAt: now };
      journalStore.set((all) => [...all, entry]);
      setCreatedId(newId);
      router.navigate({ to: "/mind/journal/$id", params: { id: newId }, replace: true });
    } else {
      journalStore.set((all) => all.map((e) => (e.id === createdId ? { ...e, title: t, content: c, category: cat, updatedAt: now } : e)));
    }
    setSavedTick((n) => n + 1);
  };

  /* autosave 900 ms after the last keystroke; skip when nothing written yet */
  useEffect(() => {
    if (!dirty.current) return;
    if (!createdId && !title.trim() && !content.trim()) return;
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => save(title, content, category), 900);
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, content, category]);

  const remove = () => {
    if (!createdId) return;
    journalStore.set((all) => all.filter((e) => e.id !== createdId));
    router.navigate({ to: "/mind/journal" });
  };

  if (!isNew && !existing) {
    return (
      <div className="space-y-4">
        <PageHeader title="Entry" />
        <EmptyState icon={Check} title="Entry not found" description="It may have been deleted." action={
          <Button asChild variant="outline" className="tap rounded-xl">
            <Link to="/mind/journal">Back to journal</Link>
          </Button>
        } />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title={isNew && !createdId ? "New entry" : "Edit entry"}
        subtitle={
          existing
            ? `Created ${new Date(existing.createdAt).toLocaleDateString(undefined, { dateStyle: "medium" })}`
            : "It saves automatically as you write"
        }
      />

      <Input
        value={title}
        onChange={(e) => {
          dirty.current = true;
          setTitle(e.target.value.slice(0, 80));
        }}
        placeholder="Title (optional)"
        className="h-11 border-0 bg-transparent px-0 font-display text-xl font-semibold shadow-none focus-visible:ring-0"
      />
      <Textarea
        value={content}
        onChange={(e) => {
          dirty.current = true;
          setContent(e.target.value.slice(0, 20000));
        }}
        placeholder="Write freely…"
        className="min-h-72 border-0 bg-transparent px-0 text-base leading-relaxed shadow-none focus-visible:ring-0"
      />

      <div className="flex flex-wrap items-center gap-1.5">
        <span className="mr-1 text-xs text-muted-foreground">Category:</span>
        {ORGANIZER_CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => {
              dirty.current = true;
              setCategory(c.id);
            }}
            className={cn(
              "tap rounded-full border px-3 py-1.5 text-xs",
              category === c.id ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground",
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between pt-2">
        <p className="text-xs text-muted-foreground" aria-live="polite">
          {savedTick > 0 ? (
            <span className="flex items-center gap-1 text-primary">
              <Check className="h-3.5 w-3.5" /> Saved {CATEGORY_LABELS[category] ? `· ${CATEGORY_LABELS[category]}` : ""}
            </span>
          ) : (
            "Changes save automatically"
          )}
        </p>
        {existing ? (
          <Button variant="ghost" size="sm" className="tap rounded-full text-destructive" onClick={remove}>
            <Trash2 className="h-4 w-4" /> Delete entry
          </Button>
        ) : null}
      </div>
    </div>
  );
}
