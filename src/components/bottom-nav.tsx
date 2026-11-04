import { Link, useMatchRoute } from "@tanstack/react-router";
import { Sunrise, Cloud, Timer, Leaf, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

const TABS = [
  { to: "/", label: "Today", icon: Sunrise },
  { to: "/mind", label: "Mind", icon: Cloud },
  { to: "/focus", label: "Focus", icon: Timer },
  { to: "/calm", label: "Calm", icon: Leaf },
  { to: "/insights", label: "Insights", icon: Sparkles },
] as const;

export function BottomNav() {
  const matchRoute = useMatchRoute();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border/70 bg-background/85 pb-[env(safe-area-inset-bottom)] backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-lg items-stretch justify-around px-2">
        {TABS.map((tab) => {
          const active = matchRoute({ to: tab.to, fuzzy: tab.to !== "/" });
          const Icon = tab.icon;
          return (
            <Link
              key={tab.to}
              to={tab.to}
              className="tap flex min-w-14 flex-col items-center gap-0.5 px-2 py-2.5"
              aria-current={active ? "page" : undefined}
            >
              <Icon
                className={cn("h-5 w-5 transition-colors", active ? "text-primary" : "text-muted-foreground")}
                strokeWidth={active ? 2.2 : 1.7}
              />
              <span
                className={cn(
                  "text-[10px] font-medium tracking-wide transition-colors",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
