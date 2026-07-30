// Editorial visuals for use case cards. Unified visual language:
// dotted grid backdrop, single accent, refined mono labels.
type Props = { slug: string; className?: string };

const ACCENT = "hsl(var(--accent, 24 95% 53%))";

function Frame({ children, label, id, className }: { children?: React.ReactNode; label?: string; id?: string; className?: string }) {
  const patternId = `dots-${(id ?? label ?? "x").replace(/[^a-z0-9]/gi, "-")}`;
  return (
    <div className={`relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-rule ${className ?? ""}`} style={{ background: "var(--surface)" }}>
      {/* Dotted grid backdrop via CSS radial gradient (avoids SVG pattern-ref edge cases) */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: "radial-gradient(circle, color-mix(in oklab, var(--foreground) 18%, transparent) 1px, transparent 1.2px)",
          backgroundSize: "16px 16px",
        }}
        aria-hidden
      />

      {children}
      {label && (
        <div className="absolute bottom-3 left-4 mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
          {label}
        </div>
      )}
    </div>
  );
}

export function UseCaseVisual({ slug, className }: Props) {
  switch (slug) {
    case "research-agents":
      return (
        <Frame label="citation graph" className={className}>
          <svg viewBox="0 0 320 180" className="absolute inset-0 h-full w-full">
            {/* edges */}
            <g stroke="currentColor" strokeOpacity="0.25" className="text-foreground" fill="none">
              <path d="M50 70 Q 110 30, 170 80" />
              <path d="M170 80 Q 230 50, 280 70" />
              <path d="M170 80 Q 200 130, 250 140" />
              <path d="M170 80 Q 130 130, 80 140" />
              <path d="M50 70 Q 90 110, 80 140" />
            </g>
            {/* halo on focal node */}
            <circle cx="170" cy="80" r="22" fill={ACCENT} opacity="0.10" />
            <circle cx="170" cy="80" r="14" fill={ACCENT} opacity="0.18" />
            {/* nodes */}
            {[
              [50, 70, 4], [280, 70, 4], [80, 140, 4], [250, 140, 4],
            ].map(([x, y, r], i) => (
              <circle key={i} cx={x} cy={y} r={r as number} fill="currentColor" className="text-foreground" />
            ))}
            <circle cx="170" cy="80" r="7" fill={ACCENT} />
          </svg>
        </Frame>
      );

    case "enterprise-memory":
      return (
        <Frame label="8 sources · one graph" className={className}>
          <svg viewBox="0 0 320 180" className="absolute inset-0 h-full w-full">
            {/* center hub */}
            <circle cx="160" cy="90" r="34" fill="none" stroke="currentColor" strokeOpacity="0.15" className="text-foreground" />
            <circle cx="160" cy="90" r="22" fill={ACCENT} opacity="0.10" />
            <circle cx="160" cy="90" r="10" fill={ACCENT} />
            {/* 8 source nodes around */}
            {Array.from({ length: 8 }).map((_, i) => {
              const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
              const x = 160 + Math.cos(a) * 70;
              const y = 90 + Math.sin(a) * 55;
              return (
                <g key={i}>
                  <line x1="160" y1="90" x2={x} y2={y} stroke="currentColor" strokeOpacity="0.2" className="text-foreground" />
                  <circle cx={x} cy={y} r="9" fill="var(--background)" stroke="currentColor" strokeOpacity="0.4" className="text-foreground" />
                  <circle cx={x} cy={y} r="3" fill="currentColor" className="text-foreground" />
                </g>
              );
            })}
          </svg>
        </Frame>
      );

    case "investigative-analysis":
      return (
        <Frame label="path · 2 hops · 0.84" className={className}>
          <svg viewBox="0 0 320 180" className="absolute inset-0 h-full w-full">
            {/* scattered nodes */}
            {[
              [60, 60], [110, 120], [150, 50], [200, 100], [240, 60], [270, 130], [90, 90],
            ].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="3.5" fill="currentColor" opacity="0.35" className="text-foreground" />
            ))}
            {/* faint edges */}
            <g stroke="currentColor" strokeOpacity="0.15" className="text-foreground" fill="none">
              <path d="M60 60 L150 50" />
              <path d="M90 90 L110 120" />
              <path d="M150 50 L240 60" />
              <path d="M200 100 L270 130" />
            </g>
            {/* highlighted path */}
            <path d="M40 100 L110 70 L200 110 L290 80" fill="none" stroke={ACCENT} strokeWidth="2" />
            {[[40, 100], [110, 70], [200, 110], [290, 80]].map(([x, y], i) => (
              <circle key={`p${i}`} cx={x} cy={y} r={i === 0 || i === 3 ? 6 : 5} fill={ACCENT} />
            ))}
          </svg>
        </Frame>
      );

    case "multimodal-rag":
      return (
        <Frame label="ranked subgraph" className={className}>
          <div className="absolute inset-0 p-5">
            <div className="grid h-full grid-cols-4 gap-2">
              {Array.from({ length: 12 }).map((_, i) => {
                const ranked = [2, 5, 6, 9].includes(i);
                const rank = [2, 5, 6, 9].indexOf(i);
                return (
                  <div
                    key={i}
                    className="relative rounded-md border border-rule"
                    style={{
                      background: ranked
                        ? `color-mix(in oklab, ${ACCENT} ${22 - rank * 4}%, transparent)`
                        : "color-mix(in oklab, currentColor 4%, transparent)",
                      borderColor: ranked ? ACCENT : undefined,
                    }}
                  >
                    {ranked && (
                      <span className="absolute left-1 top-1 mono text-[8px] uppercase tracking-wider" style={{ color: ACCENT }}>
                        {rank + 1}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </Frame>
      );

    case "operational-decision-support":
      return (
        <Frame label="p99 · 24h · INC-2143" className={className}>
          <svg viewBox="0 0 320 180" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
            {/* baseline */}
            <line x1="0" y1="130" x2="320" y2="130" stroke="currentColor" strokeOpacity="0.15" className="text-foreground" />
            {/* area */}
            <path
              d="M0 110 L30 105 L60 108 L90 80 L120 120 L150 70 L180 95 L210 60 L240 90 L270 45 L300 75 L320 70 L320 180 L0 180 Z"
              fill={ACCENT}
              opacity="0.10"
            />
            {/* line */}
            <path
              d="M0 110 L30 105 L60 108 L90 80 L120 120 L150 70 L180 95 L210 60 L240 90 L270 45 L300 75 L320 70"
              fill="none"
              stroke={ACCENT}
              strokeWidth="2"
            />
            {/* incident marker */}
            <line x1="270" y1="20" x2="270" y2="160" stroke="currentColor" strokeOpacity="0.3" strokeDasharray="3 3" className="text-foreground" />
            <circle cx="270" cy="45" r="6" fill={ACCENT} />
            <circle cx="270" cy="45" r="11" fill="none" stroke={ACCENT} strokeOpacity="0.4" />
          </svg>
        </Frame>
      );

    case "tutoring-curriculum":
      return (
        <Frame label="mastery" className={className}>
          <div className="absolute inset-0 p-5 pb-9 flex flex-col justify-center gap-2.5">
            {[
              { label: "Chain rule", v: 78 },
              { label: "Partial deriv.", v: 64 },
              { label: "Gradients", v: 82 },
              { label: "Backprop", v: 28 },
            ].map((r) => {
              const weak = r.v < 50;
              return (
                <div key={r.label} className="flex items-center gap-3 text-[11px]">
                  <span className="w-24 truncate text-ink-muted">{r.label}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-background overflow-hidden border border-rule">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${r.v}%`,
                        background: weak ? ACCENT : "currentColor",
                        opacity: weak ? 1 : 0.6,
                      }}
                    />
                  </div>
                  <span className="mono w-9 text-right text-ink-muted">0.{r.v}</span>
                </div>
              );
            })}
          </div>
        </Frame>
      );

    default:
      return <Frame className={className} />;
  }
}
