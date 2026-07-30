import { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import type { ResearchNode, ResearchLink, ResearchNodeType } from "@/data/research-graph";

type SimNode = ResearchNode & d3.SimulationNodeDatum;
type SimLink = d3.SimulationLinkDatum<SimNode> & {
  source: string | SimNode;
  target: string | SimNode;
  label: string;
};

type Props = {
  nodes: ReadonlyArray<ResearchNode>;
  links: ReadonlyArray<ResearchLink>;
  height?: number;
  className?: string;
};

const ACCENT = "var(--color-accent)";

const TYPE_STYLE: Record<ResearchNodeType, { r: number; fill: string; ring: string; label: string }> = {
  institution: { r: 22, fill: "#c96a4a", ring: "rgba(201,106,74,0.35)", label: "Institution" },
  paper:       { r: 18, fill: "#f4c47a", ring: "rgba(244,196,122,0.35)", label: "Research Paper" },
  author:      { r: 16, fill: "#eaeae4", ring: "rgba(234,234,228,0.35)", label: "Author" },
  topic:       { r: 14, fill: "#8fb8ff", ring: "rgba(143,184,255,0.35)", label: "Topic" },
};

function endpointId(v: string | SimNode): string {
  return typeof v === "string" ? v : v.id;
}

export function KnowledgeGraph({ nodes, links, height = 560, className = "" }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const svgSelRef = useRef<d3.Selection<SVGSVGElement, unknown, null, undefined> | null>(null);
  const widthRef = useRef<number>(800);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);

  const neighborhood = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const n of nodes) map.set(n.id, new Set());
    for (const l of links) {
      map.get(l.source)?.add(l.target);
      map.get(l.target)?.add(l.source);
    }
    return map;
  }, [nodes, links]);

  const prefersReducedMotion =
    typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    const container = containerRef.current;
    const svgEl = svgRef.current;
    if (!container || !svgEl) return;

    const simNodes: SimNode[] = nodes.map((n) => ({ ...n }));
    const simLinks: SimLink[] = links.map((l) => ({ ...l }));

    const rng = d3.randomLcg(0.42);
    let width = container.clientWidth || 800;
    widthRef.current = width;
    simNodes.forEach((n, i) => {
      const angle = (i / simNodes.length) * Math.PI * 2;
      const radius = Math.min(width, height) * 0.28;
      n.x = width / 2 + Math.cos(angle) * radius + (rng() - 0.5) * 40;
      n.y = height / 2 + Math.sin(angle) * radius + (rng() - 0.5) * 40;
    });

    const svg = d3.select(svgEl);
    svgSelRef.current = svg;
    svg.attr("viewBox", `0 0 ${width} ${height}`);

    // SVG defs — drop-shadow filter for selected node depth.
    const defs = svg.append("defs");
    const filter = defs
      .append("filter")
      .attr("id", "kg-selected-shadow")
      .attr("x", "-50%").attr("y", "-50%").attr("width", "200%").attr("height", "200%");
    filter.append("feGaussianBlur").attr("in", "SourceAlpha").attr("stdDeviation", 3);
    filter.append("feOffset").attr("dx", 0).attr("dy", 2).attr("result", "off");
    const merge = filter.append("feMerge");
    merge.append("feMergeNode").attr("in", "off");
    merge.append("feMergeNode").attr("in", "SourceGraphic");

    const root = svg.append("g").attr("class", "kg-root");
    const linkG = root.append("g").attr("class", "kg-links");
    const nodeG = root.append("g").attr("class", "kg-nodes");

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
      .text((d) => d.label);

    const nodeSel = nodeG
      .selectAll<SVGGElement, SimNode>("g.kg-node")
      .data(simNodes, (d) => d.id)
      .join("g")
      .attr("class", "kg-node")
      .attr("tabindex", 0)
      .attr("role", "button")
      .attr("aria-label", (d) => `${TYPE_STYLE[d.type].label}: ${d.label}`)
      .style("cursor", "pointer")
      .style("outline", "none");

    // Keyboard focus ring (visible via focus-visible on the <g>).
    nodeSel
      .append("circle")
      .attr("class", "kg-focus")
      .attr("r", (d) => TYPE_STYLE[d.type].r + 6)
      .attr("fill", "none")
      .attr("stroke", ACCENT)
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "3 3")
      .attr("opacity", 0);

    nodeSel
      .append("circle")
      .attr("class", "kg-glow")
      .attr("r", (d) => TYPE_STYLE[d.type].r + 10)
      .attr("fill", "none")
      .attr("stroke", ACCENT)
      .attr("stroke-width", 6)
      .attr("opacity", 0);

    nodeSel
      .append("circle")
      .attr("class", "kg-outer")
      .attr("r", (d) => TYPE_STYLE[d.type].r + 3)
      .attr("fill", "none")
      .attr("stroke", "rgba(255,255,255,0.06)")
      .attr("stroke-width", 1);

    nodeSel
      .append("circle")
      .attr("class", "kg-body")
      .attr("r", (d) => TYPE_STYLE[d.type].r)
      .attr("fill", (d) => TYPE_STYLE[d.type].fill)
      .attr("stroke", "rgba(0,0,0,0.6)")
      .attr("stroke-width", 1.2);

    nodeSel
      .append("text")
      .attr("class", "kg-label")
      .attr("y", (d) => TYPE_STYLE[d.type].r + 14)
      .attr("text-anchor", "middle")
      .attr("fill", "#eaeae4")
      .attr("font-family", "ui-monospace, SFMono-Regular, Menlo, monospace")
      .attr("font-size", 11)
      .attr("pointer-events", "none")
      .text((d) => d.label);

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
        d3.select(this).select(".kg-focus").attr("opacity", 0.9);
        setHoverId(d.id);
      })
      .on("blur", function () {
        d3.select(this).select(".kg-focus").attr("opacity", 0);
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
          .distance(110)
          .strength(0.5),
      )
      .force("charge", d3.forceManyBody().strength(-320))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force(
        "collide",
        d3.forceCollide<SimNode>().radius((d) => TYPE_STYLE[d.type].r + 12),
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
      widthRef.current = w;
      svg.attr("viewBox", `0 0 ${w} ${height}`);
      simulation.force("center", d3.forceCenter(w / 2, height / 2));
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
  }, [nodes, links, height]);

  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;
    const focus = selectedId ?? hoverId;
    const focusNeighbors = focus ? neighborhood.get(focus) : null;

    d3.select(svgEl)
      .selectAll<SVGGElement, SimNode>("g.kg-node")
      .each(function (d) {
        const isFocus = focus === d.id;
        const isSelected = selectedId === d.id;
        const isNeighbor = !!focusNeighbors?.has(d.id);
        const dim = focus != null && !isFocus && !isNeighbor;
        const g = d3.select(this);
        g.attr("opacity", dim ? 0.25 : 1);
        g.select(".kg-glow").attr("opacity", isSelected ? 0.9 : 0);
        g.select(".kg-body")
          .attr("stroke-width", isFocus ? 2 : 1.2)
          .attr("stroke", isSelected ? ACCENT : "rgba(0,0,0,0.6)")
          .attr("filter", isSelected ? "url(#kg-selected-shadow)" : null);
      });

    d3.select(svgEl)
      .selectAll<SVGLineElement, SimLink>("g.kg-links line")
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
      .selectAll<SVGTextElement, SimLink>("g.kg-links text")
      .attr("opacity", (d) => {
        if (!focus) return 0;
        const a = endpointId(d.source);
        const b = endpointId(d.target);
        return a === focus || b === focus ? 0.9 : 0;
      });
  }, [selectedId, hoverId, neighborhood]);

  const selectedNode = selectedId ? nodes.find((n) => n.id === selectedId) ?? null : null;
  const selectedRelations = selectedId
    ? links
        .filter((l) => l.source === selectedId || l.target === selectedId)
        .map((l) => {
          const otherId = l.source === selectedId ? l.target : l.source;
          const other = nodes.find((n) => n.id === otherId);
          const outgoing = l.source === selectedId;
          return { label: l.label, otherId, otherLabel: other?.label ?? otherId, outgoing };
        })
    : [];

  function resetZoom() {
    const svgSel = svgSelRef.current;
    const zoom = zoomRef.current;
    if (!svgSel || !zoom) return;
    if (prefersReducedMotion) {
      svgSel.call(zoom.transform, d3.zoomIdentity);
    } else {
      svgSel.transition().duration(350).call(zoom.transform, d3.zoomIdentity);
    }
  }

  function zoomBy(k: number) {
    const svgSel = svgSelRef.current;
    const zoom = zoomRef.current;
    if (!svgSel || !zoom) return;
    if (prefersReducedMotion) {
      svgSel.call(zoom.scaleBy, k);
    } else {
      svgSel.transition().duration(200).call(zoom.scaleBy, k);
    }
  }

  return (
    <div className={`grid gap-4 md:grid-cols-[minmax(0,1fr)_320px] ${className}`}>
      <div className="min-w-0">
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
            knowledge-graph
          </div>
          <div className="pointer-events-none absolute right-3 top-2 mono text-[10px] text-white/40 sm:right-4 sm:top-3 sm:text-[11px]">
            {nodes.length}n · {links.length}e
          </div>

          <svg
            ref={svgRef}
            className="relative h-full w-full touch-pan-y md:touch-none"
            preserveAspectRatio="xMidYMid meet"
            role="group"
            aria-label="Interactive research knowledge graph"
          />

          {/* Controls */}
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

          <div className="pointer-events-none absolute bottom-3 right-3 hidden sm:block rounded-full border border-white/10 bg-black/60 px-3 py-1.5 mono text-[10px] uppercase tracking-[0.14em] text-white/50 backdrop-blur">
            drag · zoom · select an entity
          </div>
        </div>
        <p className="mt-2 sm:hidden mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
          Drag nodes · pinch or use +/− to zoom · tap a node to inspect it
        </p>
      </div>

      <aside
        aria-live="polite"
        className="rounded-2xl border border-rule bg-surface p-5"
      >
        {selectedNode ? (
          <>
            <div className="flex items-center gap-2">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ background: TYPE_STYLE[selectedNode.type].fill }}
                aria-hidden
              />
              <span className="mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
                {TYPE_STYLE[selectedNode.type].label}
              </span>
            </div>
            <h3 className="display mt-2 text-[24px] leading-tight">{selectedNode.label}</h3>
            {selectedNode.description && (
              <p className="mt-2 text-[13px] text-ink-muted">{selectedNode.description}</p>
            )}
            <div className="mt-5">
              <div className="mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
                relationships · {selectedRelations.length}
              </div>
              <ul className="mt-2 space-y-1.5">
                {selectedRelations.map((r, i) => (
                  <li key={i} className="flex items-center justify-between gap-3 text-[12.5px]">
                    <span className="text-ink-muted">
                      {r.outgoing ? "→" : "←"} {r.label}
                    </span>
                    <span className="mono truncate">{r.otherLabel}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <>
            <div className="mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
              inspector
            </div>
            <h3 className="display mt-2 text-[22px] leading-tight">Select an entity</h3>
            <p className="mt-2 text-[13px] text-ink-muted">
              Drag nodes, zoom, or select an entity to inspect its relationships.
            </p>
            <ul className="mt-5 space-y-2 text-[12px] text-ink-muted">
              {(Object.keys(TYPE_STYLE) as ResearchNodeType[]).map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: TYPE_STYLE[t].fill }} aria-hidden />
                  <span>{TYPE_STYLE[t].label}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </aside>
    </div>
  );
}