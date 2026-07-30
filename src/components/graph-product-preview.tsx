import { motion } from "framer-motion";

/**
 * Static, marketing-only preview of the /playground page.
 * Mirrors its 3-column IDE layout: data sources · graph canvas · node inspector.
 * No real functionality — this is a screenshot-like mockup.
 */

type PreviewNode = {
  id: string;
  x: number;
  y: number;
  r: number;
  color: string;
  label: string;
  kind?: string;
};

type PreviewEdge = { from: string; to: string; label?: string };

const NODES: PreviewNode[] = [
  { id: "churn",    x: 520, y: 300, r: 22, color: "#ff7a4d", label: "Customer Churn", kind: "concept" },
  { id: "acme",     x: 250, y: 180, r: 18, color: "#7c89ff", label: "Acme Corp",       kind: "customer" },
  { id: "jane",     x: 210, y: 380, r: 16, color: "#74d0ff", label: "Jane Park",       kind: "person" },
  { id: "q3call",   x: 470, y: 520, r: 17, color: "#ff7a8a", label: "Q3 Earnings Call", kind: "audio" },
  { id: "pricing",  x: 800, y: 200, r: 18, color: "#ffc46b", label: "Pricing Forecast", kind: "document" },
  { id: "renewal",  x: 830, y: 430, r: 16, color: "#9be59b", label: "Renewal Risk",     kind: "concept" },
  { id: "north",    x: 380, y: 90,  r: 13, color: "#9aa3b2", label: "North America",    kind: "region" },
];

const EDGES: PreviewEdge[] = [
  { from: "acme",    to: "churn",   label: "signals" },
  { from: "jane",    to: "churn",   label: "mentions" },
  { from: "q3call",  to: "churn",   label: "cites" },
  { from: "pricing", to: "churn",   label: "predicts" },
  { from: "renewal", to: "churn",   label: "linked_to" },
  { from: "acme",    to: "north",   label: "in" },
  { from: "acme",    to: "jane",    label: "employs" },
  { from: "pricing", to: "renewal", label: "informs" },
];

const SELECTED = "churn";

