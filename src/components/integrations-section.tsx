import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { Reveal } from "@/components/reveal";

type TabKey = "mcp" | "cli" | "rest" | "skill";

const TABS: { key: TabKey; label: string; badge?: string }[] = [
  { key: "mcp", label: "MCP Server", badge: "Recommended" },
  { key: "cli", label: "CLI" },
  { key: "rest", label: "REST API" },
  { key: "skill", label: "Agent Skill" },
];

const CONTENT: Record<
  TabKey,
  { title: string; desc: string; filename: string; code: string }
> = {
  mcp: {
    title: "MCP Server",
    desc: "Connect directly inside Claude Code, Cursor, or any MCP-compatible IDE. Your editor becomes graph-aware.",
    filename: "mcp_server.sh",
    code: `# Add to Claude Code
claude mcp add opengraph -- npx -y @opengraph/mcp

# Now talk to your graph — from any IDE
extract_graph(path="./data")
query_graph("find all investors near Acme")
summarize_graph()
sync_graph_to_vector_db(target="pinecone")`,
  },
  cli: {
    title: "CLI",
    desc: "One binary. Pipe anything in, get a queryable graph out. Perfect for scripts, CI, and local exploration.",
    filename: "cli.sh",
    code: `# Install
brew install opengraph

# Build a graph from any folder
opengraph build ./data --out graph.json

# Ask questions
opengraph ask "which customers churned?"
opengraph serve --port 7474`,
  },
  rest: {
    title: "REST API",
    desc: "A simple HTTP surface for ingestion and querying. Works from any language, any runtime.",
    filename: "rest_api.sh",
    code: `curl https://api.opengraph.ai/v1/graphs \\
  -H "Authorization: Bearer $OG_KEY" \\
  -d '{ "sources": ["s3://acme/reports/*.pdf"] }'

curl https://api.opengraph.ai/v1/query \\
  -H "Authorization: Bearer $OG_KEY" \\
  -d '{ "q": "find all investors" }'`,
  },
  skill: {
    title: "Agent Skill",
    desc: "Drop OpenGraph into your agent runtime as a first-class skill. Tool-calling, structured outputs, citations.",
    filename: "agent_skill.py",
    code: `from opengraph.skill import GraphSkill
from langchain.agents import create_agent

agent = create_agent(
    model="gpt-5",
    skills=[GraphSkill(graph="./graph.json")],
)

agent.run("which customers mentioned pricing in Q3?")`,
  },
};

const LOGOS: { name: string; slug: string; color: string }[] = [
  { name: "Claude", slug: "claude", color: "D97757" },
  { name: "Cursor", slug: "cursor", color: "111111" },
  { name: "LangChain", slug: "langchain", color: "1C3C3C" },
  { name: "Google Gemini", slug: "googlegemini", color: "4285F4" },
];

