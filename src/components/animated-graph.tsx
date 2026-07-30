import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Kind = "entity" | "concept" | "media";
type Node = { id: string; label: string; x: number; y: number; kind: Kind; r: number; meta: string };
type Edge = { from: string; to: string; label?: string };

const SEED: { nodes: Node[]; edges: Edge[] } = {
  nodes: [
    { id: "a", label: "Q3 Report.pdf", x: 0.18, y: 0.30, kind: "media",   r: 22, meta: "12 pages · extracted 18 entities" },
    { id: "b", label: "Revenue",       x: 0.40, y: 0.18, kind: "concept", r: 16, meta: "Concept · 7 mentions across 3 sources" },
    { id: "c", label: "Acme Corp",     x: 0.55, y: 0.42, kind: "entity",  r: 24, meta: "Company · 24 mentions · key entity" },
    { id: "d", label: "earnings.mp3",  x: 0.28, y: 0.66, kind: "media",   r: 18, meta: "4m 12s · 2 speakers · transcribed" },
    { id: "e", label: "Jane Park",     x: 0.70, y: 0.70, kind: "entity",  r: 18, meta: "Person · CFO @ Acme Corp" },
    { id: "f", label: "Forecast",      x: 0.82, y: 0.30, kind: "concept", r: 14, meta: "Concept · +12% YoY projected" },
    { id: "g", label: "chart.png",     x: 0.60, y: 0.12, kind: "media",   r: 14, meta: "Image · revenue trend captioned" },
    { id: "h", label: "Market",        x: 0.88, y: 0.55, kind: "concept", r: 14, meta: "Concept · EU enterprise segment" },
  ],
  edges: [
    { from: "a", to: "b", label: "mentions" },
    { from: "a", to: "c", label: "about" },
    { from: "b", to: "c", label: "metric of" },
    { from: "d", to: "c", label: "spoken by" },
    { from: "d", to: "e", label: "speaker" },
    { from: "c", to: "f", label: "forecast" },
    { from: "g", to: "b", label: "depicts" },
    { from: "c", to: "h", label: "in" },
    { from: "f", to: "h", label: "affects" },
    { from: "e", to: "c", label: "works at" },
  ],
};

type Positioned = Node & { px: number; py: number };

