import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProjectKnowledgeGraph } from "@/components/project-knowledge-graph";
import { buildMockGraph, fakeAnswer } from "@/lib/mock-graph";

export const Route = createFileRoute("/_authenticated/graph/$id")({
  head: () => ({ meta: [{ title: "Graph — OpenGraph AI" }] }),
  component: GraphWorkspace,
});

type SourceRow = { id: string; filename: string; size_bytes: number | null; created_at: string };
type MsgRow = { id: string; role: string; content: string; trace: string[] };

function GraphWorkspace() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [renaming, setRenaming] = useState(false);
  const [sources, setSources] = useState<SourceRow[]>([]);
  const [messages, setMessages] = useState<MsgRow[]>([]);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    const [{ data: g }, { data: s }, { data: m }] = await Promise.all([
      supabase.from("graphs").select("name").eq("id", id).maybeSingle(),
      supabase.from("sources").select("id,filename,size_bytes,created_at").eq("graph_id", id).order("created_at", { ascending: true }),
      supabase.from("chat_messages").select("id,role,content,trace").eq("graph_id", id).order("created_at", { ascending: true }),
    ]);
    if (!g) { navigate({ to: "/dashboard" }); return; }
    setName(g.name);
    setSources((s ?? []) as SourceRow[]);
    setMessages(((m ?? []) as { id: string; role: string; content: string; trace: unknown }[]).map((r) => ({
      ...r, trace: Array.isArray(r.trace) ? r.trace as string[] : [],
    })));
  }

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [id]);

  async function regenGraph(allFiles: SourceRow[]) {
    const g = buildMockGraph(allFiles.map((s) => s.filename));
    await supabase.from("graphs").update({
      nodes: g.nodes, edges: g.edges,
      node_count: g.nodes.length, edge_count: g.edges.length,
    }).eq("id", id);
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setUploading(true);
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) { setUploading(false); return; }
    const path = `${u.user.id}/${id}/${Date.now()}-${f.name}`;
    const up = await supabase.storage.from("sources").upload(path, f, { upsert: false });
    if (up.error) { alert(up.error.message); setUploading(false); return; }
    const { data: ins, error: insErr } = await supabase.from("sources").insert({
      graph_id: id, user_id: u.user.id, filename: f.name,
      mime_type: f.type || null, size_bytes: f.size, storage_path: path,
    }).select("id,filename,size_bytes,created_at").single();
    if (insErr || !ins) { setUploading(false); return; }
    const next = [...sources, ins as SourceRow];
    setSources(next);
    await regenGraph(next);
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function removeSource(s: SourceRow, storagePath?: string | null) {
    if (storagePath) await supabase.storage.from("sources").remove([storagePath]);
    await supabase.from("sources").delete().eq("id", s.id);
    const next = sources.filter((x) => x.id !== s.id);
    setSources(next);
    await regenGraph(next);
  }

  async function ask(question: string) {
    if (!question.trim() || busy) return;
    setBusy(true);
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) { setBusy(false); return; }
    // build graph for answer (regenerate from current sources to get node labels)
    const g = buildMockGraph(sources.map((s) => s.filename));
    const answer = fakeAnswer(question, g.nodes);
    const { data: ins } = await supabase.from("chat_messages").insert([
      { graph_id: id, user_id: u.user.id, role: "user", content: question, trace: [] },
      { graph_id: id, user_id: u.user.id, role: "graph", content: answer.content, trace: answer.trace },
    ]).select("id,role,content,trace");
    if (ins) setMessages([...messages, ...(ins as MsgRow[])]);
    setQ("");
    setBusy(false);
  }

  async function saveName() {
    setRenaming(false);
    await supabase.from("graphs").update({ name }).eq("id", id);
  }

  const hasSources = sources.length > 0;
  const projectGraph = useMemo(
    () => buildMockGraph(sources.map((s) => s.filename)),
    [sources],
  );

  return (
    <div className="mx-auto max-w-[1280px] px-6 pt-8 pb-16">
      {/* header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <Link to="/dashboard" className="mono text-[11px] uppercase tracking-[0.18em] text-ink-muted hover:text-foreground">← dashboard</Link>
          {renaming ? (
            <input autoFocus value={name} onChange={(e) => setName(e.target.value)} onBlur={saveName}
              onKeyDown={(e) => e.key === "Enter" && saveName()}
              className="display mt-3 block w-full max-w-md border-0 border-b border-rule bg-transparent text-[36px] leading-tight outline-none focus:border-foreground" />
          ) : (
            <h1 onClick={() => setRenaming(true)} className="display mt-3 text-[36px] leading-tight cursor-text hover:text-accent">
              {name || "Untitled graph"}
            </h1>
          )}
        </div>
        <span className="mono inline-flex items-center gap-1.5 rounded-full border border-rule px-3 py-1 text-[11px]">
          <span className={`h-1.5 w-1.5 rounded-full ${hasSources ? "bg-accent animate-pulse-dot" : "bg-ink-muted"}`} />
          {hasSources ? "ready" : "empty"}
        </span>
      </div>

      <div className="mt-6 grid gap-3 lg:grid-cols-[240px_minmax(0,1fr)_280px]">
        {/* sources */}
        <aside className="rounded-2xl border border-rule bg-card p-4">
          <div className="mono text-[11px] uppercase tracking-[0.16em] text-ink-muted">sources</div>
          <div onClick={() => fileRef.current?.click()}
            className="mt-3 cursor-pointer rounded-xl border border-dashed border-rule p-5 text-center transition-colors hover:border-foreground">
            <input ref={fileRef} type="file" className="hidden" onChange={onFile} />
            <div className="display text-[22px] leading-tight">{uploading ? "Uploading…" : "Add file"}</div>
            <div className="mt-1 text-[12px] text-ink-muted">pdf · mp3 · png · csv · txt</div>
          </div>

          <div className="mt-5 space-y-2">
            {sources.length === 0
              ? <p className="text-[13px] text-ink-muted">No files yet.</p>
              : sources.map((s) => (
                <div key={s.id} className="group flex items-center justify-between rounded-lg border border-rule px-3 py-2 text-[12px] mono">
                  <span className="truncate">{s.filename}</span>
                  <button onClick={() => removeSource(s)} className="ml-2 opacity-0 transition-opacity group-hover:opacity-100 text-ink-muted hover:text-destructive">×</button>
                </div>
              ))}
          </div>
        </aside>

        {/* graph */}
        <div className="relative min-w-0">
          <ProjectKnowledgeGraph
            nodes={projectGraph.nodes}
            edges={projectGraph.edges}
            projectName={name}
            height={440}
          />
        </div>

        {/* chat */}
        <aside className="flex flex-col rounded-2xl border border-rule bg-card p-4 min-w-0">
          <div className="mono text-[11px] uppercase tracking-[0.16em] text-ink-muted">ask the graph</div>
          <div className="mt-3 flex-1 space-y-3 overflow-auto" style={{ maxHeight: 320 }}>
            {messages.length === 0 && (
              <p className="text-[13px] text-ink-muted">Ask a question once you've added sources. Your chat history is saved here.</p>
            )}
            {messages.map((m) => (
              <div key={m.id} className={m.role === "user" ? "rounded-xl bg-surface px-3 py-2 text-[13px]" : "rounded-xl border border-rule px-3 py-2 text-[13px]"}>
                <span className="mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">{m.role === "user" ? "you" : "graph"}</span>
                <div>{m.content}</div>
                {m.trace.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {m.trace.map((t, i) => (
                      <span key={i} className="mono rounded-full border border-rule px-2 py-0.5 text-[10px] text-ink-muted">{t}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); ask(q); }} className="mt-3 flex gap-2 border-t border-rule pt-3">
            <input value={q} onChange={(e) => setQ(e.target.value)}
              placeholder={hasSources ? "Ask anything…" : "Add a file first"}
              disabled={!hasSources || busy} maxLength={400}
              className="flex-1 rounded-full border border-rule bg-transparent px-4 py-2 text-[13px] outline-none focus:border-foreground disabled:opacity-50" />
            <button disabled={!hasSources || busy || !q.trim()}
              className="rounded-full bg-foreground px-4 py-2 text-[13px] text-background disabled:opacity-40">→</button>
          </form>
        </aside>
      </div>
    </div>
  );
}
