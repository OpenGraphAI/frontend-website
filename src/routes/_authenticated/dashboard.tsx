import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — OpenGraph AI" }] }),
  component: Dashboard,
});

type Graph = { id: string; name: string; node_count: number; edge_count: number; updated_at: string };
type Profile = { full_name: string | null; avatar_url: string | null };

function Dashboard() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState<Profile>({ full_name: "", avatar_url: "" });
  const [editing, setEditing] = useState(false);
  const [graphs, setGraphs] = useState<Graph[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  async function load() {
    setLoading(true);
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    setEmail(u.user.email ?? "");
    const [{ data: g }, { data: p }] = await Promise.all([
      supabase.from("graphs").select("id,name,node_count,edge_count,updated_at").order("updated_at", { ascending: false }),
      supabase.from("profiles").select("full_name,avatar_url").eq("id", u.user.id).maybeSingle(),
    ]);
    setGraphs((g ?? []) as Graph[]);
    if (p) setProfile({ full_name: p.full_name, avatar_url: p.avatar_url });
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function createGraph() {
    setCreating(true);
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    const { data, error } = await supabase
      .from("graphs")
      .insert({ user_id: u.user.id, name: "New graph" })
      .select("id")
      .single();
    setCreating(false);
    if (error || !data) return;
    navigate({ to: "/graph/$id", params: { id: data.id } });
  }

  async function deleteGraph(id: string) {
    if (!confirm("Delete this graph and all its files?")) return;
    await supabase.from("graphs").delete().eq("id", id);
    load();
  }

  async function saveProfile() {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    await supabase.from("profiles").update({
      full_name: profile.full_name,
      avatar_url: profile.avatar_url,
    }).eq("id", u.user.id);
    setEditing(false);
  }

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  }

  return (
    <div className="mx-auto max-w-[1280px] px-6 pt-10 pb-20">
      {/* header */}
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <div className="mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">dashboard</div>
          <h1 className="display mt-3 text-[44px] leading-[1]">
            Hi, {profile.full_name || email.split("@")[0]}
          </h1>
        </div>
        <div className="flex items-center gap-3 text-[13px]">
          <button onClick={() => setEditing((v) => !v)} className="text-ink-muted hover:text-foreground">
            {editing ? "Cancel" : "Edit profile"}
          </button>
          <span className="text-ink-muted">·</span>
          <button onClick={signOut} className="text-ink-muted hover:text-foreground">Sign out</button>
        </div>
      </div>

      {editing && (
        <div className="mt-6 rounded-2xl border border-rule bg-card p-5">
          <div className="grid gap-4 sm:grid-cols-[80px_minmax(0,1fr)]">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-surface text-2xl overflow-hidden">
              {profile.avatar_url
                ? <img src={profile.avatar_url} alt="" className="h-full w-full object-cover" />
                : (profile.full_name?.[0] ?? email[0] ?? "?").toUpperCase()}
            </div>
            <div className="space-y-3">
              <label className="block">
                <div className="mono text-[11px] uppercase tracking-[0.16em] text-ink-muted">Name</div>
                <input value={profile.full_name ?? ""} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  className="mt-1 w-full border-0 border-b border-rule bg-transparent py-2 text-[14px] outline-none focus:border-foreground" />
              </label>
              <label className="block">
                <div className="mono text-[11px] uppercase tracking-[0.16em] text-ink-muted">Avatar URL</div>
                <input value={profile.avatar_url ?? ""} onChange={(e) => setProfile({ ...profile, avatar_url: e.target.value })}
                  placeholder="https://…" className="mt-1 w-full border-0 border-b border-rule bg-transparent py-2 text-[14px] outline-none focus:border-foreground" />
              </label>
              <button onClick={saveProfile} className="rounded-full bg-foreground px-4 py-2 text-[13px] text-background">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* graphs */}
      <div className="mt-12 flex items-end justify-between">
        <div>
          <div className="mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">your graphs</div>
          <h2 className="display mt-2 text-[28px]">Projects</h2>
        </div>
        <button onClick={createGraph} disabled={creating}
          className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-[13px] text-background disabled:opacity-50">
          {creating ? "…" : "+ New graph"}
        </button>
      </div>

      {loading ? (
        <p className="mt-6 text-[14px] text-ink-muted">Loading…</p>
      ) : graphs.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-rule p-10 text-center">
          <div className="display text-[28px]">No graphs yet</div>
          <p className="mt-2 text-[14px] text-ink-muted">Create your first graph and drop a file in to get started.</p>
          <button onClick={createGraph} className="mt-5 rounded-full bg-foreground px-5 py-2.5 text-[13px] text-background">+ New graph</button>
        </div>
      ) : (
        <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {graphs.map((g) => (
            <div key={g.id} className="group rounded-2xl border border-rule bg-card p-5 transition-colors hover:bg-surface">
              <Link to="/graph/$id" params={{ id: g.id }} className="block">
                <div className="mono text-[10px] uppercase tracking-[0.16em] text-ink-muted">
                  {new Date(g.updated_at).toLocaleDateString()}
                </div>
                <h3 className="display mt-2 text-[22px] leading-tight truncate">{g.name}</h3>
                <div className="mt-4 flex gap-4 text-[12px] text-ink-muted mono">
                  <span>{g.node_count} nodes</span>
                  <span>{g.edge_count} edges</span>
                </div>
              </Link>
              <button onClick={() => deleteGraph(g.id)}
                className="mt-4 text-[11px] text-ink-muted opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive">
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