export function GraphProductPreview() {
  const ease = [0.16, 1, 0.3, 1] as const;
  const byId = Object.fromEntries(NODES.map((n) => [n.id, n]));
  const selectedNode = byId[SELECTED];

  return (
    <div className="relative w-full">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease }}
        className="rounded-2xl border border-rule bg-card shadow-[0_30px_80px_-40px_rgba(0,0,0,0.35)] overflow-hidden"
      >
        {/* header */}
        <div className="flex flex-wrap items-center gap-3 border-b border-rule bg-card px-4 py-3">
          <span className="mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">playground · beta</span>
          <span className="mono inline-flex items-center gap-1.5 rounded-full border border-rule px-2.5 py-0.5 text-[10px] text-ink-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-dot" /> ready
          </span>
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden items-center gap-3 sm:flex">
              {[
                { k: "nodes", v: "7" },
                { k: "edges", v: "8" },
                { k: "sources", v: "4" },
              ].map((s) => (
                <div key={s.k} className="rounded border border-rule px-2 py-1 leading-none">
                  <div className="mono text-[9px] uppercase tracking-[0.14em] text-ink-muted">{s.k}</div>
                  <div className="mono mt-0.5 text-[12px] tabular-nums">{s.v}</div>
                </div>
              ))}
            </div>
            <span className="mono rounded border border-rule px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-ink-muted">reset</span>
            <span className="mono rounded bg-foreground px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-background">export graph →</span>
          </div>
        </div>

        {/* 3-column layout */}
        <div className="grid gap-3 p-3 md:grid-cols-[200px_minmax(0,1fr)_220px]">
          {/* LEFT: data sources */}
          <aside className="hidden rounded-lg border border-rule bg-background md:block">
            <div className="border-b border-rule px-3 py-2.5">
              <div className="mono text-[9px] uppercase tracking-[0.18em] text-ink-muted">data sources</div>
            </div>
            <div className="space-y-3 p-3">
              <div className="flex flex-col items-center gap-1 rounded-md border border-dashed border-rule px-2 py-4 text-center">
                <span className="mono text-[16px] text-ink-muted">↑</span>
                <span className="mono text-[9px] uppercase tracking-[0.12em] text-ink-muted">drop files</span>
                <span className="mono text-[8px] text-ink-muted/70">pdf · csv · mp3 · png</span>
              </div>
              <div>
                <div className="mono text-[9px] uppercase tracking-[0.14em] text-ink-muted">modalities</div>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {[
                    { g: "T", l: "text", on: true },
                    { g: "▦", l: "table", on: true },
                    { g: "◐", l: "image", on: false },
                    { g: "♪", l: "audio", on: true },
                    { g: "▶", l: "video", on: false },
                  ].map((m) => (
                    <span
                      key={m.l}
                      className={`mono inline-flex items-center gap-1 rounded-sm border px-1.5 py-0.5 text-[9px] ${
                        m.on ? "border-accent/40 bg-accent/10 text-accent" : "border-rule text-ink-muted"
                      }`}
                    >
                      <span aria-hidden>{m.g}</span>{m.l}
                    </span>
                  ))}
                </div>
              </div>
              <div className="border-t border-rule" />
              <div>
                <div className="mono text-[9px] uppercase tracking-[0.14em] text-ink-muted">ingested files</div>
                <div className="mt-1.5 space-y-1">
                  {[
                    { n: "q3_earnings.mp3", m: "audio · 38m", ok: true },
                    { n: "pricing_fc.pdf", m: "doc · 12p", ok: true },
                    { n: "accounts.csv", m: "table · 1.2k", ok: true },
                    { n: "signals.json", m: "json · 84kb", ok: true },
                  ].map((f) => (
                    <div key={f.n} className="flex items-center justify-between rounded-sm border border-rule px-2 py-1">
                      <div className="min-w-0">
                        <div className="mono truncate text-[10px] text-foreground">{f.n}</div>
                        <div className="mono truncate text-[9px] text-ink-muted">{f.m}</div>
                      </div>
                      <span className="mono text-[9px] text-[color:var(--pg-green,#7bd88f)]">ok</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* CENTER: graph + query */}
          <div className="min-w-0 space-y-3">
            <div className="relative overflow-hidden rounded-lg border border-rule bg-background">
              <svg
                viewBox="0 0 1040 620"
                preserveAspectRatio="xMidYMid meet"
                className="pg-grid-bg block w-full h-[280px] sm:h-[380px] lg:h-[440px]"
                role="img"
                aria-label="Knowledge graph preview"
              >
                {/* edges */}
                <g>
                  {EDGES.map((e, i) => {
                    const a = byId[e.from];
                    const b = byId[e.to];
                    const isIncident = e.from === SELECTED || e.to === SELECTED;
                    return (
                      <line
                        key={i}
                        x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                        stroke="var(--accent)"
                        strokeOpacity={isIncident ? 1 : 0.35}
                        strokeWidth={isIncident ? 1.4 : 1}
                        strokeDasharray="5 5"
                      />
                    );
                  })}
                </g>
                {/* nodes */}
                <g>
                  {NODES.map((n) => {
                    const isSel = n.id === SELECTED;
                    const r = n.r + (isSel ? 2 : 0);
                    return (
                      <g key={n.id}>
                        {isSel && (
                          <circle cx={n.x} cy={n.y} r={r + 10} fill={n.color} opacity={0.18} />
                        )}
                        <circle cx={n.x} cy={n.y} r={r} fill="var(--background)" stroke={n.color} strokeWidth={isSel ? 2.2 : 1.6} />
                        <circle cx={n.x} cy={n.y} r={r * 0.4} fill={n.color} />
                        <text x={n.x} y={n.y + r + 16} textAnchor="middle" style={{ fontSize: 13, fill: "var(--ink,currentColor)", fontWeight: isSel ? 600 : 500 }}>
                          {n.label}
                        </text>
                        {isSel && (
                          <text x={n.x} y={n.y + r + 30} textAnchor="middle" className="mono" style={{ fontSize: 10, fill: "var(--ink-muted)", letterSpacing: "0.14em" }}>
                            {n.kind}
                          </text>
                        )}
                      </g>
                    );
                  })}
                </g>
              </svg>
            </div>

            {/* Query panel */}
            <div className="rounded-lg border border-rule bg-background">
              <div className="border-b border-rule px-3 py-2">
                <div className="mono text-[9px] uppercase tracking-[0.18em] text-ink-muted">query the graph</div>
              </div>
              <div className="p-3">
                <div className="flex gap-2">
                  <div className="mono flex flex-1 items-center gap-2 rounded border border-rule bg-card px-2.5 py-1.5">
                    <span className="text-ink-muted">›</span>
                    <span className="text-[11px] text-foreground">what signals predict churn?</span>
                  </div>
                  <span className="mono rounded bg-foreground px-2.5 py-1.5 text-[10px] uppercase tracking-[0.12em] text-background">query →</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {["show related people", "top mentions", "cite sources"].map((q) => (
                    <span key={q} className="mono rounded-sm border border-rule px-1.5 py-0.5 text-[9px] text-ink-muted">{q}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: inspector */}
          <aside className="hidden rounded-lg border border-rule bg-background md:block">
            <div className="flex items-center justify-between border-b border-rule px-3 py-2.5">
              <div className="mono text-[9px] uppercase tracking-[0.18em] text-ink-muted">node inspector</div>
              <span className="mono text-[11px] text-ink-muted">✕</span>
            </div>
            <div className="space-y-3 p-3">
              <div className="flex items-start gap-2">
                <span className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full" style={{ background: selectedNode.color }} />
                <div className="min-w-0">
                  <div className="text-[13px] font-semibold leading-tight">{selectedNode.label}</div>
                  <div className="mono mt-0.5 text-[9px] uppercase tracking-[0.14em] text-ink-muted">{selectedNode.kind}</div>
                </div>
              </div>
              <div>
                <div className="mono text-[9px] uppercase tracking-[0.14em] text-ink-muted">relations</div>
                <div className="mt-1.5 space-y-1">
                  {[
                    { l: "signals", n: "Acme Corp", c: "#7c89ff" },
                    { l: "cites", n: "Q3 Earnings Call", c: "#ff7a8a" },
                    { l: "predicts", n: "Pricing Forecast", c: "#ffc46b" },
                    { l: "linked_to", n: "Renewal Risk", c: "#9be59b" },
                  ].map((r) => (
                    <div key={r.n} className="flex items-center justify-between rounded-sm border border-rule px-2 py-1">
                      <div className="flex min-w-0 items-center gap-1.5">
                        <span className="h-2 w-2 flex-shrink-0 rounded-full" style={{ background: r.c }} />
                        <span className="truncate text-[11px]">{r.n}</span>
                      </div>
                      <span className="mono text-[9px] uppercase tracking-[0.12em] text-ink-muted">{r.l}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="mono text-[9px] uppercase tracking-[0.14em] text-ink-muted">source</div>
                <div className="mt-1.5 rounded-sm border border-rule bg-card p-2 text-[11px] leading-snug text-ink-muted">
                  "…renewal risk rose 12% among mid-market accounts after the pricing change…"
                </div>
              </div>
            </div>
          </aside>
        </div>
      </motion.div>
    </div>
  );
}
