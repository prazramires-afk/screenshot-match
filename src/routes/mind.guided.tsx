import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Compass, RefreshCw, Save } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { journalStore } from "@/lib/stores";
import { GUIDED_PROMPTS } from "@/lib/content";
import { uid } from "@/lib/storage";
import { pageHead } from "@/lib/head";

export const Route = createFileRoute("/mind/guided")({
  head: () => pageHead("Guided Journaling · Clear Mental State", "Reflect on one carefully chosen question at a time."),
  component: GuidedJournaling,
});

function GuidedJournaling() {
  const entries = journalStore.use();
  const [prompt, setPrompt] = useState(() => GUIDED_PROMPTS[Math.floor(Math.random() * GUIDED_PROMPTS.length)]!);
  const [answer, setAnswer] = useState("");
  const [saved, setSaved] = useState(false);

  const past = useMemo(() => {
    const prompts = new Set(GUIDED_PROMPTS);
    return [...entries]
      .filter((e) => prompts.has(e.title))
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }, [entries]);

  const shuffle = () => {
    let next = prompt;
    while (next === prompt && GUIDED_PROMPTS.length > 1) {
      next = GUIDED_PROMPTS[Math.floor(Math.random() * GUIDED_PROMPTS.length)]!;
    }
    setPrompt(next);
    setAnswer("");
    setSaved(false);
  };

  const save = () => {
    const value = answer.trim();
    if (!value) return;
    const now = new Date().toISOString();
    journalStore.set((all) => [...all, { id: uid(), title: prompt, content: value, category: "personal", createdAt: now, updatedAt: now }]);
    setAnswer("");
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-4">
      <PageHeader title="Guided journaling" subtitle="One question, honest answer. That's the whole practice." />

      <section className="rounded-2xl border bg-card p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary">
            <Compass className="h-5 w-5 text-primary" strokeWidth={1.6} />
          </span>
          <Button variant="ghost" size="sm" className="tap rounded-full text-xs text-muted-foreground" onClick={shuffle}>
            <RefreshCw className="h-3.5 w-3.5" /> Another prompt
          </Button>
        </div>
        <h2 className="mt-3 font-display text-xl font-semibold leading-snug text-forest">{prompt}</h2>
        <Textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value.slice(0, 5000))}
          placeholder="Take your time…"
          className="mt-4 min-h-44 text-sm leading-relaxed"
        />
        <Button className="tap mt-3 w-full rounded-xl" onClick={save} disabled={!answer.trim()}>
          <Save className="h-4 w-4" /> {saved ? "Saved to journal" : "Save answer"}
        </Button>
        <p className="mt-2 text-center text-[11px] text-muted-foreground">Answers are saved as journal entries titled with the prompt.</p>
      </section>

      {past.length > 0 ? (
        <section>
          <h3 className="font-display text-base font-semibold">Past reflections</h3>
          <ul className="mt-2 grid gap-2">
            {past.slice(0, 8).map((e) => (
              <li key={e.id}>
                <Link to="/mind/journal/$id" params={{ id: e.id }} className="tap block rounded-xl border bg-card px-4 py-3">
                  <p className="truncate text-sm font-medium">{e.title}</p>
                  <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{e.content}</p>
                  <p className="mt-1 text-[10px] text-muted-foreground">{new Date(e.createdAt).toLocaleDateString(undefined, { dateStyle: "medium" })}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <EmptyState icon={Compass} title="No reflections yet" description="Your saved answers will gather here, so you can see how your answers change over time." />
      )}
    </div>
  );
}
