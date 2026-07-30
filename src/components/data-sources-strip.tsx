import { Reveal } from "@/components/reveal";
import { useEffect, useRef, useState } from "react";

type Pill = { label: string; tag: string; icon: React.ReactNode; iconColor: string };

const INPUTS: Pill[] = [
  { label: "tables", tag: "ROWS", iconColor: "text-orange-500", icon: <TableIcon /> },
  { label: "texts", tag: "DOCS", iconColor: "text-sky-600", icon: <TextIcon /> },
  { label: "images", tag: "PNG", iconColor: "text-indigo-600", icon: <ImageIcon /> },
  { label: "audio", tag: "WAV", iconColor: "text-emerald-600", icon: <AudioIcon /> },
  { label: "video", tag: "MP4", iconColor: "text-pink-500", icon: <VideoIcon /> },
  { label: "html", tag: "DOM", iconColor: "text-blue-600", icon: <CodeIcon /> },
  { label: "APIs", tag: "JSON", iconColor: "text-accent", icon: <ApiIcon /> },
];

const OUTPUTS: Pill[] = [
  { label: "graph.json", tag: "NODES·EDGES", iconColor: "text-accent", icon: <BraceIcon /> },
  { label: "graph.html", tag: "EXPLORER", iconColor: "text-accent", icon: <DiamondIcon /> },
  { label: "skills.md", tag: "AGENT TOOLS", iconColor: "text-accent", icon: <HashIcon /> },
];

