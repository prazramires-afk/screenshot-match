import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Brain, ChevronRight, Compass, Flower2, Heart, NotebookPen, Sparkles } from "lucide-react";

import { brainDumpStore, gratitudeStore, journalStore } from "@/lib/stores";
import { pageHead } from "@/lib/head";

export const Route = createFileRoute("/mind")({
  head: () => pageHead("Mind Space · Clear Mental State", "Journal, brain dump, guided reflection, gratitude and a library of mental notes."),
  component: MindSpace,
});

const SECTIONS = [
  { to: "/mind/journal", icon: BookOpen, title: "Free journal", description: "Write freely, search and organize by category" },
  { to: "/mind/brain-dump", icon: Brain, title: "Brain dump", description: "Capture everything occupying your mind" },
  { to: "/mind/guided", icon: Compass, title: "Guided journaling", description: "Reflect on a carefully chosen prompt" },
  { to: "/mind/gratitude", icon: Heart, title: "Gratitude", description: "Three things you appreciate today" },
  { to: "/mind/organizer", icon: Flower2, title: "Thought organizer", description: "Sort entries and thoughts by life area" },
  { to: "/mind/notes", icon: Sparkles, title: "Mental notes", description: "60 short insights on a clearer mind" },
] as const;

function MindSpace() {
  const journal = journalStore.use();
  const brain = brainDumpStore.use();
  const gratitude = gratitudeStore.use();
  const openThoughts = brain.filter((t) => !t.processed).length;
  const counts: Record<string, string> = {
    "/mind/journal": `${journal.length} ${journal.length === 1 ? "entry" : "entries"}`,
    "/mind/brain-dump": openThoughts > 0 ? `${openThoughts} open` : "All clear",
    "/mind/gratitude": gratitude.length > 0 ? `${gratitude.length} ${gratitude.length === 1 ? "day" : "days"}` : "Start today",
  };

  return (
    <div className="space-y-4">
      <header className="fade-up">
        <div className="flex items-center gap-2.5">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary">
            <NotebookPen className="h-5 w-5 text-primary" strokeWidth={1.6} />
          </span>
          <div>
            <h1 className="font-display text-2xl font-semibold">Mind Space</h1>
            <p className="text-sm text-muted-foreground">Put it down on paper, keep the mind light.</p>
          </div>
        </div>
      </header>

      <div className="grid gap-2.5">
        {SECTIONS.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.to}
              to={s.to}
              className="tap flex items-center gap-3.5 rounded-2xl border bg-card px-4 py-3.5 shadow-sm transition-colors hover:border-primary/40"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary">
                <Icon className="h-4.5 w-4.5 text-primary" strokeWidth={1.6} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="font-display text-base font-semibold">{s.title}</span>
                  {counts[s.to] ? <span className="text-[11px] text-muted-foreground">{counts[s.to]}</span> : null}
                </span>
                <span className="block truncate text-xs text-muted-foreground">{s.description}</span>
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
