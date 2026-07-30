import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/site-chrome";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset password — OpenGraph AI" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Supabase fires PASSWORD_RECOVERY when the user lands here from the email link.
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(true);
    });
    // Also check current session in case the event already fired
    supabase.auth.getSession().then(({ data }) => { if (data.session) setReady(true); });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null); setInfo(null);
    const r = z.string().min(6, "At least 6 characters").max(72).safeParse(pw);
    if (!r.success) { setErr(r.error.issues[0]?.message ?? "Invalid"); return; }
    if (pw !== pw2) { setErr("Passwords don't match"); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: r.data });
    setLoading(false);
    if (error) { setErr(error.message); return; }
    setInfo("Password updated. Redirecting…");
    setTimeout(() => navigate({ to: "/dashboard" }), 800);
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-md flex-col justify-center px-6 py-16">
      <div className="flex items-center gap-2">
        <Logo className="h-5 w-5" />
        <span className="text-[15px] font-medium">OpenGraph<span className="text-accent">AI</span></span>
      </div>
      <h1 className="display mt-8 text-[40px] leading-[1.05]">Set a new password</h1>
      <p className="mt-2 text-[14px] text-ink-muted">
        {ready ? "Pick something you'll remember." : "Open this page from the email link to continue."}
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-5">
        <label className="block">
          <div className="mono text-[11px] uppercase tracking-[0.16em] text-ink-muted">New password</div>
          <input
            type="password" value={pw} onChange={(e) => setPw(e.target.value)}
            required minLength={6} maxLength={72} disabled={!ready}
            className="mt-1 w-full border-0 border-b border-rule bg-transparent py-2.5 text-[15px] outline-none focus:border-foreground disabled:opacity-50"
            autoComplete="new-password"
          />
        </label>
        <label className="block">
          <div className="mono text-[11px] uppercase tracking-[0.16em] text-ink-muted">Confirm</div>
          <input
            type="password" value={pw2} onChange={(e) => setPw2(e.target.value)}
            required minLength={6} maxLength={72} disabled={!ready}
            className="mt-1 w-full border-0 border-b border-rule bg-transparent py-2.5 text-[15px] outline-none focus:border-foreground disabled:opacity-50"
            autoComplete="new-password"
          />
        </label>
        {err && <div className="text-[13px] text-destructive">{err}</div>}
        {info && <div className="text-[13px] text-accent">{info}</div>}
        <button
          type="submit" disabled={loading || !ready}
          className="inline-flex w-full items-center justify-center rounded-full bg-foreground px-5 py-3 text-[14px] text-background disabled:opacity-50"
        >
          {loading ? "…" : "Update password →"}
        </button>
      </form>
    </div>
  );
}
