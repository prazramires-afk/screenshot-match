import {
  BookOpen,
  Circle,
  Cloud,
  Droplets,
  Flower2,
  Footprints,
  Heart,
  ListChecks,
  Moon,
  PenLine,
  PhoneOff,
  Sun,
  Unplug,
  Wind,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  "pen-line": PenLine,
  "flower-2": Flower2,
  "book-open": BookOpen,
  "phone-off": PhoneOff,
  footprints: Footprints,
  heart: Heart,
  unplug: Unplug,
  moon: Moon,
  wind: Wind,
  "list-checks": ListChecks,
  sun: Sun,
  cloud: Cloud,
  droplets: Droplets,
};

export const HABIT_ICON_NAMES = Object.keys(ICONS);

/** Renders a habit's stored lucide icon name, with a graceful fallback. */
export function HabitIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? Circle;
  return <Icon className={className} strokeWidth={1.7} />;
}
