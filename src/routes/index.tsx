import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Brain, Check, Flower2, Heart, Settings, Timer, Unplug, Wind } from "lucide-react";

import { RoutineCard } from "@/components/routine-card";
import { CheckinCard, PrioritiesCard } from "@/components/checkin-priorities";
import { HabitIcon } from "@/components/habit-icon";
import { habitsStore, habitCompletionsStore, isHabitDone } from "@/lib/stores";
import { DAILY_MESSAGES, dailyNote } from "@/lib/content";
import { dayOfYear, formatLongDate, greetingFor, todayKey } from "@/lib/date";
import { uid } from "@/lib/storage";
import { pageHead } from "@/lib/head";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => pageHead("Today · Clear Mental State", "Your gentle daily dashboard: routine, habits, mood check-in and three priorities."),
  component: Index,
});

const QUICK_ACTIONS = [
  { to: "/mind/journal", label: "Journal", icon: BookOpen },
  { to: "/mind/brain-dump", label: "Brain dump", icon: Brain },
  { to: "/calm/breathing", label: "Breathe", icon: Wind },
  { to: "/focus", label: "Focus timer", icon: Timer },
  { to: "/mind/gratitude", label: "Gratitude", icon: Heart },
  { to: "/detox", label: "Detox", icon: Unplug },
] as const;

function Index() {
  const habits = habitsStore.use();
  const completions = habitCompletionsStore.use();
  const now = new Date();
  const greeting = greetingFor(now.getHours());
  const message = DAILY_MESSAGES[dayOfYear(now) % DAILY_MESSAGES.length]!;
  const note = dailyNote(dayOfYear(now));
  const active = habits.filter((h) => !h.archived);

  const toggleHabit = (habitId: string) => {
    const date = todayKey();
    const done = isHabitDone(completions, habitId, date);
    habitCompletionsStore.set((all) => {
      const others = all.filter((c) => !(c.habitId === habitId && c.date === date));
      if (done) return others;
      return [...others, { id: uid(), habitId, date }];
    });
  };

  return (
    <div className="space-y-5">
      <header className="fade-up flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">{formatLongDate(now)}</p>
          <h1 className="font-display text-3xl font-semibold">{greeting}</h1>
        </div>
        <Link
          to="/settings"
          className="tap mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Settings"
        >
          <Settings className="h-4.5 w-4.5" strokeWidth={1.7} />
        </Link>
      </header>

      <section className="fade-up rounded-2xl border bg-card p-5 shadow-sm">
        <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">Daily message</p>
        <p className="mt-2 font-display text-lg italic leading-snug text-forest">“{message}”</p>
        <Link to="/mind/notes" className="mt-3 flex items-center gap-1 text-xs text-primary underline-offset-2 hover:underline">
          Today's mental note: {note.title} <span aria-hidden>→</span>
        </Link>
      </section>

      <RoutineCard />

      <section className="rounded-2xl border bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Today's habits</h2>
          <Link to="/insights/habits" className="text-xs text-primary underline-offset-2 hover:underline">
            Manage
          </Link>
        </div>
        {active.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            No habits yet.{" "}
            <Link to="/insights/habits" className="text-primary underline-offset-2 hover:underline">
              Choose a few gentle ones →
            </Link>
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {active.slice(0, 6).map((h) => {
              const done = isHabitDone(completions, h.id);
              return (
                <li key={h.id} className="flex items-center gap-3 rounded-xl border px-3 py-2.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                    <HabitIcon name={h.icon} className="h-4 w-4" />
                  </span>
                  <span className={cn("min-w-0 flex-1 truncate text-sm", done && "text-muted-foreground line-through")}>{h.name}</span>
                  <button
                    className={cn(
                      "tap flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors",
                      done ? "border-primary bg-primary text-primary-foreground" : "border-border",
                    )}
                    onClick={() => toggleHabit(h.id)}
                    aria-label={done ? "Mark not done" : "Mark done"}
                  >
                    {done ? <Check className="h-3.5 w-3.5" /> : null}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border bg-card p-4 shadow-sm">
        <h2 className="font-display text-lg font-semibold">Quick access</h2>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {QUICK_ACTIONS.map((a) => {
            const Icon = a.icon;
            return (
              <Link
                key={a.to}
                to={a.to}
                className="tap flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3.5 text-center text-[11px] font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
              >
                <Icon className="h-5 w-5 text-primary" strokeWidth={1.6} />
                {a.label}
              </Link>
            );
          })}
        </div>
      </section>

      <CheckinCard />
      <PrioritiesCard />
    </div>
  );
}
