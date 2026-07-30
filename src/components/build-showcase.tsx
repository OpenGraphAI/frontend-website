import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";

// ============================================================================
// 03 · Build — interactive "before / after" showcase.
// Hero use case: draggable comparison slider.
// Other use cases: toggle chips swapping a result panel.
// ============================================================================

type Result = { label: string; lines: string[] };
type Case = {
  slug: string;
  tag: string;
  title: string;
  question: string;
  before: Result;
  after: Result;
};

const CASES: Case[] = [
  {
    slug: "research-agents",
    tag: "research",
    title: "Research agents that cite their work",
    question: "Which post-2023 papers reproduce Chinchilla's scaling law on multimodal data?",
    before: {
      label: "Vector RAG",
      lines: [
        "top-k = 8 passages",
        "“…compute-optimal scaling…”",
        "“…multimodal pretraining…”",
        "→ no linkage between hits",
        "illustrative outcome: citation linkage is not shown",
      ],
    },
    after: {
      label: "OpenGraph",
      lines: [
        "subgraph: Chinchilla →",
        "  method:compute-optimal",
        "  cited_by(7) ∩ modality:multimodal",
        "→ 4 papers · 2 datasets · 1 contradicting",
        "answer: cited, every hop auditable",
      ],
    },
  },
  {
    slug: "enterprise-memory",
    tag: "internal",
    title: "Enterprise memory layer",
    question: "Why did Acme churn last quarter and who owned the relationship?",
    before: { label: "Five tools, five answers", lines: ["Slack search: 14 threads", "CRM: 2 owners listed", "Linear: 9 tickets", "Drive: 3 docs", "→ you stitch it manually"] },
    after: { label: "One graph", lines: ["Owner: Priya R.", "3 escalations · 2 missed SLAs", "root cause: PR #4821 regression", "→ one query, permission-aware"] },
  },
  {
    slug: "investigative-analysis",
    tag: "intel",
    title: "Investigative analysis",
    question: "How is Person A connected to Shell Corp B before 2022?",
    before: { label: "Keyword search", lines: ["“Person A” → 412 hits", "“Shell Corp B” → 88 hits", "no co-occurrence", "→ dead end"] },
    after: { label: "Path discovery", lines: ["2 hops · confidence 0.84", "shared director (2019)", "shared bank acct (2021-03)", "→ evidence path returned"] },
  },
  {
    slug: "multimodal-rag",
    tag: "infra",
    title: "Multimodal RAG that actually reasons",
    question: "Summarize Q3 pricing concerns across calls and tickets.",
    before: { label: "Top-k chunks", lines: ["8 text passages", "audio ignored", "tables flattened to text", "→ paragraph soup"] },
    after: { label: "Ranked subgraph", lines: ["3 customers · 4 calls · 6 tickets", "1 chart (sales by tier)", "structured context window", "→ multi-hop reasoning"] },
  },
];

export function BuildShowcase() {
  const hero = CASES[0];
  const rest = CASES.slice(1);

  return (
    <div className="mt-10 space-y-3">
      <HeroSlider c={hero} />
      <div className="grid gap-3 md:grid-cols-3">
        {rest.map((c) => (
          <ChipCard key={c.slug} c={c} />
        ))}
      </div>
    </div>
  );
}

// ---------- Hero: drag slider ------------------------------------------------