export function IntegrationsSection({ embedded = false }: { embedded?: boolean } = {}) {
  const [tab, setTab] = useState<TabKey>("mcp");
  const [copied, setCopied] = useState(false);
  const c = CONTENT[tab];

  // Canvas network background (matches playground CTA banner style)
  const hostRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const cv = canvasRef.current;
    const host = hostRef.current;
    if (!cv || !host) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const ACCENT = "rgba(255,120,72,";
    const LINK = 150;
    const NODE_COUNT = 34;
    const DRIFT = 0.5;
    let w = 0;
    let h = 0;
    type Node = { x: number; y: number; vx: number; vy: number; r: number; accent: boolean };
    let nodes: Node[] = [];
    const build = () => {
      const r = host.getBoundingClientRect();
      w = r.width;
      h = r.height;
      cv.width = w * dpr;
      cv.height = h * dpr;
      cv.style.width = w + "px";
      cv.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      nodes = Array.from({ length: NODE_COUNT }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: Math.random() - 0.5,
        vy: Math.random() - 0.5,
        r: 1.2 + Math.random() * 1.4,
        accent: Math.random() < 0.16,
      }));
    };
    build();
    const ro = new ResizeObserver(build);
    ro.observe(host);
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < LINK) {
            const t = 1 - d / LINK;
            ctx.strokeStyle = "rgba(255,255,255," + t * 0.09 + ")";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (const nd of nodes) {
        ctx.beginPath();
        ctx.arc(nd.x, nd.y, nd.r, 0, 6.283);
        ctx.fillStyle = nd.accent ? ACCENT + "0.5)" : "rgba(255,255,255,0.36)";
        ctx.fill();
      }
    };
    if (reduced) {
      draw();
      return () => ro.disconnect();
    }
    let raf = 0;
    const tick = () => {
      for (const nd of nodes) {
        nd.x += nd.vx * DRIFT;
        nd.y += nd.vy * DRIFT;
        if (nd.x < -6) nd.x = w + 6;
        else if (nd.x > w + 6) nd.x = -6;
        if (nd.y < -6) nd.y = h + 6;
        else if (nd.y > h + 6) nd.y = -6;
      }
      draw();
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  // Typewriter effect for the code block, restarts on tab change.
  const [typed, setTyped] = useState(0);
  const reducedRef = useRef(false);
  useEffect(() => {
    reducedRef.current =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;
  }, []);
  useEffect(() => {
    if (reducedRef.current) {
      setTyped(c.code.length);
      return;
    }
    setTyped(0);
    let raf = 0;
    let start = 0;
    const speed = 14; // ms per char
    const startDelay = 200;
    const total = c.code.length;
    const tick = (t: number) => {
      if (!start) start = t + startDelay;
      const elapsed = Math.max(0, t - start);
      const n = Math.min(total, Math.floor(elapsed / speed));
      setTyped(n);
      if (n < total) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [tab, c.code]);

  const shownCode = c.code.slice(0, typed);
  const isTyping = typed < c.code.length;
  const shownLines = shownCode.length ? shownCode.split("\n") : [""];
  const totalLines = c.code.split("\n").length;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(c.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  };

  const card = (
    <Reveal className="relative overflow-hidden rounded-2xl border border-white/10 bg-black">
      <div ref={hostRef} className="pointer-events-none absolute inset-0 z-0" aria-hidden>
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      </div>
      {/* Tabs */}
      <div className="relative z-10 flex flex-wrap items-center gap-1 border-b border-white/10 px-4 pt-3 sm:gap-6 sm:px-8">
        {TABS.map((t) => {
          const active = t.key === tab;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`relative flex items-center gap-2 px-2 py-4 mono text-[13px] uppercase tracking-wider transition-colors ${
                active ? "text-white" : "text-white/45 hover:text-white/80"
              }`}
            >
              <span>{t.label}</span>
              {t.badge && (
                <span className="rounded-md bg-accent/15 px-1.5 py-0.5 mono text-[10px] uppercase tracking-wider text-accent">
                  {t.badge}
                </span>
              )}
              {active && (
                <motion.span
                  layoutId="integrations-tab"
                  className="absolute inset-x-0 -bottom-px h-[2px] bg-accent"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Body */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 p-8 sm:p-10"
        >
          <h3 className="display text-[32px] leading-tight text-white">{c.title}</h3>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-white/60">{c.desc}</p>

          {/* Code card */}
          <div className="mt-8 overflow-hidden rounded-xl border border-white/10 bg-[#0f0f10]">
            {/* header */}
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                </div>
                <span className="mono text-[12px] text-white/40">{c.filename}</span>
              </div>
              <button
                onClick={copy}
                className="flex items-center gap-1.5 mono text-[11px] uppercase tracking-wider text-white/45 transition-colors hover:text-white"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "copied" : "copy"}
              </button>
            </div>
            {/* code with line numbers */}
            <div className="overflow-x-auto">
              <pre className="mono flex text-[13px] leading-[1.75] text-white/85">
                <div aria-hidden className="select-none border-r border-white/5 px-4 py-4 text-right text-white/25">
                  {Array.from({ length: totalLines }).map((_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>
                <code className="relative block whitespace-pre px-5 py-4">
                  {/* Invisible full code reserves the final height so the box never grows while typing. */}
                  <span className="invisible">{c.code}</span>
                  {/* Visible typed overlay */}
                  <span className="absolute left-5 top-4 block whitespace-pre">
                    {shownCode}
                    {isTyping && (
                      <motion.span
                        aria-hidden
                        className="ml-[1px] inline-block h-[1.05em] w-[0.5ch] -mb-[0.15em] bg-accent align-baseline"
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                      />
                    )}
                  </span>
                </code>
              </pre>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </Reveal>
  );

  if (embedded) return card;

  return (
    <section className="mx-auto max-w-[1280px] px-6 pt-28">
      <Reveal>
        <div className="mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">
          integrations
        </div>
        <h2 className="display mt-4 text-balance text-[44px] leading-[0.98] sm:text-[56px] lg:text-[72px]">
          One graph. <span className="text-ink-muted">Every interface.</span>
        </h2>
      </Reveal>

      <div className="mt-12">{card}</div>

      {/* Logos */}
      <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
        {LOGOS.map((l) => (
          <div
            key={l.name}
            className="flex min-w-0 items-center gap-4 rounded-2xl border border-rule bg-card px-5 py-5"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-rule bg-background/80">
              {l.slug === "googlegemini" ? (
                <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden>
                  <defs>
                    <linearGradient id="gemini-grad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#4285F4" />
                      <stop offset="50%" stopColor="#9B72F2" />
                      <stop offset="100%" stopColor="#D96570" />
                    </linearGradient>
                  </defs>
                  <path
                    fill="url(#gemini-grad)"
                    d="M12 0c.4 5.5 6.5 11.6 12 12-5.5.4-11.6 6.5-12 12-.4-5.5-6.5-11.6-12-12C5.5 11.6 11.6 5.5 12 0z"
                  />
                </svg>
              ) : (
                <img
                  src={`https://cdn.simpleicons.org/${l.slug}/${l.color}`}
                  alt=""
                  className="h-7 w-7"
                  loading="lazy"
                />
              )}
            </span>
            <span className="truncate text-[15px] font-medium">{l.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}