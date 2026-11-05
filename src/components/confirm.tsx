import { useState } from "react";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Two-tap destructive button: first tap arms, second tap confirms. */
export function ConfirmButton({
  onConfirm,
  children,
  confirmLabel = "Delete?",
  className,
  disabled,
  "aria-label": ariaLabel,
}: {
  onConfirm: () => void;
  children: React.ReactNode;
  confirmLabel?: string;
  className?: string;
  disabled?: boolean;
  "aria-label"?: string;
}) {
  const [armed, setArmed] = useState(false);
  const [timer, setTimer] = useState<number | null>(null);

  const arm = () => {
    setArmed(true);
    const id = window.setTimeout(() => setArmed(false), 3000);
    setTimer(id);
  };
  const disarm = () => {
    setArmed(false);
    if (timer !== null) window.clearTimeout(timer);
  };

  if (disabled) {
    return (
      <Button variant="ghost" size="icon" className={className} disabled aria-label={ariaLabel}>
        {children}
      </Button>
    );
  }

  return armed ? (
    <span className="flex items-center gap-1">
      <button
        className={cn("tap rounded-full bg-destructive px-2.5 py-1 text-[11px] font-medium text-destructive-foreground", className)}
        onClick={() => {
          disarm();
          onConfirm();
        }}
      >
        {confirmLabel}
      </button>
      <button className="tap rounded-full border border-border px-2 py-1 text-[11px] text-muted-foreground" onClick={disarm}>
        Keep
      </button>
    </span>
  ) : (
    <Button variant="ghost" size="icon" className={cn("text-muted-foreground hover:text-destructive", className)} onClick={arm} aria-label={ariaLabel ?? "Delete"}>
      {children}
    </Button>
  );
}

/** Simple icon-only confirm for rows (trash icon). */
export function ConfirmDelete({ onConfirm, label = "Delete" }: { onConfirm: () => void; label?: string }) {
  return (
    <ConfirmButton onConfirm={onConfirm} aria-label={label} confirmLabel="Delete?">
      <Trash2 className="h-4 w-4" />
    </ConfirmButton>
  );
}