function HeroSlider({ c }: { c: Case }) {
  const [pct, setPct] = useState(50);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const dragging = useRef(false);

  useEffect(() => {
    function move(clientX: number) {
      const el = wrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const p = ((clientX - r.left) / r.width) * 100;
      setPct(Math.max(6, Math.min(94, p)));
    }
    function onMove(e: PointerEvent) {
      if (!dragging.current) return;
      e.preventDefault();
      move(e.clientX);
    }
    function onUp() {
      dragging.current = false;
    }
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  return (
    <div className="hairline rounded-2xl bg-surface p-6 md:p-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">
            {c.tag} · drag to compare
          </div>
          <h3 className="display mt-2 text-[28px] leading-[1.05] md:text-[32px]">{c.title}</h3>
          <p className="mt-2 max-w-2xl text-[14px] text-ink-muted">
            <span className="mono text-foreground">?</span> {c.question}
          </p>
          <p className="mt-2 text-[12px] text-ink-muted">
            Illustrative workflow comparison — not a universal benchmark.
          </p>
        </div>
        <Link
          to="/use-cases/$slug"
          params={{ slug: c.slug }}
          className="text-[13px] text-ink-muted hover:text-foreground"
        >
          Read the case →
        </Link>
      </div>

      <div
        ref={wrapRef}
        className="relative mt-6 aspect-[16/8] w-full select-none overflow-hidden rounded-xl border border-rule bg-background"
      >
        {/* AFTER (full) */}
        <Panel result={c.after} side="after" />
        {/* BEFORE (clipped from left) */}
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pct}% 0 0)` }}>
          <Panel result={c.before} side="before" />
        </div>

        {/* Divider + handle */}
        <div
          className="absolute inset-y-0 z-10"
          style={{ left: `${pct}%`, transform: "translateX(-50%)" }}
        >
          <div className="h-full w-px bg-foreground/40" />
          <button
            aria-label="Drag to compare"
            onPointerDown={(e) => {
              dragging.current = true;
              (e.target as Element).setPointerCapture?.(e.pointerId);
            }}
            className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full border border-rule bg-background shadow-[0_6px_24px_-8px_rgba(0,0,0,0.25)]"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M5 3L2 7l3 4M9 3l3 4-3 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function Panel({ result, side }: { result: Result; side: "before" | "after" }) {
  const isAfter = side === "after";
  return (
    <div className="absolute inset-0 flex flex-col p-5 md:p-6" style={{ background: isAfter ? "var(--surface)" : "var(--background)" }}>
      <div className="flex items-center gap-2">
        <span
          className="mono text-[10px] uppercase tracking-[0.18em]"
          style={{ color: isAfter ? "hsl(var(--accent))" : "var(--ink-muted, #888)" }}
        >
          {isAfter ? "with opengraph" : "without"}
        </span>
        <span className="text-[12px] text-ink-muted">· {result.label}</span>
      </div>
      <ul className="mono mt-3 space-y-1.5 text-[12.5px] leading-relaxed">
        {result.lines.map((l, i) => (
          <li key={i} className={isAfter ? "text-foreground" : "text-ink-muted"}>
            <span className="text-ink-muted">{String(i + 1).padStart(2, "0")}  </span>
            {l}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---------- Chips card -------------------------------------------------------

function ChipCard({ c }: { c: Case }) {
  const [mode, setMode] = useState<"before" | "after">("after");
  const r = mode === "after" ? c.after : c.before;
  return (
    <div className="hairline group relative rounded-2xl p-6 transition-colors hover:bg-surface">
      <div className="flex items-center justify-between">
        <span className="mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">{c.tag}</span>
        <div className="inline-flex rounded-full border border-rule p-0.5 text-[11px]">
          {(["before", "after"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded-full px-2.5 py-0.5 transition-colors ${
                mode === m ? "bg-foreground text-background" : "text-ink-muted hover:text-foreground"
              }`}
            >
              {m === "before" ? "Without" : "With graph"}
            </button>
          ))}
        </div>
      </div>
      <h3 className="display mt-4 text-[22px] leading-[1.1]">{c.title}</h3>
      <p className="mt-2 text-[12.5px] text-ink-muted">{c.question}</p>

      <div className="mt-4 rounded-lg border border-rule bg-background p-3">
        <AnimatePresence mode="wait">
          <motion.ul
            key={mode}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className="mono space-y-1 text-[11.5px] leading-relaxed"
          >
            <li className="text-ink-muted">{r.label}</li>
            {r.lines.slice(0, 4).map((l, i) => (
              <li key={i} className={mode === "after" ? "text-foreground" : "text-ink-muted"}>
                {mode === "after" ? "→" : "·"} {l}
              </li>
            ))}
          </motion.ul>
        </AnimatePresence>
      </div>

      <Link
        to="/use-cases/$slug"
        params={{ slug: c.slug }}
        className="mt-4 inline-flex items-center gap-1 text-[12px] text-ink-muted hover:text-foreground"
      >
        Read the case <span aria-hidden>→</span>
      </Link>
    </div>
  );
}
