import { useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

/** Back-arrow page header for secondary screens. */
export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  const router = useRouter();
  return (
    <header className="mb-5 flex items-start gap-3">
      <Button
        variant="ghost"
        size="icon"
        className="tap -ml-2 mt-0.5 shrink-0 rounded-full"
        onClick={() => router.history.back()}
        aria-label="Go back"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
      <div className="min-w-0">
        <h1 className="truncate text-2xl font-semibold leading-tight">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
    </header>
  );
}
