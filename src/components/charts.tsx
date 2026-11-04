import { cn } from "@/lib/utils";

export interface ChartPoint {
  label: string;
  value: number;
}

function niceMax(max: number): number {
  if (max <= 0) return 1;
  const pow = Math.pow(10, Math.floor(Math.log10(max)));
  for (const m of [1, 2, 2.5, 5, 10]) {
    if (m * pow >= max) return m * pow;
  }
  return 10 * pow;
}

/** Minimal rounded bar chart, SVG-based, SSR-safe. */
export function BarChart({
  data,
  height = 140,
  formatValue = (v) => String(Math.round(v)),
  className,
}: {
  data: ChartPoint[];
  height?: number;
  formatValue?: (v: number) => string;
  className?: string;
}) {
  const max = niceMax(Math.max(...data.map((d) => d.value), 0));
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-end gap-1.5" style={{ height }}>
        {data.map((d, i) => {
          const h = max > 0 ? Math.max((d.value / max) * (height - 22), d.value > 0 ? 3 : 0) : 0;
          return (
            <div key={i} className="group flex min-w-0 flex-1 flex-col items-center justify-end gap-1">
              <span className="text-[9px] font-medium text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                {d.value > 0 ? formatValue(d.value) : ""}
              </span>
              <div
                className="w-full max-w-7 rounded-t-md bg-primary/80 transition-all group-hover:bg-primary"
                style={{ height: h }}
                title={`${d.label}: ${formatValue(d.value)}`}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-1.5 flex gap-1.5">
        {data.map((d, i) => (
          <div key={i} className="min-w-0 flex-1 truncate text-center text-[9px] text-muted-foreground">
            {d.label}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Minimal smooth line chart for mood / energy trends. */
export function LineChart({
  data,
  height = 140,
  min = 1,
  max = 5,
  className,
}: {
  data: ChartPoint[];
  height?: number;
  min?: number;
  max?: number;
  className?: string;
}) {
  const w = 300;
  const h = height;
  const pad = 6;
  const pts = data.map((d, i) => {
    const x = data.length > 1 ? pad + (i / (data.length - 1)) * (w - pad * 2) : w / 2;
    const y = h - pad - ((d.value - min) / (max - min || 1)) * (h - pad * 2);
    return { x, y, ...d };
  });
  const path = pts
    .map((p, i) => {
      if (i === 0) return `M ${p.x} ${p.y}`;
      const prev = pts[i - 1]!;
      const cx = (prev.x + p.x) / 2;
      return `C ${cx} ${prev.y} ${cx} ${p.y} ${p.x} ${p.y}`;
    })
    .join(" ");

  return (
    <div className={cn("w-full", className)}>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height }} role="img" aria-label="trend chart">
        <line x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} stroke="hsl(var(--border))" strokeWidth="1" />
        {data.length > 0 && <path d={path} fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" />}
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3" fill="hsl(var(--primary))">
            <title>{`${p.label}: ${p.value}`}</title>
          </circle>
        ))}
      </svg>
      <div className="mt-1 flex justify-between text-[9px] text-muted-foreground">
        <span>{data[0]?.label}</span>
        <span>{data[data.length - 1]?.label}</span>
      </div>
    </div>
  );
}

/** Circular progress ring. */
export function Ring({
  value,
  max,
  size = 64,
  stroke = 6,
  label,
  className,
}: {
  value: number;
  max: number;
  size?: number;
  stroke?: number;
  label?: string;
  className?: string;
}) {
  const pct = max > 0 ? Math.min(value / max, 1) : 0;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className={cn("relative inline-flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="hsl(var(--secondary))" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          className="transition-all duration-500"
        />
      </svg>
      <span className="absolute text-center font-display text-sm font-semibold leading-none">
        {label ?? `${Math.round(pct * 100)}%`}
      </span>
    </div>
  );
}
