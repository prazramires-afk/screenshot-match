import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { dateKey, parseKey, todayKey } from "@/lib/date";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];

/** Month grid marking days present in `marked` (local date keys). Read-only. */
export function MonthCalendar({ marked, className }: { marked: Set<string>; className?: string }) {
  const [month, setMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const year = month.getFullYear();
  const m = month.getMonth();
  const first = new Date(year, m, 1);
  const daysInMonth = new Date(year, m + 1, 0).getDate();
  const leading = (first.getDay() + 6) % 7; // Monday-first
  const today = todayKey();

  const cells: (string | null)[] = [
    ...Array.from({ length: leading }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => dateKey(new Date(year, m, i + 1))),
  ];

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between">
        <button
          className="tap rounded-full p-1.5 text-muted-foreground hover:text-foreground"
          onClick={() => setMonth(new Date(year, m - 1, 1))}
          aria-label="Previous month"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <p className="font-display text-sm font-semibold">
          {month.toLocaleDateString(undefined, { month: "long", year: "numeric" })}
        </p>
        <button
          className="tap rounded-full p-1.5 text-muted-foreground hover:text-foreground"
          onClick={() => setMonth(new Date(year, m + 1, 1))}
          aria-label="Next month"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-2 grid grid-cols-7 gap-1 text-center text-[10px] text-muted-foreground">
        {WEEKDAYS.map((w, i) => (
          <span key={i}>{w}</span>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((key, i) =>
          key === null ? (
            <span key={`e${i}`} />
          ) : (
            <span
              key={key}
              className={cn(
                "flex aspect-square items-center justify-center rounded-full text-[11px]",
                marked.has(key) ? "bg-primary/85 font-medium text-primary-foreground" : "text-muted-foreground",
                key === today && !marked.has(key) && "border border-border",
              )}
            >
              {parseKey(key).getDate()}
            </span>
          ),
        )}
      </div>
    </div>
  );
}
