import { useEffect, useState } from "react";
import { Diamond, ChevronRight, FileImage, Braces, FileCode2, Hash } from "lucide-react";

/* ---------- shared ---------- */

const PANEL_COUNT = 5;
const STEP_MS = 2000;

/* Fixed rail geometry. 5 * 216 + 4 * 36 = 1224px — fits within a
   max-w-[1280px] px-6 container (usable ~1232px). Below xl the rail lives
   inside a snap-scroller so cards stay full-size on tablet/mobile. */
const CARD = 212;
const CONNECTOR_W = 32;

const CARD_BASE =
  "relative rounded-2xl border bg-card p-3 transition-[border-color,box-shadow,transform] duration-500 [transform-style:preserve-3d]";
const CARD_IDLE =
  "border-rule shadow-[0_1px_0_rgba(255,255,255,0.55)_inset,0_-1px_0_rgba(0,0,0,0.04)_inset,0_18px_30px_-18px_rgba(0,0,0,0.22),0_6px_12px_-8px_rgba(0,0,0,0.10)]";
const CARD_ACTIVE =
  "border-accent/70 shadow-[0_1px_0_rgba(255,255,255,0.55)_inset,0_28px_56px_-22px_rgba(255,87,34,0.32),0_0_0_4px_rgba(255,87,34,0.08)] -translate-y-1 [transform:translateY(-4px)_rotateX(2deg)]";

const CARD_LABEL =
  "flex items-center gap-1.5 text-[13px] font-medium text-foreground";
const CARD_META =
  "mono text-[10px] uppercase tracking-[0.14em] text-ink-muted";

function useSequence(count: number, ms: number) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = window.setInterval(() => setI((v) => (v + 1) % count), ms);
    return () => window.clearInterval(t);
  }, [count, ms]);
  return i;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

function CardHeader({
  icon = "diamond",
  title,
  meta,
}: {
  icon?: "diamond" | "chevron" | "dot";
  title: string;
  meta?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className={CARD_LABEL}>
        {icon === "diamond" && <Diamond className="h-3.5 w-3.5 fill-accent text-accent" />}
        {icon === "chevron" && <ChevronRight className="h-3.5 w-3.5 text-ink-muted" />}
        {icon === "dot" && <span className="inline-block h-2 w-2 rounded-full bg-accent" />}
        <span>{title}</span>
      </div>
      {meta && <span className={CARD_META}>{meta}</span>}
    </div>
  );
}

/* ---------- connector between adjacent panels ---------- */

function Connector({
  active,
  variant = "orange",
}: {
  active: boolean;
  variant?: "orange" | "blue";
}) {
  const stroke =
    variant === "orange" ? "var(--color-accent)" : "#3f6fd6";
  const orb =
    variant === "orange"
      ? "border-accent/60 text-accent"
      : "border-[#3f6fd6]/60 text-[#3f6fd6]";
  const Icon = variant === "orange" ? Diamond : ChevronRight;

  return (
    <div
      aria-hidden
      className="pointer-events-none relative flex shrink-0 items-center self-stretch"
      style={{ width: CONNECTOR_W }}
    >
      {/* line */}
      <svg
        className="absolute inset-y-0 left-0 h-full w-full"
        viewBox="0 0 64 400"
        preserveAspectRatio="none"
      >
        <line
          x1="0"
          y1="200"
          x2="64"
          y2="200"
          stroke={stroke}
          strokeOpacity={active ? 0.9 : 0.35}
          strokeWidth="1.25"
          strokeLinecap="round"
          style={{ transition: "stroke-opacity 400ms" }}
        />
        {active && (
          <circle r="3.5" fill={stroke}>
            <animate
              attributeName="cx"
              from="0"
              to="64"
              dur="1.4s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="cy"
              from="200"
              to="200"
              dur="1.4s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0;1;1;0"
              keyTimes="0;0.15;0.85;1"
              dur="1.4s"
              repeatCount="indefinite"
            />
          </circle>
        )}
      </svg>
      {/* seam orb centered */}
      <span
        className={`relative z-10 mx-auto grid h-[26px] w-[26px] place-items-center rounded-full border bg-background ${orb} transition-shadow duration-500 ${
          active ? "shadow-[0_0_0_6px_rgba(255,87,34,0.12)]" : ""
        }`}
      >
        <Icon className={variant === "orange" ? "h-2.5 w-2.5 fill-current" : "h-3 w-3"} />
      </span>
    </div>
  );
}