export function AnimatedGraph({ height = 520, interactive = false }: { height?: number; interactive?: boolean }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState({ w: 800, h: height });

  // node positions in svg-px (independent of view transform)
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({});

  // view transform
  const [view, setView] = useState({ k: 1, tx: 0, ty: 0 });

  const [hover, setHover] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  // initialize positions when size known
  useEffect(() => {
    if (!size.w) return;
    setPositions((prev) => {
      const next = { ...prev };
      let changed = false;
      for (const n of SEED.nodes) {
        if (!next[n.id]) {
          next[n.id] = { x: n.x * size.w, y: n.y * size.h };
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [size]);

  // resize observer
  useEffect(() => {
    if (!wrapRef.current) return;
    const ro = new ResizeObserver(([e]) => {
      const w = e.contentRect.width;
      setSize((prev) => {
        if (prev.w === 0) return { w, h: height };
        // rescale positions to new width
        const ratio = w / prev.w;
        if (ratio !== 1) {
          setPositions((pos) => {
            const out: typeof pos = {};
            for (const id in pos) out[id] = { x: pos[id].x * ratio, y: pos[id].y };
            return out;
          });
        }
        return { w, h: height };
      });
    });
    ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, [height]);

  const nodes: Positioned[] = useMemo(
    () => SEED.nodes.map((n) => ({ ...n, px: positions[n.id]?.x ?? n.x * size.w, py: positions[n.id]?.y ?? n.y * size.h })),
    [positions, size]
  );
  const map = useMemo(() => Object.fromEntries(nodes.map((n) => [n.id, n])), [nodes]);

  // ====== interaction ======
  const drag = useRef<
    | { kind: "node"; id: string; offX: number; offY: number; moved: boolean }
    | { kind: "pan"; startX: number; startY: number; tx0: number; ty0: number }
    | null
  >(null);

  const toSvg = useCallback((clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    // undo view transform: world = (screen - rect - t) / k
    const sx = clientX - rect.left;
    const sy = clientY - rect.top;
    return { x: (sx - view.tx) / view.k, y: (sy - view.ty) / view.k };
  }, [view]);

  function onPointerDown(e: React.PointerEvent<SVGSVGElement>) {
    if (!interactive) return;
    const target = e.target as Element;
    const nodeId = target.closest("[data-node-id]")?.getAttribute("data-node-id");
    if (nodeId) {
      const n = map[nodeId];
      const p = toSvg(e.clientX, e.clientY);
      drag.current = { kind: "node", id: nodeId, offX: p.x - n.px, offY: p.y - n.py, moved: false };
    } else {
      drag.current = { kind: "pan", startX: e.clientX, startY: e.clientY, tx0: view.tx, ty0: view.ty };
    }
    (e.target as Element).setPointerCapture?.(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent<SVGSVGElement>) {
    if (!interactive || !drag.current) return;
    if (drag.current.kind === "node") {
      const p = toSvg(e.clientX, e.clientY);
      const id = drag.current.id;
      const nx = Math.max(20, Math.min(size.w - 20, p.x - drag.current.offX));
      const ny = Math.max(20, Math.min(size.h - 20, p.y - drag.current.offY));
      drag.current.moved = true;
      setPositions((pos) => ({ ...pos, [id]: { x: nx, y: ny } }));
    } else {
      setView((v) => ({ ...v, tx: drag.current!.kind === "pan" ? drag.current!.tx0 + (e.clientX - drag.current!.startX) : v.tx, ty: drag.current!.kind === "pan" ? drag.current!.ty0 + (e.clientY - drag.current!.startY) : v.ty }));
    }
  }

  function onPointerUp(e: React.PointerEvent<SVGSVGElement>) {
    if (!drag.current) return;
    if (drag.current.kind === "node" && !drag.current.moved) {
      const id = drag.current.id;
      setSelected((s) => (s === id ? null : id));
    }
    drag.current = null;
    (e.target as Element).releasePointerCapture?.(e.pointerId);
  }

  function onWheel(e: React.WheelEvent<SVGSVGElement>) {
    if (!interactive) return;
    e.preventDefault();
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    const factor = e.deltaY < 0 ? 1.12 : 1 / 1.12;
    setView((v) => {
      const k = Math.min(2.5, Math.max(0.5, v.k * factor));
      const real = k / v.k;
      // keep cursor anchored: new t = s - (s - t) * real
      return { k, tx: sx - (sx - v.tx) * real, ty: sy - (sy - v.ty) * real };
    });
  }

  function reset() {
    setView({ k: 1, tx: 0, ty: 0 });
    setPositions(Object.fromEntries(SEED.nodes.map((n) => [n.id, { x: n.x * size.w, y: n.y * size.h }])));
    setSelected(null);
  }

  const selectedNode = selected ? map[selected] : null;
  const selectedEdges = selected
    ? SEED.edges.filter((e) => e.from === selected || e.to === selected).map((e) => {
        const otherId = e.from === selected ? e.to : e.from;
        return { ...e, other: map[otherId]?.label ?? otherId, dir: e.from === selected ? "→" : "←" };
      })
    : [];

  const highlighted = new Set<string>();
  if (selected) {
    highlighted.add(selected);
    for (const e of SEED.edges) {
      if (e.from === selected) highlighted.add(e.to);
      if (e.to === selected) highlighted.add(e.from);
    }
  } else if (hover) {
    highlighted.add(hover);
    for (const e of SEED.edges) {
      if (e.from === hover) highlighted.add(e.to);
      if (e.to === hover) highlighted.add(e.from);
    }
  }
  const focusOn = selected ?? hover;

  return (
    <div ref={wrapRef} className="relative w-full overflow-hidden rounded-2xl border border-rule bg-surface" style={{ height }}>
      <div className="absolute inset-0 grid-bg opacity-60 pointer-events-none" />

      {/* corner labels */}
      <div className="pointer-events-none absolute left-4 top-3 mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">
        graph.preview
      </div>
      <div className="pointer-events-none absolute right-4 top-3 mono text-[11px] text-ink-muted">
        {nodes.length} nodes · {SEED.edges.length} edges
      </div>

      <svg
        ref={svgRef}
        width={size.w}
        height={size.h}
        className={`relative ${interactive ? "cursor-grab active:cursor-grabbing touch-none" : ""}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={onWheel}
      >
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" className="text-ink-muted" />
          </marker>
        </defs>

        <g transform={`translate(${view.tx} ${view.ty}) scale(${view.k})`}>
          {SEED.edges.map((e, i) => {
            const a = map[e.from], b = map[e.to];
            if (!a || !b) return null;
            const active = focusOn === e.from || focusOn === e.to;
            const dim = focusOn != null && !active;
            return (
              <g key={i} className={active ? "text-accent" : "text-ink-muted"} opacity={dim ? 0.18 : 1}>
                <line
                  x1={a.px} y1={a.py} x2={b.px} y2={b.py}
                  stroke="currentColor"
                  strokeWidth={active ? 1.6 : 1}
                  strokeDasharray="4 6"
                  className={active ? "animate-dash" : ""}
                  opacity={active ? 0.95 : 0.55}
                  markerEnd="url(#arrow)"
                />
                {active && e.label && (
                  <text x={(a.px + b.px) / 2} y={(a.py + b.py) / 2 - 6} textAnchor="middle" className="fill-current mono" fontSize={10 / Math.max(0.8, view.k * 0.9)}>
                    {e.label}
                  </text>
                )}
              </g>
            );
          })}

          {nodes.map((n) => {
            const active = focusOn === n.id;
            const dim = focusOn != null && !highlighted.has(n.id);
            const fill =
              n.kind === "entity" ? "var(--ink)" :
              n.kind === "concept" ? "var(--background)" :
              "var(--color-accent)";
            return (
              <g
                key={n.id}
                data-node-id={n.id}
                transform={`translate(${n.px}, ${n.py})`}
                onMouseEnter={() => interactive && setHover(n.id)}
                onMouseLeave={() => interactive && setHover(null)}
                opacity={dim ? 0.28 : 1}
                className={interactive ? "cursor-pointer" : ""}
              >
                {/* invisible bigger hit target */}
                <circle r={n.r + 10} fill="transparent" />
                <circle
                  r={n.r}
                  fill={fill}
                  stroke="var(--ink)"
                  strokeWidth={active ? 2 : 1.25}
                  className={active ? "" : "animate-drift"}
                  style={{ animationDelay: `${(n.id.charCodeAt(0) % 5) * 0.4}s` }}
                />
                {(n.kind !== "concept" || active) && (
                  <circle r={n.r + 6} fill="none" stroke="var(--color-accent)" strokeWidth={1} opacity={active ? 0.85 : 0} />
                )}
                <text
                  y={n.r + 14}
                  textAnchor="middle"
                  className="mono select-none pointer-events-none"
                  fontSize={11}
                  fill="var(--ink)"
                >
                  {n.label}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Controls */}
      {interactive && (
        <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full border border-rule bg-background/90 p-1 backdrop-blur">
          <CtrlBtn onClick={() => setView((v) => ({ ...v, k: Math.min(2.5, v.k * 1.2) }))} label="+" />
          <CtrlBtn onClick={() => setView((v) => ({ ...v, k: Math.max(0.5, v.k / 1.2) }))} label="−" />
          <CtrlBtn onClick={reset} label="reset" wide />
        </div>
      )}

      {/* Hint */}
      {interactive && !selected && (
        <div className="pointer-events-none absolute bottom-3 right-3 rounded-full border border-rule bg-background/90 px-3 py-1.5 mono text-[10px] uppercase tracking-[0.14em] text-ink-muted backdrop-blur">
          drag nodes · scroll to zoom · click to inspect
        </div>
      )}

      {/* Selected card */}
      {interactive && selectedNode && (
        <div className="absolute right-3 top-12 w-64 rounded-2xl border border-rule bg-background/95 p-4 shadow-lg backdrop-blur animate-fade-in">
          <div className="flex items-start justify-between">
            <div>
              <div className="mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">{selectedNode.kind}</div>
              <div className="display mt-1 text-[20px] leading-tight">{selectedNode.label}</div>
            </div>
            <button
              onClick={() => setSelected(null)}
              className="rounded-full border border-rule px-2 py-0.5 text-[11px] text-ink-muted hover:text-foreground"
              aria-label="close"
            >×</button>
          </div>
          <p className="mt-2 text-[12px] text-ink-muted">{selectedNode.meta}</p>
          <div className="mt-4">
            <div className="mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">relations · {selectedEdges.length}</div>
            <ul className="mt-2 space-y-1.5">
              {selectedEdges.map((e, i) => (
                <li key={i} className="flex items-center justify-between text-[12px]">
                  <span className="text-ink-muted">{e.dir} {e.label}</span>
                  <span className="mono truncate">{e.other}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

function CtrlBtn({ label, onClick, wide = false }: { label: string; onClick: () => void; wide?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`mono rounded-full text-[11px] uppercase tracking-[0.14em] text-ink-muted hover:bg-surface hover:text-foreground ${wide ? "px-3 py-1.5" : "h-7 w-7"}`}
    >
      {label}
    </button>
  );
}