export function DataSourcesStrip() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const hubRef = useRef<HTMLDivElement>(null);
  const inputRefs = useRef<(HTMLDivElement | null)[]>([]);
  const outputRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [paths, setPaths] = useState<{ d: string; kind: "in" | "out" }[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    function measure() {
      const wrap = wrapRef.current;
      const hub = hubRef.current;
      if (!wrap || !hub) return;
      const wr = wrap.getBoundingClientRect();
      setSize({ w: wr.width, h: wr.height });
      const hr = hub.getBoundingClientRect();
      const hubLeft = { x: hr.left - wr.left, y: hr.top - wr.top + hr.height / 2 };
      const hubRight = { x: hr.right - wr.left, y: hr.top - wr.top + hr.height / 2 };

      const next: { d: string; kind: "in" | "out" }[] = [];
      inputRefs.current.forEach((el) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const p = { x: r.right - wr.left, y: r.top - wr.top + r.height / 2 };
        const cx = (p.x + hubLeft.x) / 2;
        next.push({ d: `M ${p.x} ${p.y} C ${cx} ${p.y}, ${cx} ${hubLeft.y}, ${hubLeft.x} ${hubLeft.y}`, kind: "in" });
      });
      outputRefs.current.forEach((el) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const p = { x: r.left - wr.left, y: r.top - wr.top + r.height / 2 };
        const cx = (p.x + hubRight.x) / 2;
        next.push({
          d: `M ${hubRight.x} ${hubRight.y} C ${cx} ${hubRight.y}, ${cx} ${p.y}, ${p.x} ${p.y}`,
          kind: "out",
        });
      });
      setPaths(next);
    }
    measure();
    const ro = new ResizeObserver(measure);
    if (wrapRef.current) ro.observe(wrapRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <section className="mt-24 border-y border-rule bg-surface">
      <div className="mx-auto max-w-[1280px] px-6 py-16">
        <Reveal>
          <div
            ref={wrapRef}
            className="relative overflow-hidden rounded-2xl border border-rule bg-background"
            style={{
              backgroundImage:
                "linear-gradient(to right, color-mix(in oklab, var(--foreground) 6%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--foreground) 6%, transparent) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          >
            {/* corner labels */}
            <div className="pointer-events-none absolute left-6 top-5 mono text-[11px] uppercase tracking-[0.22em] text-ink-muted">
              inputs
            </div>
            <div className="pointer-events-none absolute right-6 top-5 mono text-[11px] uppercase tracking-[0.22em] text-ink-muted">
              outputs
            </div>

            {/* connectors */}
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              width={size.w}
              height={size.h}
              viewBox={`0 0 ${Math.max(size.w, 1)} ${Math.max(size.h, 1)}`}
              fill="none"
            >
              {paths.map((p, i) => (
                <g key={i}>
                  <path
                    d={p.d}
                    stroke="var(--accent)"
                    strokeWidth="1.25"
                    strokeDasharray="4 5"
                    strokeOpacity="0.55"
                    strokeLinecap="round"
                    className="animate-dash"
                  />
                  <circle r="2.5" fill="var(--accent)">
                    <animateMotion
                      dur={p.kind === "in" ? "2.2s" : "1.8s"}
                      begin={`${(i * 0.18).toFixed(2)}s`}
                      repeatCount="indefinite"
                      path={p.d}
                      rotate="auto"
                    />
                    <animate
                      attributeName="opacity"
                      values="0;1;1;0"
                      keyTimes="0;0.15;0.85;1"
                      dur={p.kind === "in" ? "2.2s" : "1.8s"}
                      begin={`${(i * 0.18).toFixed(2)}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                </g>
              ))}
            </svg>

            <div className="relative grid grid-cols-1 items-center gap-8 px-6 pb-10 pt-16 md:grid-cols-[minmax(180px,220px)_1fr_minmax(180px,240px)] md:px-10">
              {/* Inputs column */}
              <div className="flex flex-col gap-3">
                {INPUTS.map((p, i) => (
                  <div
                    key={p.label}
                    ref={(el) => {
                      inputRefs.current[i] = el;
                    }}
                    className="flex items-center justify-between rounded-full border border-rule bg-background px-4 py-2.5 shadow-[0_1px_0_rgba(0,0,0,0.02)]"
                  >
                    <span className="flex items-center gap-2.5">
                      <span className={p.iconColor}>{p.icon}</span>
                      <span className="mono text-[13px] text-foreground">{p.label}</span>
                    </span>
                    <span className="mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">{p.tag}</span>
                  </div>
                ))}
              </div>

              {/* Hub */}
              <div className="flex items-center justify-center">
                <div
                  ref={hubRef}
                  className="relative w-full max-w-[300px] rounded-2xl border border-rule bg-black p-6 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.25)]"
                >
                  <div className="flex items-center justify-between">
                    <span className="display text-[20px] leading-none text-white">
                      OpenGraph<span className="italic text-white/60">AI</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2 py-0.5 mono text-[10px] uppercase tracking-[0.14em] text-emerald-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse-dot" />
                      live
                    </span>
                  </div>
                  <HubGraph />
                  <div className="mt-4 text-center mono text-[13px] text-accent">extract · link · query</div>
                  <div className="mt-1 text-center text-[12px] text-white/60">entity → relation → context graph</div>
                </div>
              </div>

              {/* Outputs column */}
              <div className="flex flex-col gap-3">
                {OUTPUTS.map((p, i) => (
                  <div
                    key={p.label}
                    ref={(el) => {
                      outputRefs.current[i] = el;
                    }}
                    className="flex items-center justify-between rounded-full border border-accent/30 bg-accent/5 px-4 py-2.5"
                  >
                    <span className="flex items-center gap-2.5">
                      <span className={p.iconColor}>{p.icon}</span>
                      <span className="mono text-[13px] text-foreground">{p.label}</span>
                    </span>
                    <span className="mono text-[10px] uppercase tracking-[0.16em] text-ink-muted text-right leading-tight">
                      {p.tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function HubGraph() {
  return (
    <svg viewBox="0 0 200 120" className="mt-5 h-24 w-full" fill="none">
      <g stroke="var(--accent)" strokeWidth="1.25">
        <line x1="100" y1="60" x2="60" y2="30" />
        <line x1="100" y1="60" x2="140" y2="30" />
        <line x1="100" y1="60" x2="45" y2="70" />
        <line x1="100" y1="60" x2="155" y2="70" />
        <line x1="100" y1="60" x2="75" y2="100" />
        <line x1="100" y1="60" x2="125" y2="100" />
      </g>
      <g fill="var(--background)" stroke="var(--accent)" strokeWidth="1.25">
        <circle cx="60" cy="30" r="5" />
        <circle cx="140" cy="30" r="5" />
        <circle cx="45" cy="70" r="5" />
        <circle cx="155" cy="70" r="5" />
        <circle cx="75" cy="100" r="5" />
        <circle cx="125" cy="100" r="5" />
      </g>
      <circle cx="100" cy="60" r="6" fill="var(--accent)" />
    </svg>
  );
}

function TableIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="3" width="12" height="10" rx="1.5" />
      <path d="M2 7h12M2 10h12M6 3v10M10 3v10" />
    </svg>
  );
}
function TextIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 4h10M8 4v9M5 13h6" />
    </svg>
  );
}
function ImageIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="8" cy="8" r="6" />
      <path d="M2 8h12M8 2v12" />
    </svg>
  );
}
function AudioIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 9l2-3 2 6 2-9 2 12 2-7 2 4" />
    </svg>
  );
}
function VideoIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M4 3l9 5-9 5V3z" />
    </svg>
  );
}
function CodeIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 4L2 8l3 4M11 4l3 4-3 4" />
    </svg>
  );
}
function ApiIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="5" cy="8" r="3" />
      <circle cx="11" cy="8" r="3" />
    </svg>
  );
}
function BraceIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 3C4 3 4 5 4 6.5S3 8 2 8s1 0 2 0 2 .5 2 2S4 13 6 13M10 3c2 0 2 2 2 3.5S13 8 14 8s-1 0-2 0-2 .5-2 2 2 3 0 3" />
    </svg>
  );
}
function DiamondIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    >
      <path d="M8 2l6 6-6 6-6-6 6-6z" />
    </svg>
  );
}
function HashIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <path d="M6 2l-1 12M11 2l-1 12M2 6h12M2 11h12" />
    </svg>
  );
}
