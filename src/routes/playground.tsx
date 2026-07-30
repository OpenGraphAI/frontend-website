import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { buildMockGraph } from "@/lib/mock-graph";
import { GraphCanvas } from "@/components/playground/graph-canvas";
import {
  ACTIVE_MODALITIES, CANNED_ANSWER, EDGES, EXAMPLE_DATASETS, EXAMPLE_QUERIES,
  INGESTED_FILES, INSPECTOR, LOADING_STEPS, MODALITIES, NODES, nodeColor,
} from "@/lib/playground/graph-data";

export const Route = createFileRoute("/playground")({
  head: () => ({
    meta: [
      { title: "Playground — OpenGraph AI" },
      { name: "description", content: "An interactive knowledge-graph explorer. Load an example dataset, inspect entities, and query the graph." },
      { property: "og:title", content: "Playground — OpenGraph AI" },
      { property: "og:description", content: "An interactive knowledge-graph explorer built on OpenGraph AI." },
    ],
  }),
  component: Playground,
});

type Phase = "empty" | "loading" | "ready";
type Tab = "answer" | "graph" | "cypher" | "skills";

function Playground() {
  const navigate = useNavigate();

  // App state machine
  const [phase, setPhase] = useState<Phase>("empty");
  const [stepIdx, setStepIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [chosenDataset, setChosenDataset] = useState<string | null>(null);
  const timersRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Query
  const [q, setQ] = useState("");
  const [querying, setQuerying] = useState(false);
  const [resultShown, setResultShown] = useState(false);
  const [tab, setTab] = useState<Tab>("answer");

  // Auth + save
  const [userId, setUserId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setUserId(s?.user?.id ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => () => { timersRef.current.forEach(clearTimeout); }, []);

  function clearTimers() {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }

  function startLoading(datasetId: string) {
    clearTimers();
    setChosenDataset(datasetId);
    setPhase("loading");
    setStepIdx(0);
    setSelected(null);
    setResultShown(false);
    setQuerying(false);
    LOADING_STEPS.forEach((_, i) => {
      const t = setTimeout(() => {
        setStepIdx(i);
        if (i === LOADING_STEPS.length - 1) {
          const t2 = setTimeout(() => {
            setPhase("ready");
            setSelected("ent_churn");
          }, 300);
          timersRef.current.push(t2);
        }
      }, (i + 1) * 450);
      timersRef.current.push(t);
    });
  }

  function reset() {
    clearTimers();
    setPhase("empty");
    setSelected(null);
    setChosenDataset(null);
    setResultShown(false);
    setQuerying(false);
    setQ("");
  }

  function runQuery(text: string) {
    const value = text.trim();
    if (!value || phase !== "ready" || querying) return;
    setQuerying(true);
    setResultShown(false);
    setTab("answer");
    const t = setTimeout(() => {
      setQuerying(false);
      setResultShown(true);
    }, 1800);
    timersRef.current.push(t);
  }

  async function exportGraph() {
    if (phase !== "ready") return;
    if (!userId) { navigate({ to: "/auth" }); return; }
    setSaving(true);
    const files = INGESTED_FILES.map((f) => f.name);
    const mg = buildMockGraph(files);
    const datasetName = EXAMPLE_DATASETS.find((d) => d.id === chosenDataset)?.title ?? "playground graph";
    const { data: gIns, error: gErr } = await supabase
      .from("graphs")
      .insert({
        user_id: userId,
        name: datasetName,
        nodes: mg.nodes, edges: mg.edges,
        node_count: mg.nodes.length, edge_count: mg.edges.length,
      })
      .select("id").single();
    if (gErr || !gIns) { setSaving(false); alert(gErr?.message ?? "Save failed"); return; }
    await supabase.from("sources").insert(files.map((fn) => ({
      graph_id: gIns.id, user_id: userId, filename: fn,
    })));
    setSaving(false);
    navigate({ to: "/graph/$id", params: { id: gIns.id } });
  }

  const loadingStep = LOADING_STEPS[Math.min(stepIdx, LOADING_STEPS.length - 1)];
  const inspector = selected ? INSPECTOR[selected] : null;
  const selectedNode = useMemo(() => NODES.find((n) => n.id === selected) ?? null, [selected]);
  const relations = useMemo(() => {
    if (!selected) return [];
    return EDGES.filter((e) => e.from === selected || e.to === selected).map((e) => {
      const other = e.from === selected ? e.to : e.from;
      const otherNode = NODES.find((n) => n.id === other)!;
      return { id: e.id, label: e.label, confidence: e.confidence, other: otherNode };
    });
  }, [selected]);

  return (
    <div className="mx-auto flex max-w-[1440px] flex-col px-4 pb-16 pt-6 sm:px-6">
      {/* In-app top bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-rule bg-card px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="mono text-[11px] uppercase tracking-[0.14em] text-ink-muted">playground · beta</span>
        </div>
        <StatusPill phase={phase} pct={loadingStep.pct} />
        <div className="ml-auto flex flex-wrap items-center gap-4">
          {phase === "ready" && (
            <div className="flex items-center gap-4 pg-anim-fadein">
              <StatCard label="nodes"   value={String(NODES.length)} />
              <StatCard label="edges"   value={String(EDGES.length)} />
              <StatCard label="sources" value={String(INGESTED_FILES.length)} />
            </div>
          )}
          {phase === "ready" && (
            <button
              onClick={reset}
              className="mono rounded border border-rule px-3 py-1.5 text-[11px] uppercase tracking-[0.12em] text-ink-muted hover:text-foreground hover:border-foreground transition-colors"
            >
              reset
            </button>
          )}
          <button
            onClick={exportGraph}
            disabled={phase !== "ready" || saving}
            className="mono rounded bg-foreground px-3 py-1.5 text-[11px] uppercase tracking-[0.12em] text-background disabled:opacity-40"
          >
            {saving ? "saving…" : userId ? "export graph →" : "sign in to export →"}
          </button>
        </div>
      </div>

      {/* 3-column IDE layout */}
      <div className="mt-4 grid gap-4 lg:grid-cols-[272px_minmax(0,1fr)_296px]">
        {/* LEFT: data sources */}
        <aside className="rounded-lg border border-rule bg-card min-w-0">
          <div className="border-b border-rule px-4 py-3">
            <div className="mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">data sources</div>
          </div>
          <div className="space-y-4 p-4">
            {/* drop zone */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.csv,.mp3,.png,.json,.html,.jpg,.jpeg,.txt,.md"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  startLoading("meeting");
                  e.target.value = "";
                }
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files.length > 0) startLoading("meeting");
              }}
              className="group flex w-full flex-col items-center gap-1 rounded-md border border-dashed border-rule px-3 py-5 text-center transition-colors hover:border-accent hover:bg-accent/5"
            >
              <span className="mono text-[19px] text-ink-muted group-hover:text-accent">↑</span>
              <span className="mono text-[11px] uppercase tracking-[0.12em] text-ink-muted">drop files or connect a source</span>
              <span className="mono text-[10px] text-ink-muted/70">pdf · csv · mp3 · png · json · html</span>
            </button>

            {/* modalities */}
            <div>
              <div className="mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">modalities</div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {MODALITIES.map((m) => {
                  const active = phase === "ready" && ACTIVE_MODALITIES.has(m.id);
                  return (
                    <span
                      key={m.id}
                      className={`mono inline-flex items-center gap-1 rounded-sm border px-2 py-1 text-[10px] ${
                        active
                          ? "border-accent/40 bg-accent/10 text-accent"
                          : "border-rule text-ink-muted"
                      }`}
                    >
                      <span aria-hidden>{m.glyph}</span>{m.label}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-rule" />

            {/* example datasets */}
            <div>
              <div className="mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">example datasets</div>
              <div className="mt-2 space-y-1.5">
                {EXAMPLE_DATASETS.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => startLoading(d.id)}
                    className="group flex w-full items-start gap-3 rounded-sm border border-rule bg-card px-3 py-2.5 text-left transition-colors hover:border-foreground hover:bg-surface"
                    aria-label={`Load example dataset: ${d.title}`}
                  >
                    <span className="mono text-[15px] leading-none" style={{ color: d.color }}>{d.glyph}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[13px] font-medium text-foreground">{d.title}</span>
                      <span className="mono block text-[10px] text-ink-muted">{d.caption}</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* ingested files */}
            {phase !== "empty" && (
              <div className="pg-anim-fadein">
                <div className="mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">ingested files</div>
                <div className="mt-2 space-y-1">
                  {INGESTED_FILES.map((f, i) => {
                    const done = phase === "ready" || stepIdx >= i;
                    return (
                      <div key={f.name} className="flex items-center justify-between rounded-sm border border-rule px-2.5 py-1.5">
                        <div className="min-w-0">
                          <div className="mono truncate text-[11px] text-foreground">{f.name}</div>
                          <div className="mono truncate text-[10px] text-ink-muted">{f.meta}</div>
                        </div>
                        <span className={`mono text-[10px] ${done ? "text-[color:var(--pg-green)]" : "text-ink-muted"}`}>
                          {done ? "ok" : "…"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* CENTER: canvas + query */}
        <div className="flex min-w-0 flex-col gap-4">
          <GraphCanvas
            phase={phase}
            selected={selected}
            hovered={hovered}
            onSelect={setSelected}
            onHover={setHovered}
            onTryDemo={() => startLoading("meeting")}
            loadingText={loadingStep.text}
            loadingPct={loadingStep.pct}
          />

          {/* Query panel */}
          <div className="rounded-lg border border-rule bg-card">
            <div className="border-b border-rule px-4 py-3">
              <div className="mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">query the graph</div>
            </div>
            <div className="p-4">
              <form
                onSubmit={(e) => { e.preventDefault(); runQuery(q); }}
                className="flex gap-2"
              >
                <div className="mono flex flex-1 items-center gap-2 rounded border border-rule bg-background px-3 py-2 focus-within:border-foreground">
                  <span className="text-ink-muted" aria-hidden>›</span>
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder={phase === "ready" ? "ask the graph…" : "load a dataset first"}
                    disabled={phase !== "ready" || querying}
                    maxLength={280}
                    aria-label="Query the graph"
                    className="mono flex-1 bg-transparent text-[12px] outline-none placeholder:text-ink-muted disabled:opacity-50"
                  />
                </div>
                <button
                  type="submit"
                  disabled={phase !== "ready" || querying || !q.trim()}
                  className="mono rounded bg-foreground px-3 py-2 text-[11px] uppercase tracking-[0.12em] text-background disabled:opacity-40"
                >
                  query →
                </button>
              </form>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {EXAMPLE_QUERIES.map((eq) => (
                  <button
                    key={eq}
                    onClick={() => { setQ(eq); runQuery(eq); }}
                    disabled={phase !== "ready" || querying}
                    className="mono rounded-sm border border-rule px-2 py-1 text-[10px] text-ink-muted transition-colors hover:border-foreground hover:text-foreground disabled:opacity-40"
                  >
                    {eq}
                  </button>
                ))}
              </div>

              {querying && (
                <div className="mono mt-4 flex items-center gap-2 text-[11px] text-ink-muted pg-anim-step">
                  <span className="inline-block h-2 w-2 rounded-full bg-accent" />
                  walking the graph…
                </div>
              )}

              {resultShown && !querying && (
                <div className="mt-4 pg-anim-fadein">
                  <div role="tablist" className="mono flex gap-4 border-b border-rule text-[10px] uppercase tracking-[0.14em]">
                    {(["answer","graph","cypher","skills"] as Tab[]).map((t) => (
                      <button
                        key={t}
                        role="tab"
                        aria-selected={tab === t}
                        onClick={() => setTab(t)}
                        className={`-mb-px border-b-2 py-2 transition-colors ${
                          tab === t ? "border-foreground text-foreground" : "border-transparent text-ink-muted hover:text-foreground"
                        }`}
                      >
                        {t === "answer" ? "answer" : t === "graph" ? "graph.json" : t === "cypher" ? "query.cypher" : "skills.md"}
                      </button>
                    ))}
                  </div>
                  <div className="pt-3">
                    {tab === "answer" && (
                      <p className="text-[13px] leading-[1.65] text-foreground">{CANNED_ANSWER.text}</p>
                    )}
                    {tab === "graph" && <CodeBlock lang="json">{CANNED_ANSWER.graphJson}</CodeBlock>}
                    {tab === "cypher" && <CodeBlock lang="cypher">{CANNED_ANSWER.cypher}</CodeBlock>}
                    {tab === "skills" && <CodeBlock lang="md">{CANNED_ANSWER.skillsMd}</CodeBlock>}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: inspector */}
        <aside className="rounded-lg border border-rule bg-card min-w-0">
          <div className="flex items-center justify-between border-b border-rule px-4 py-3">
            <div className="mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">node inspector</div>
            {selected && (
              <button
                onClick={() => setSelected(null)}
                aria-label="Close inspector"
                className="mono text-[12px] text-ink-muted hover:text-foreground"
              >✕</button>
            )}
          </div>
          <div className="p-4">
            {!selectedNode || !inspector ? (
              <p className="text-[13px] leading-relaxed text-ink-muted">
                Click a node in the graph to inspect its properties, relations, and source snippet.
              </p>
            ) : (
              <div className="pg-anim-fadein space-y-4">
                <div className="flex items-start gap-2.5">
                  <span
                    className="mt-1 inline-block h-2.5 w-2.5 flex-shrink-0 rounded-full"
                    style={{ background: nodeColor(selectedNode.kind, selectedNode.modality) }}
                  />
                  <div className="min-w-0">
                    <div className="text-[15px] font-semibold leading-tight text-foreground">{selectedNode.label}</div>
                    <div className="mono mt-0.5 text-[10px] uppercase tracking-[0.14em] text-ink-muted">
                      {selectedNode.kind}{selectedNode.modality ? ` · ${selectedNode.modality}` : ""} · conf {inspector.confidence.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">properties</div>
                  <dl className="mt-2 divide-y divide-[color:var(--rule)] rounded border border-rule">
                    {inspector.properties.map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between px-2.5 py-1.5">
                        <dt className="mono text-[10px] uppercase tracking-[0.12em] text-ink-muted">{k}</dt>
                        <dd className="mono text-[11px] text-foreground">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div>
                  <div className="mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">relations · {relations.length}</div>
                  <ul className="mt-2 space-y-1">
                    {relations.map((r) => (
                      <li key={r.id}>
                        <button
                          onClick={() => setSelected(r.other.id)}
                          className="flex w-full items-center justify-between gap-2 rounded border border-rule px-2.5 py-1.5 text-left transition-colors hover:border-foreground"
                        >
                          <span className="mono truncate text-[11px] text-foreground">
                            <span className="text-ink-muted">{r.label}</span> · {r.other.label}
                          </span>
                          <span className="mono text-[10px] text-ink-muted">{r.confidence.toFixed(2)}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">source snippet</div>
                  <div className="mt-2 rounded border border-rule bg-surface p-3">
                    <p className="text-[11px] italic leading-relaxed text-foreground/85">"{inspector.snippet}"</p>
                    <div className="mono mt-2 border-t border-rule pt-2 text-[9px] uppercase tracking-[0.12em] text-ink-muted">
                      {inspector.source}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="mono flex-1 rounded border border-rule px-2.5 py-1.5 text-[10px] uppercase tracking-[0.12em] text-foreground hover:border-foreground">
                    open source
                  </button>
                  <button
                    onClick={() => {
                      const json = JSON.stringify({ id: selectedNode.id, label: selectedNode.label, kind: selectedNode.kind, ...inspector }, null, 2);
                      if (typeof navigator !== "undefined" && navigator.clipboard) navigator.clipboard.writeText(json);
                    }}
                    className="mono flex-1 rounded px-2.5 py-1.5 text-[10px] uppercase tracking-[0.12em] text-ink-muted hover:text-foreground"
                  >
                    copy JSON
                  </button>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>

      <p className="mt-6 text-center text-[12px] text-ink-muted">
        Prototype with canned data. Wire real corpora via the{" "}
        <a href="https://github.com/OpenGraphAI/opengraph-ai" target="_blank" rel="noreferrer" className="underline hover:text-foreground">SDK →</a>
        {" · "}
        <Link to="/how-it-works" className="underline hover:text-foreground">how it works</Link>
      </p>
    </div>
  );
}

function StatusPill({ phase, pct }: { phase: Phase; pct: number }) {
  const map = {
    empty:   { text: "ready to build", color: "var(--pg-cyan)" },
    loading: { text: `building · ${pct}%`, color: "var(--accent)" },
    ready:   { text: "graph ready", color: "var(--pg-green)" },
  }[phase];
  return (
    <span className="mono inline-flex items-center gap-1.5 rounded-full border border-rule bg-background px-2.5 py-1 text-[10px] uppercase tracking-[0.12em]">
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: map.color }} />
      {map.text}
    </span>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-right leading-none">
      <div className="mono text-[9px] uppercase tracking-[0.14em] text-ink-muted">{label}</div>
      <div className="mono mt-0.5 text-[13px] text-foreground">{value}</div>
    </div>
  );
}

function CodeBlock({ lang, children }: { lang: string; children: string }) {
  return (
    <pre className="mono overflow-auto rounded border border-rule bg-surface p-3 text-[11px] leading-relaxed text-foreground">
      <div className="mono mb-2 text-[9px] uppercase tracking-[0.14em] text-ink-muted">{lang}</div>
      <code>{children}</code>
    </pre>
  );
}

