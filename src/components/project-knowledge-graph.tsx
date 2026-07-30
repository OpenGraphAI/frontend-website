import { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import type { MockNode, MockEdge } from "@/lib/mock-graph";

type NodeKind = MockNode["kind"];
type SimNode = MockNode & d3.SimulationNodeDatum;
type SimLink = d3.SimulationLinkDatum<SimNode> & {
  source: string | SimNode;
  target: string | SimNode;
  label?: string;
};

type Props = {
  nodes: ReadonlyArray<MockNode>;
  edges: ReadonlyArray<MockEdge>;
  projectName?: string;
  height?: number;
  className?: string;
};

const ACCENT = "var(--color-accent)";

const KIND_STYLE: Record<NodeKind, { r: number; fill: string; label: string }> = {
  doc:     { r: 20, fill: "#f4c47a", label: "Document" },
  entity:  { r: 16, fill: "#c96a4a", label: "Entity" },
  concept: { r: 12, fill: "#8fb8ff", label: "Concept" },
};

function endpointId(v: string | SimNode): string {
  return typeof v === "string" ? v : v.id;
}

// Deterministic small-hash for seeded layout so the same filenames always land
// in the same starting positions.
function seedFromNodes(nodes: ReadonlyArray<MockNode>): number {
  let h = 2166136261;
  for (const n of nodes) {
    for (let i = 0; i < n.id.length; i++) {
      h ^= n.id.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
  }
  // Map to (0, 1) — d3.randomLcg requires a seed in that range.
  const v = (h >>> 0) / 0xffffffff;
  return v === 0 ? 0.123456 : v;
}

export function ProjectKnowledgeGraph({
  nodes,
  edges,
  projectName,
  height = 440,
  className = "",
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const svgSelRef = useRef<d3.Selection<SVGSVGElement, unknown, null, undefined> | null>(null);
  const widthRef = useRef<number>(800);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);

  // Clear selection if the selected node disappears (e.g. source removed).
  useEffect(() => {
    if (selectedId && !nodes.some((n) => n.id === selectedId)) setSelectedId(null);
  }, [nodes, selectedId]);

  const neighborhood = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const n of nodes) map.set(n.id, new Set());
    for (const e of edges) {
      map.get(e.from)?.add(e.to);
      map.get(e.to)?.add(e.from);
    }
    return map;
  }, [nodes, edges]);

  const prefersReducedMotion =
    typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    const container = containerRef.current;
    const svgEl = svgRef.current;
    if (!container || !svgEl) return;
    if (nodes.length === 0) return;

    // Clone inputs so d3 mutations never touch caller data.
    const simNodes: SimNode[] = nodes.map((n) => ({ ...n }));
    const simLinks: SimLink[] = edges.map((e) => ({ source: e.from, target: e.to, label: e.label }));

    const rng = d3.randomLcg(seedFromNodes(nodes));
    let width = container.clientWidth || 800;
    widthRef.current = width;

    // Approximate rendered footprint of a node label. The label sits directly
    // below the circle, so the collision radius has to account for label
    // half-width or documents pack together and their names overlap. Font-size
    // 11 in ui-monospace ≈ 6.6px per glyph.
    const CHAR_W = 6.6;
    const isNarrow = () => widthRef.current < 520;
    const maxCharsFor = (kind: NodeKind) => {
      const narrow = isNarrow();
      if (kind === "doc") return narrow ? 10 : 18;
      if (kind === "entity") return narrow ? 12 : 20;
      return narrow ? 14 : 22;
    };
    const truncate = (label: string, kind: NodeKind) => {
      const max = maxCharsFor(kind);
      return label.length > max ? label.slice(0, Math.max(1, max - 1)) + "…" : label;
    };
    const labelHalfWidth = (d: SimNode) => (truncate(d.label, d.kind).length * CHAR_W) / 2;
    const collideRadius = (d: SimNode) =>
      Math.max(KIND_STYLE[d.kind].r + 14, labelHalfWidth(d) + 6);
    const linkDistance = (l: SimLink) => {
      const s = typeof l.source === "object" ? (l.source as SimNode) : null;
      const t = typeof l.target === "object" ? (l.target as SimNode) : null;
      const pad = (s ? labelHalfWidth(s) : 30) + (t ? labelHalfWidth(t) : 30);
      const base = isNarrow() ? 60 : 100;
      return base + pad;
    };
    const chargeStrength = (d: SimNode) => {
      const base = isNarrow() ? -260 : -420;
      // Documents carry the widest labels, so they push harder.
      return d.kind === "doc" ? base * 1.35 : d.kind === "entity" ? base : base * 0.85;
    };

    simNodes.forEach((n, i) => {
      const angle = (i / simNodes.length) * Math.PI * 2;
      const radius = Math.min(width, height) * 0.28;
      n.x = width / 2 + Math.cos(angle) * radius + (rng() - 0.5) * 40;
      n.y = height / 2 + Math.sin(angle) * radius + (rng() - 0.5) * 40;
    });

    const svg = d3.select(svgEl);
    svgSelRef.current = svg;
    svg.attr("viewBox", `0 0 ${width} ${height}`);

    const defs = svg.append("defs");
    const filter = defs
      .append("filter")
      .attr("id", "pkg-selected-shadow")
      .attr("x", "-50%").attr("y", "-50%").attr("width", "200%").attr("height", "200%");
    filter.append("feGaussianBlur").attr("in", "SourceAlpha").attr("stdDeviation", 3);
    filter.append("feOffset").attr("dx", 0).attr("dy", 2).attr("result", "off");
    const merge = filter.append("feMerge");
    merge.append("feMergeNode").attr("in", "off");
    merge.append("feMergeNode").attr("in", "SourceGraphic");

    const root = svg.append("g").attr("class", "pkg-root");
    const linkG = root.append("g").attr("class", "pkg-links");
    const nodeG = root.append("g").attr("class", "pkg-nodes");

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.4, 3])
      .on("zoom", (event) => {
        root.attr("transform", event.transform.toString());
      });
    zoomRef.current = zoom;
    svg.call(zoom);

    const linkSel = linkG
      .selectAll<SVGLineElement, SimLink>("line")
      .data(simLinks)
      .join("line")
      .attr("stroke", "#eaeae4")
      .attr("stroke-opacity", 0.22)
      .attr("stroke-width", 1.1);

    const linkLabelSel = linkG
      .selectAll<SVGTextElement, SimLink>("text")
      .data(simLinks)
      .join("text")
      .attr("text-anchor", "middle")
      .attr("fill", "#9a9a93")
      .attr("font-family", "ui-monospace, SFMono-Regular, Menlo, monospace")
      .attr("font-size", 10)
      .attr("pointer-events", "none")
      .attr("opacity", 0)
      .text((d) => d.label ?? "");

    const nodeSel = nodeG
      .selectAll<SVGGElement, SimNode>("g.pkg-node")
      .data(simNodes, (d) => d.id)
      .join("g")
      .attr("class", "pkg-node")
      .attr("tabindex", 0)
      .attr("role", "button")
      .attr("aria-label", (d) => `${KIND_STYLE[d.kind].label}: ${d.label}`)
      .style("cursor", "pointer")
      .style("outline", "none");

    // Native tooltip surfaces the full untruncated label for both mouse and
    // assistive tech that ignores aria-label on grouped SVG shapes.
    nodeSel.append("title").text((d) => d.label);

    nodeSel
      .append("circle")
      .attr("class", "pkg-focus")
      .attr("r", (d) => KIND_STYLE[d.kind].r + 6)
      .attr("fill", "none")
      .attr("stroke", ACCENT)
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "3 3")
      .attr("opacity", 0);

    nodeSel
      .append("circle")
      .attr("class", "pkg-glow")
      .attr("r", (d) => KIND_STYLE[d.kind].r + 10)
      .attr("fill", "none")
      .attr("stroke", ACCENT)
      .attr("stroke-width", 6)
      .attr("opacity", 0);

    nodeSel
      .append("circle")
      .attr("class", "pkg-outer")
      .attr("r", (d) => KIND_STYLE[d.kind].r + 3)
      .attr("fill", "none")
      .attr("stroke", "rgba(255,255,255,0.06)")
      .attr("stroke-width", 1);

    nodeSel
      .append("circle")
      .attr("class", "pkg-body")
      .attr("r", (d) => KIND_STYLE[d.kind].r)
      .attr("fill", (d) => KIND_STYLE[d.kind].fill)
      .attr("stroke", "rgba(0,0,0,0.6)")
      .attr("stroke-width", 1.2);

    nodeSel
      .append("text")
      .attr("class", "pkg-label")
      .attr("y", (d) => KIND_STYLE[d.kind].r + 14)
      .attr("text-anchor", "middle")
      .attr("fill", "#eaeae4")
      .attr("font-family", "ui-monospace, SFMono-Regular, Menlo, monospace")
      .attr("font-size", 11)
      .attr("pointer-events", "none")
      .text((d) => truncate(d.label, d.kind));

    nodeSel
      .on("click", (_event, d) => {
        setSelectedId((prev) => (prev === d.id ? null : d.id));
      })
      .on("keydown", (event: KeyboardEvent, d) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          setSelectedId((prev) => (prev === d.id ? null : d.id));
        }
      })
      .on("mouseenter", (_event, d) => setHoverId(d.id))
      .on("mouseleave", () => setHoverId(null))
      .on("focus", function (_event, d) {
        d3.select(this).select(".pkg-focus").attr("opacity", 0.9);
        setHoverId(d.id);
      })
      .on("blur", function () {
        d3.select(this).select(".pkg-focus").attr("opacity", 0);
        setHoverId(null);
      });

    const drag = d3
      .drag<SVGGElement, SimNode>()
      .on("start", (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on("end", (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });
    nodeSel.call(drag);

    function renderFrame() {
      linkSel
        .attr("x1", (d) => (typeof d.source === "object" ? d.source.x ?? 0 : 0))
        .attr("y1", (d) => (typeof d.source === "object" ? d.source.y ?? 0 : 0))
        .attr("x2", (d) => (typeof d.target === "object" ? d.target.x ?? 0 : 0))
        .attr("y2", (d) => (typeof d.target === "object" ? d.target.y ?? 0 : 0));
      linkLabelSel
        .attr("x", (d) =>
          typeof d.source === "object" && typeof d.target === "object"
            ? ((d.source.x ?? 0) + (d.target.x ?? 0)) / 2
            : 0,
        )
        .attr("y", (d) =>
          typeof d.source === "object" && typeof d.target === "object"
            ? ((d.source.y ?? 0) + (d.target.y ?? 0)) / 2 - 4
            : 0,
        );
      nodeSel.attr("transform", (d) => `translate(${d.x ?? 0},${d.y ?? 0})`);
    }

    const simulation = d3
      .forceSimulation<SimNode>(simNodes)
      .force(
        "link",
        d3
          .forceLink<SimNode, SimLink>(simLinks)
          .id((d) => d.id)
          .distance(linkDistance)
          .strength(0.55),
      )
      .force("charge", d3.forceManyBody<SimNode>().strength(chargeStrength))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force(
        "collide",
        d3.forceCollide<SimNode>().radius(collideRadius).strength(1),
      )
      .on("tick", renderFrame);

    if (prefersReducedMotion) {
      simulation.alpha(1).tick(300);
      simulation.stop();
      renderFrame();
    }

    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? width;
      if (Math.abs(w - widthRef.current) < 1) return;
      const wasNarrow = isNarrow();
      widthRef.current = w;
      svg.attr("viewBox", `0 0 ${w} ${height}`);
      simulation.force("center", d3.forceCenter(w / 2, height / 2));
      // If we crossed the narrow/wide breakpoint the label footprint changes,
      // so re-render label text and let the forces (which read live width via
      // the closures above) re-settle.
      if (wasNarrow !== isNarrow()) {
        nodeSel.select<SVGTextElement>("text.pkg-label").text((d) => truncate(d.label, d.kind));
      }
      if (prefersReducedMotion) {
        simulation.alpha(0.5).tick(150);
        renderFrame();
      } else {
        simulation.alpha(0.25).restart();
      }
    });
    ro.observe(container);

    return () => {
      ro.disconnect();
      simulation.stop();
      simulation.on("tick", null);
      svg.on(".zoom", null);
      svg.interrupt();
      nodeSel
        .interrupt()
        .on("click", null)
        .on("keydown", null)
        .on("mouseenter", null)
        .on("mouseleave", null)
        .on("focus", null)
        .on("blur", null)
        .on(".drag", null);
      root.interrupt();
      root.remove();
      defs.remove();
      zoomRef.current = null;
      svgSelRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, edges, height]);

  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;
    const focus = selectedId ?? hoverId;
    const focusNeighbors = focus ? neighborhood.get(focus) : null;

    d3.select(svgEl)
      .selectAll<SVGGElement, SimNode>("g.pkg-node")
      .each(function (d) {
        const isFocus = focus === d.id;
        const isSelected = selectedId === d.id;
        const isNeighbor = !!focusNeighbors?.has(d.id);
        const dim = focus != null && !isFocus && !isNeighbor;
        const g = d3.select(this);
        g.attr("opacity", dim ? 0.25 : 1);
        g.select(".pkg-glow").attr("opacity", isSelected ? 0.9 : 0);
        g.select(".pkg-body")
          .attr("stroke-width", isFocus ? 2 : 1.2)
          .attr("stroke", isSelected ? ACCENT : "rgba(0,0,0,0.6)")
          .attr("filter", isSelected ? "url(#pkg-selected-shadow)" : null);
      });

    d3.select(svgEl)
      .selectAll<SVGLineElement, SimLink>("g.pkg-links line")
      .attr("stroke", (d) => {
        if (!focus) return "#eaeae4";
        const a = endpointId(d.source);
        const b = endpointId(d.target);
        return a === focus || b === focus ? ACCENT : "#eaeae4";
      })
      .attr("stroke-opacity", (d) => {
        if (!focus) return 0.22;
        const a = endpointId(d.source);
        const b = endpointId(d.target);
        return a === focus || b === focus ? 0.9 : 0.06;
      })
      .attr("stroke-width", (d) => {
        if (!focus) return 1.1;
        const a = endpointId(d.source);
        const b = endpointId(d.target);
        return a === focus || b === focus ? 1.8 : 1;
      });

    d3.select(svgEl)
      .selectAll<SVGTextElement, SimLink>("g.pkg-links text")
      .attr("opacity", (d) => {
        if (!focus) return 0;
        const a = endpointId(d.source);
        const b = endpointId(d.target);
        return a === focus || b === focus ? 0.9 : 0;
      });
  }, [selectedId, hoverId, neighborhood]);

  const selectedNode = selectedId ? nodes.find((n) => n.id === selectedId) ?? null : null;
  const selectedRelations = selectedId
    ? edges
        .filter((e) => e.from === selectedId || e.to === selectedId)
        .map((e) => {
          const otherId = e.from === selectedId ? e.to : e.from;
          const other = nodes.find((n) => n.id === otherId);
          const outgoing = e.from === selectedId;
          return { label: e.label ?? "related", otherId, otherLabel: other?.label ?? otherId, outgoing };
        })
    : [];

  function resetZoom() {
    const svgSel = svgSelRef.current;
    const zoom = zoomRef.current;
    if (!svgSel || !zoom) return;
    if (prefersReducedMotion) svgSel.call(zoom.transform, d3.zoomIdentity);
    else svgSel.transition().duration(350).call(zoom.transform, d3.zoomIdentity);
  }

  function zoomBy(k: number) {
    const svgSel = svgSelRef.current;
    const zoom = zoomRef.current;
    if (!svgSel || !zoom) return;
    if (prefersReducedMotion) svgSel.call(zoom.scaleBy, k);
    else svgSel.transition().duration(200).call(zoom.scaleBy, k);
  }

  const empty = nodes.length === 0;
  const ariaLabel = projectName
    ? `Knowledge graph for project ${projectName}`
    : "Project knowledge graph";

  return (
    <div className={`min-w-0 ${className}`}>
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-2xl border border-rule bg-[#0d0d0e] shadow-[0_20px_60px_-20px_rgba(0,0,0,0.5)]"
        style={{ height }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 40% at 50% 40%, color-mix(in oklch, var(--color-accent) 12%, transparent), transparent 70%), radial-gradient(80% 60% at 50% 100%, rgba(255,255,255,0.03), transparent 70%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="pointer-events-none absolute left-3 top-2 mono text-[10px] uppercase tracking-[0.18em] text-white/40 sm:left-4 sm:top-3 sm:text-[11px]">
          project-graph
        </div>
        <div className="pointer-events-none absolute right-3 top-2 mono text-[10px] text-white/40 sm:right-4 sm:top-3 sm:text-[11px]">
          {nodes.length}n · {edges.length}e
        </div>

        <svg
          ref={svgRef}
          className="relative h-full w-full touch-pan-y md:touch-none"
          preserveAspectRatio="xMidYMid meet"
          role="group"
          aria-label={ariaLabel}
        />

        {empty && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6">
            <div className="rounded-full border border-white/10 bg-black/60 px-4 py-2 mono text-[11px] uppercase tracking-[0.14em] text-white/60 backdrop-blur">
              add a source to populate this graph
            </div>
          </div>
        )}

        {!empty && (
          <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center gap-1 rounded-full border border-white/10 bg-black/60 p-1 backdrop-blur sm:right-auto max-w-[calc(100%-1.5rem)]">
            <button
              type="button"
              onClick={() => zoomBy(1.25)}
              aria-label="Zoom in"
              className="mono grid h-7 w-7 place-items-center rounded-full text-[13px] text-white/70 hover:bg-white/10 hover:text-white"
            >+</button>
            <button
              type="button"
              onClick={() => zoomBy(1 / 1.25)}
              aria-label="Zoom out"
              className="mono grid h-7 w-7 place-items-center rounded-full text-[13px] text-white/70 hover:bg-white/10 hover:text-white"
            >−</button>
            <button
              type="button"
              onClick={resetZoom}
              aria-label="Reset zoom"
              className="mono rounded-full px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-white/70 hover:bg-white/10 hover:text-white sm:px-3"
            ><span className="sm:hidden">reset</span><span className="hidden sm:inline">reset zoom</span></button>
            <button
              type="button"
              onClick={() => setSelectedId(null)}
              aria-label="Clear selection"
              disabled={!selectedId}
              className="mono rounded-full px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-white/70 hover:bg-white/10 hover:text-white disabled:opacity-30 sm:px-3"
            ><span className="sm:hidden">clear</span><span className="hidden sm:inline">clear selection</span></button>
          </div>
        )}

        {!empty && (
          <div className="pointer-events-none absolute bottom-3 right-3 hidden sm:block rounded-full border border-white/10 bg-black/60 px-3 py-1.5 mono text-[10px] uppercase tracking-[0.14em] text-white/50 backdrop-blur">
            drag · zoom · select a node
          </div>
        )}
      </div>

      {!empty && (
        <p className="mt-2 sm:hidden mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
          drag · pinch or use +/− to zoom · tap a node to inspect
        </p>
      )}

      {/* Compact inspector + legend below the canvas so the graph keeps the full column width. */}
      <div
        aria-live="polite"
        className="mt-3 rounded-2xl border border-rule bg-surface p-4"
      >
        {selectedNode ? (
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full"
                  style={{ background: KIND_STYLE[selectedNode.kind].fill }}
                  aria-hidden
                />
                <span className="mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
                  {KIND_STYLE[selectedNode.kind].label}
                </span>
              </div>
              <h3 className="display mt-1 text-[20px] leading-tight break-words">{selectedNode.label}</h3>
            </div>
            <div className="min-w-0 md:max-w-[60%]">
              <div className="mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
                relationships · {selectedRelations.length}
              </div>
              {selectedRelations.length === 0 ? (
                <p className="mt-1 text-[12.5px] text-ink-muted">No connections in this graph.</p>
              ) : (
                <ul className="mt-1 space-y-1">
                  {selectedRelations.slice(0, 6).map((r, i) => (
                    <li key={i} className="flex items-center justify-between gap-3 text-[12.5px]">
                      <span className="text-ink-muted">
                        {r.outgoing ? "→" : "←"} {r.label}
                      </span>
                      <span className="mono truncate">{r.otherLabel}</span>
                    </li>
                  ))}
                  {selectedRelations.length > 6 && (
                    <li className="mono text-[10px] text-ink-muted">
                      +{selectedRelations.length - 6} more
                    </li>
                  )}
                </ul>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <div className="mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">inspector</div>
              <p className="mt-1 text-[13px] text-ink-muted">
                {empty
                  ? "Add a source to build this project's knowledge graph."
                  : "Select a node to inspect its relationships."}
              </p>
            </div>
            <ul className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] text-ink-muted">
              {(Object.keys(KIND_STYLE) as NodeKind[]).map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ background: KIND_STYLE[t].fill }}
                    aria-hidden
                  />
                  <span>{KIND_STYLE[t].label}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}