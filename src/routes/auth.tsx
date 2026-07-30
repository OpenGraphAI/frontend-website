import { createFileRoute, useNavigate, useRouter, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Logo } from "@/components/site-chrome";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — OpenGraph AI" },
      { name: "description", content: "Create an account or sign in to OpenGraph AI." },
    ],
  }),
  component: AuthPage,
});

const schema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(6, "At least 6 characters").max(72),
});

function AuthPage() {
  const navigate = useNavigate();
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [forgot, setForgot] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/dashboard" });
    });
  }, [navigate]);

  async function onGoogle() {
    setError(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/dashboard",
    });
    if (result.error) { setError(result.error.message ?? "Google sign-in failed"); return; }
    if (result.redirected) return;
    await router.invalidate();
    navigate({ to: "/dashboard" });
  }

  async function onForgot(e: React.FormEvent) {
    e.preventDefault();
    setError(null); setInfo(null);
    const r = z.string().trim().email().max(255).safeParse(email);
    if (!r.success) { setError("Enter a valid email"); return; }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(r.data, {
      redirectTo: window.location.origin + "/reset-password",
    });
    setLoading(false);
    if (error) { setError(error.message); return; }
    setInfo("Check your email for a reset link.");
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null); setInfo(null);
    const r = schema.safeParse({ email, password });
    if (!r.success) { setError(r.error.issues[0]?.message ?? "Invalid input"); return; }
    setLoading(true);
    try {
      const { error } =
        mode === "signup"
          ? await supabase.auth.signUp({
              email: r.data.email,
              password: r.data.password,
              options: { emailRedirectTo: window.location.origin + "/dashboard" },
            })
          : await supabase.auth.signInWithPassword({
              email: r.data.email,
              password: r.data.password,
            });
      if (error) { setError(error.message); return; }
      await router.invalidate();
      navigate({ to: "/dashboard" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative grid min-h-[calc(100vh-3.5rem)] md:grid-cols-2">
      <div className="relative hidden overflow-hidden border-r border-rule bg-surface md:block">
        <div className="absolute inset-0 grid-bg opacity-60" />
        <div className="relative flex h-full flex-col justify-between p-10">
          <div className="flex items-center gap-2">
            <Logo className="h-5 w-5" />
            <span className="text-[15px] font-medium">OpenGraph<span className="text-accent">AI</span></span>
          </div>
          <div>
            <h2 className="display text-[52px] leading-[1] text-balance">
              A context graph for<br /><span className="italic text-ink-muted">every agent you ship.</span>
            </h2>
            <p className="mt-5 max-w-sm text-[14px] text-ink-muted">
              Free during research preview. No credit card required.
            </p>
          </div>
          <div className="mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">v0.1 · research preview</div>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <h1 className="display text-[44px] leading-[1.05]">
            {forgot ? "Reset password" : mode === "signup" ? "Create your account" : "Welcome back"}
          </h1>
          <p className="mt-2 text-[14px] text-ink-muted">
            {forgot
              ? "We'll email you a link to set a new password."
              : mode === "signup" ? "Get to the playground in seconds." : "Sign in to continue."}
          </p>

          {!forgot && (
            <button
              onClick={onGoogle}
              type="button"
              className="mt-7 inline-flex w-full items-center justify-center gap-2.5 rounded-full border border-rule bg-background px-5 py-3 text-[14px] hover:bg-surface"
            >
              <GoogleIcon /> Continue with Google
            </button>
          )}

          {!forgot && (
            <div className="my-5 flex items-center gap-3 text-[11px] uppercase tracking-[0.16em] text-ink-muted mono">
              <span className="h-px flex-1 bg-rule" /> or email <span className="h-px flex-1 bg-rule" />
            </div>
          )}

          <form onSubmit={forgot ? onForgot : onSubmit} className="space-y-5">
            <label className="block">
              <div className="mono text-[11px] uppercase tracking-[0.16em] text-ink-muted">Email</div>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)} required maxLength={255}
                className="mt-1 w-full border-0 border-b border-rule bg-transparent py-2.5 text-[15px] outline-none focus:border-foreground"
                autoComplete="email"
              />
            </label>
            {!forgot && (
              <label className="block">
                <div className="mono text-[11px] uppercase tracking-[0.16em] text-ink-muted">Password</div>
                <input
                  type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} maxLength={72}
                  className="mt-1 w-full border-0 border-b border-rule bg-transparent py-2.5 text-[15px] outline-none focus:border-foreground"
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                />
              </label>
            )}
            {error && <div className="text-[13px] text-destructive">{error}</div>}
            {info && <div className="text-[13px] text-accent">{info}</div>}
            <button
              type="submit" disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 py-3 text-[14px] text-background disabled:opacity-50"
            >
              {loading ? "…" : forgot ? "Send reset link →" : mode === "signup" ? "Create account →" : "Sign in →"}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between text-[13px]">
            <button
              onClick={() => { setForgot(false); setMode((m) => (m === "signup" ? "signin" : "signup")); setError(null); setInfo(null); }}
              className="text-ink-muted hover:text-foreground"
            >
              {forgot ? "← Back to sign in" : mode === "signup" ? "Have an account? Sign in" : "New here? Create an account"}
            </button>
            {!forgot && mode === "signin" && (
              <button onClick={() => { setForgot(true); setError(null); setInfo(null); }} className="text-ink-muted hover:text-foreground">
                Forgot password?
              </button>
            )}
          </div>

          <p className="mt-8 text-[12px] text-ink-muted">
            By continuing you agree to our{" "}
            <Link to="/" className="underline hover:text-foreground">terms</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M21.6 12.227c0-.709-.064-1.39-.182-2.045H12v3.868h5.382a4.6 4.6 0 0 1-1.995 3.018v2.51h3.227c1.887-1.737 2.986-4.296 2.986-7.35Z"/>
      <path fill="#34A853" d="M12 22c2.7 0 4.964-.895 6.618-2.422l-3.227-2.51c-.895.6-2.04.954-3.39.954-2.605 0-4.81-1.76-5.6-4.123H3.064v2.59A9.997 9.997 0 0 0 12 22Z"/>
      <path fill="#FBBC05" d="M6.4 13.9a6 6 0 0 1 0-3.8V7.51H3.064a9.997 9.997 0 0 0 0 8.98L6.4 13.9Z"/>
      <path fill="#EA4335" d="M12 5.977c1.468 0 2.786.504 3.823 1.495l2.868-2.868C16.96 2.99 14.696 2 12 2 8.09 2 4.71 4.245 3.064 7.51L6.4 10.1c.79-2.363 2.995-4.123 5.6-4.123Z"/>
    </svg>
  );
}
