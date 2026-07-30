import { useMemo } from "react";
import { EDGES, NODES, nodeColor, type PgNode } from "@/lib/playground/graph-data";

interface Props {
  phase: "empty" | "loading" | "ready";
  selected: string | null;
  hovered: string | null;
  onSelect: (id: string | null) => void;
  onHover: (id: string | null) => void;
  onTryDemo: () => void;
  loadingText: string;
  loadingPct: number;
}

export function GraphCanvas({
  phase, selected, hovered, onSelect, onHover, onTryDemo, loadingText, loadingPct,
}: Props) {
  const byId = useMemo(() => Object.fromEntries(NODES.map((n) => [n.id, n])), []);
  const neighbors = useMemo(() => {
    if (!selected) return null;
    const s = new Set<string>([selected]);
    EDGES.forEach((e) => {
      if (e.from === selected) s.add(e.to);
      if (e.to === selected) s.add(e.from);
    });
    return s;
  }, [selected]);

  const showGraph = phase === "ready";

  return (
    <div className="relative rounded-lg border border-rule bg-background overflow-hidden">
      <svg
        viewBox="0 0 1040 700"
        preserveAspectRatio="xMidYMid meet"
        className="pg-grid-bg block w-full h-[420px] sm:h-[520px] lg:h-[560px]"
        onClick={() => onSelect(null)}
        role="img"
        aria-label="Knowledge graph canvas"
      >
        {showGraph && (
          <>
            {/* edges */}
            <g>
              {EDGES.map((e) => {
                const a = byId[e.from] as PgNode;
                const b = byId[e.to] as PgNode;
                const isIncident = !!selected && (e.from === selected || e.to === selected);
                const dim = !!selected && !isIncident;
                const stroke = isIncident || !selected
                  ? "var(--accent)"
                  : "color-mix(in oklab, var(--accent) 35%, transparent)";
                const mx = (a.x + b.x) / 2;
                const my = (a.y + b.y) / 2;
                const labelText = e.label.toUpperCase().replace(/\s+/g, "_");
                const labelWidth = Math.max(58, labelText.length * 6.2 + 14);
                return (
                  <g key={e.id} opacity={dim ? 0.22 : 1}>
                    <line
                      x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                      stroke={stroke}
                      strokeWidth={isIncident ? 1.4 : 1}
                      strokeDasharray="5 5"
                      className={isIncident ? "pg-anim-dash" : ""}
                    />
                    {isIncident && (
                      <g className="pg-anim-fadein">
                        <rect
                          x={mx - labelWidth / 2} y={my - 9}
                          width={labelWidth} height={16} rx={2}
                          fill="var(--background)"
                          stroke="var(--accent)"
                          strokeOpacity={0.55}
                        />
                        <text
                          x={mx} y={my + 2} textAnchor="middle"
                          className="mono"
                          style={{ fontSize: 9, fill: "var(--accent)", letterSpacing: "0.14em" }}
                        >
                          {labelText}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </g>

            {/* nodes */}
            <g>
              {NODES.map((n) => {
                const isSel = selected === n.id;
                const isHover = hovered === n.id;
                const inSet = !selected || neighbors?.has(n.id);
                const opacity = inSet ? 1 : 0.32;
                const baseR = n.r ?? 14;
                const ringR = baseR + (isSel ? 2 : isHover ? 1 : 0);
                const dotR = ringR * 0.4;
                const color = nodeColor(n.kind, n.modality);
                const labelY = n.y + ringR + 16;
                return (
                  <g
                    key={n.id}
                    style={{ cursor: "pointer", transition: "opacity 200ms" }}
                    opacity={opacity}
                    onClick={(ev) => { ev.stopPropagation(); onSelect(n.id); }}
                    onMouseEnter={() => onHover(n.id)}
                    onMouseLeave={() => onHover(null)}
                    tabIndex={0}
                    onKeyDown={(ev) => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); onSelect(n.id); } }}
                    role="button"
                    aria-label={`${n.label}, ${n.kind}`}
                  >
                    {/* selected outer halo */}
                    {isSel && (
                      <>
                        <circle cx={n.x} cy={n.y} r={ringR + 10} fill={color} opacity={0.18} className="pg-anim-pulse" />
                        <circle cx={n.x} cy={n.y} r={ringR + 6} fill="none" stroke={color} strokeOpacity={0.45} strokeWidth={1.2} />
                      </>
                    )}
                    {/* outer ring */}
                    <circle
                      cx={n.x} cy={n.y} r={ringR}
                      fill="var(--background)"
                      stroke={color}
                      strokeWidth={isSel ? 2.2 : 1.6}
                      style={isSel ? { filter: "drop-shadow(var(--pg-glow-node))" } : undefined}
                    />
                    {/* inner dot */}
                    <circle cx={n.x} cy={n.y} r={dotR} fill={color} />
                    {/* label */}
                    <text
                      x={n.x} y={labelY} textAnchor="middle"
                      style={{
                        fontSize: 12,
                        fill: "var(--ink)",
                        fontWeight: isSel ? 600 : 500,
                        pointerEvents: "none",
                      }}
                    >{n.label}</text>
                    {/* kind subtitle (only for selected) */}
                    {isSel && (
                      <text
                        x={n.x} y={labelY + 13} textAnchor="middle"
                        className="mono"
                        style={{ fontSize: 10, fill: "var(--ink-muted)", letterSpacing: "0.14em", pointerEvents: "none" }}
                      >{n.kind}</text>
                    )}
                  </g>
                );
              })}
            </g>
          </>
        )}
      </svg>

      {phase === "empty" && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="pointer-events-auto max-w-sm rounded-lg border border-rule bg-card/95 px-6 py-5 text-center backdrop-blur">
            <div className="display text-[22px] leading-tight">Empty graph</div>
            <p className="mt-1.5 text-[13px] text-ink-muted">
              Load an example dataset or drop a file to see the graph populate.
            </p>
            <button
              onClick={onTryDemo}
              className="mono mt-4 rounded border border-rule bg-foreground px-3 py-1.5 text-[11px] uppercase tracking-[0.12em] text-background hover:-translate-y-px transition-transform"
            >
              try meeting transcript →
            </button>
          </div>
        </div>
      )}

      {phase === "loading" && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3">
          <div className="mono text-[11px] uppercase tracking-[0.14em] text-ink-muted pg-anim-step">
            {loadingText}
          </div>
          <div className="h-[3px] w-[220px] overflow-hidden rounded bg-surface">
            <div className="h-full bg-accent transition-all duration-300" style={{ width: `${loadingPct}%` }} />
          </div>
          <div className="mono text-[10px] text-ink-muted">{loadingPct}%</div>
        </div>
      )}
    </div>
  );
}