function PanelShell({
  active,
  children,
}: {
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${CARD_BASE} ${active ? CARD_ACTIVE : CARD_IDLE} flex shrink-0 snap-center flex-col overflow-hidden`}
      style={{ width: CARD, height: CARD }}
    >
      {children}
    </div>
  );
}

/* ---------- 1. Images ---------- */

const IMG_FILES = ["park-01.jpg", "park-02.jpg", "park-03.jpg"];

function ImagesPanel({ active }: { active: boolean }) {
  return (
    <PanelShell active={active}>
      <CardHeader icon="dot" title="Images" meta="/test-photos" />
      <div className="mt-2 rounded-lg border border-rule bg-background/60 p-2">
        <div className="mb-1.5 flex items-center justify-between">
          <div className="mono flex items-center gap-1 text-[11px] text-foreground">
            <FileImage className="h-2.5 w-2.5 text-ink-muted" />
            /test-photos
          </div>
          <span className="mono text-[10px] text-ink-muted">3 files</span>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {IMG_FILES.map((f, idx) => (
            <div
              key={f}
              className={`rounded-md border border-dashed border-rule bg-card px-1.5 py-2 text-center ${
                idx === 2 ? "col-span-2" : ""
              }`}
            >
              <div className="mono text-[11px] text-foreground">{f}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="mono mt-auto pt-2 text-[10px] text-ink-muted">
        drag jpg · png
      </div>
    </PanelShell>
  );
}

/* ---------- 2. Extract meaning ---------- */

const ENTITIES: Array<{ label: string; color: string }> = [
  { label: "bench", color: "var(--color-accent)" },
  { label: "lake", color: "#3f6fd6" },
  { label: "tree", color: "#1ca35f" },
  { label: "path", color: "#7b53d6" },
  { label: "park", color: "#3f6fd6" },
];

const RELS: Array<[string, string, string]> = [
  ["bench", "next to", "lake"],
  ["tree", "beside", "lake"],
  ["path", "runs along", "lake"],
  ["lake", "within", "park"],
  ["path", "within", "park"],
];

function ExtractPanel({ active }: { active: boolean }) {
  return (
    <PanelShell active={active}>
      <CardHeader title="Extract meaning" meta="opengraph-image" />

      <div className="mt-2">
        <div className={CARD_META}>Entities</div>
        <div className="mt-1.5 flex flex-wrap gap-1">
          {ENTITIES.map((e) => (
            <span
              key={e.label}
              className="inline-flex items-center gap-1 rounded-full border border-rule bg-background px-1.5 py-0.5 text-[12px] text-foreground"
            >
              <span className="h-1 w-1 rounded-full" style={{ background: e.color }} />
              {e.label}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-2 border-t border-rule pt-2">
        <div className={CARD_META}>Relationships</div>
        <div className="mono mt-1 space-y-0.5 text-[11px] text-foreground">
          {RELS.slice(0, 4).map(([s, v, o], i) => (
            <div key={i}>
              {s} <span className="text-accent">·{v}·</span> {o}
            </div>
          ))}
        </div>
      </div>
    </PanelShell>
  );
}

/* ---------- 3. Knowledge graph (focal) ---------- */

type GNode = { id: string; label: string; x: number; y: number; color: string; center?: boolean };
const GN: GNode[] = [
  { id: "lake", label: "lake", x: 130, y: 105, color: "var(--color-accent)", center: true },
  { id: "bench", label: "bench", x: 40, y: 30, color: "#3f6fd6" },
  { id: "tree", label: "tree", x: 220, y: 30, color: "#1ca35f" },
  { id: "path", label: "path", x: 40, y: 180, color: "#7b53d6" },
  { id: "park", label: "park", x: 220, y: 180, color: "#3f6fd6" },
];
const GE: Array<[string, string]> = [
  ["lake", "bench"],
  ["lake", "tree"],
  ["lake", "path"],
  ["lake", "park"],
  ["bench", "tree"],
  ["path", "park"],
];

function GraphPanel({ active }: { active: boolean }) {
  const byId = Object.fromEntries(GN.map((n) => [n.id, n]));
  return (
    <PanelShell active={active}>
      <CardHeader title="Knowledge graph" meta="opengraph-image" />

      <div className="relative mt-2 h-[118px] w-full overflow-hidden rounded-lg border border-rule bg-background/70">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.5]"
          style={{
            backgroundImage:
              "radial-gradient(color-mix(in oklab, var(--ink) 12%, transparent) 1px, transparent 1px)",
            backgroundSize: "14px 14px",
          }}
        />
        <svg viewBox="0 0 260 210" className="absolute inset-0 h-full w-full">
          {GE.map(([a, b], i) => {
            const A = byId[a];
            const B = byId[b];
            const inbound = b === "lake";
            const from = inbound ? A : B;
            const to = inbound ? B : A;
            return (
              <g key={i}>
                <line
                  x1={A.x}
                  y1={A.y}
                  x2={B.x}
                  y2={B.y}
                  stroke="var(--color-accent)"
                  strokeWidth="1"
                  strokeOpacity="0.55"
                  strokeDasharray="3 4"
                  className="animate-dash"
                />
                <circle r="1.8" fill="var(--color-accent)">
                  <animate
                    attributeName="cx"
                    from={from.x}
                    to={to.x}
                    dur="1.8s"
                    begin={`${(i * 0.22).toFixed(2)}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="cy"
                    from={from.y}
                    to={to.y}
                    dur="1.8s"
                    begin={`${(i * 0.22).toFixed(2)}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0;1;1;0"
                    keyTimes="0;0.15;0.85;1"
                    dur="1.8s"
                    begin={`${(i * 0.22).toFixed(2)}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            );
          })}
          {GN.map((n) => (
            <g key={n.id}>
              {n.center && (
                <circle cx={n.x} cy={n.y} r="18" fill={n.color} opacity="0.18" className="pg-anim-pulse" />
              )}
              <circle
                cx={n.x}
                cy={n.y}
                r={n.center ? 9 : 5}
                fill={n.center ? n.color : "var(--color-background)"}
                stroke={n.color}
                strokeWidth={n.center ? 0 : 1.5}
              />
              <text
                x={n.x}
                y={n.center ? n.y + 26 : n.y - 10}
                textAnchor="middle"
                fontSize="11"
                fontFamily="var(--font-mono)"
                fill="var(--color-foreground)"
              >
                {n.label}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="mt-2 flex flex-wrap gap-1">
        {["entities", "relationships", "metadata"].map((t) => (
          <span
            key={t}
            className="mono rounded border border-rule bg-background px-1.5 py-0.5 text-[10px] text-foreground"
          >
            {t}
          </span>
        ))}
      </div>
    </PanelShell>
  );
}

/* ---------- 4. Ask the graph ---------- */

function AskPanel({ active }: { active: boolean }) {
  return (
    <PanelShell active={active}>
      <CardHeader icon="chevron" title="Ask the graph" meta="query" />

      <div className="mt-2 space-y-1.5">
        <div className="rounded-lg border border-rule bg-background px-2 py-1.5 text-[12px] text-foreground">
          Which images show a path near the lake?
        </div>
        <div className="rounded-lg border border-rule bg-background px-2 py-1.5 text-[12px] text-foreground">
          2 images: path runs{" "}
          <span className="text-accent">along</span> the lake.
          <div className="mt-1.5 flex flex-wrap gap-1">
            {["park-01", "park-03"].map((n) => (
              <span
                key={n}
                className="mono inline-flex items-center gap-1 rounded border border-rule bg-card px-1 py-0.5 text-[10px] text-foreground"
              >
                <FileImage className="h-2 w-2 text-ink-muted" />
                {n}
              </span>
            ))}
          </div>
        </div>
      </div>
    </PanelShell>
  );
}

/* ---------- 5. Agent context ---------- */

function AgentPanel({ active }: { active: boolean }) {
  const rows = [
    { Icon: Braces, label: "graph.json", desc: "nodes · edges" },
    { Icon: FileCode2, label: "graph.html", desc: "explorer" },
    { Icon: Hash, label: "agent context", desc: "MCP · skills" },
  ];
  return (
    <PanelShell active={active}>
      <CardHeader icon="dot" title="Agent context" meta="output" />
      <div className="mono mt-2 text-[11px] text-ink-muted">
        one ingest, three outputs
      </div>
      <ul className="mt-2 space-y-1.5">
        {rows.map((r) => (
          <li
            key={r.label}
            className="flex items-center gap-2 rounded-lg border border-rule bg-background px-2 py-1.5"
          >
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded border border-rule bg-card text-foreground">
              <r.Icon className="h-3 w-3" />
            </span>
            <div className="min-w-0">
              <div className="mono text-[12px] text-foreground">{r.label}</div>
              <div className="mono text-[10px] text-ink-muted">{r.desc}</div>
            </div>
          </li>
        ))}
      </ul>
    </PanelShell>
  );
}

/* ---------- floating terminal ribbon ---------- */

function TerminalRibbon() {
  return (
    <div className="pointer-events-none absolute left-1/2 top-0 z-20 hidden w-[520px] -translate-x-1/2 -translate-y-1/2 lg:block">
      <div className="mono mb-1.5 text-center text-[11px] text-ink-muted">
        <span className="text-accent">+</span> Claude + OpenGraph Image MCP
      </div>
      <div className="pointer-events-auto space-y-1.5 rounded-2xl border border-accent/50 bg-card px-4 py-3 shadow-[0_10px_30px_-15px_rgba(255,87,34,0.35)]">
        <div className="flex items-center gap-2 text-[13px] text-foreground">
          <span className="mono rounded-md border border-rule bg-background px-1.5 py-0.5 text-[10px] text-ink-muted">you</span>
          <span>
            Build a knowledge graph from the images in{" "}
            <span className="mono text-accent">/test-photos</span>.
          </span>
        </div>
        <div className="flex items-center gap-2 text-[13px] text-foreground">
          <span className="mono rounded-md border border-rule bg-background px-1.5 py-0.5 text-[10px] text-accent">✦</span>
          <span>Claude calls</span>
          <span className="mono inline-flex items-center gap-1.5 rounded-full border border-accent/50 bg-background px-2 py-0.5 text-[11px] text-foreground">
            <Diamond className="h-2.5 w-2.5 fill-accent text-accent" />
            OpenGraph Image · <span className="text-accent">build_graph</span>
          </span>
          <span className="mono inline-flex items-center gap-1 text-[11px] text-ink-muted">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#1ca35f]" />
            MCP tool call
          </span>
        </div>
      </div>
    </div>
  );
}

/* ---------- root ---------- */

export function WorkflowCanvas() {
  const reduced = usePrefersReducedMotion();
  const cycled = useSequence(PANEL_COUNT, STEP_MS);
  const step = reduced ? 0 : cycled;

  return (
    <div className="relative overflow-x-clip">
      {/* dotted backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(color-mix(in oklab, var(--ink) 10%, transparent) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      />

      <div className="relative pt-24 pb-4 lg:pt-28">
        <TerminalRibbon />

        <div
          className="snap-x snap-mandatory overflow-x-auto overscroll-x-contain py-10 [@media(min-width:1236px)]:overflow-visible"
          style={{ perspective: "1200px" }}
        >
          <div className="mx-auto flex w-max items-center">
            <ImagesPanel active={step === 0} />
            <Connector active={!reduced && step === 0} variant="blue" />
            <ExtractPanel active={step === 1} />
            <Connector active={!reduced && step === 1} variant="orange" />
            <GraphPanel active={step === 2} />
            <Connector active={!reduced && step === 2} variant="orange" />
            <AskPanel active={step === 3} />
            <Connector active={!reduced && step === 3} variant="blue" />
            <AgentPanel active={step === 4} />
          </div>
        </div>

        <div className="mono mt-2 px-6 text-center text-[11px] text-ink-muted [@media(min-width:1236px)]:hidden">
          Swipe to explore the workflow.
        </div>
      </div>
    </div>
  );
}
