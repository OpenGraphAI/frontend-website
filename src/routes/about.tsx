import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — OpenGraph AI" },
      { name: "description", content: "OpenGraph AI is building the open context layer for reasoning agents." },
      { property: "og:title", content: "About — OpenGraph AI" },
      { property: "og:description", content: "We're building the open context layer for reasoning agents." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: Page,
});

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  message: z.string().trim().min(1, "Tell us a bit").max(1000),
});

function Page() {
  const [status, setStatus] = useState<"idle" | "sent">("idle");
  const [errors, setErrors] = useState<Partial<Record<keyof z.infer<typeof schema>, string>>>({});

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data = { name: String(form.get("name") ?? ""), email: String(form.get("email") ?? ""), message: String(form.get("message") ?? "") };
    const r = schema.safeParse(data);
    if (!r.success) {
      const fe: typeof errors = {};
      for (const i of r.error.issues) fe[i.path[0] as keyof typeof errors] = i.message;
      setErrors(fe);
      return;
    }
    setErrors({});
    // Open mail client — no backend wired for the contact form
    const subject = encodeURIComponent(`OpenGraph AI — message from ${r.data.name}`);
    const body = encodeURIComponent(`${r.data.message}\n\n— ${r.data.name} (${r.data.email})`);
    window.location.href = `mailto:hello@opengraphai.io?subject=${subject}&body=${body}`;
    setStatus("sent");
  }

  return (
    <>
      <section className="mx-auto max-w-[1280px] px-6 pt-20 pb-12">
        <div className="mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">about</div>
        <h1 className="display mt-4 text-balance text-[64px] leading-[0.95] md:text-[88px]">
          The open context layer<br /><span className="text-ink-muted italic">for reasoning agents.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-[17px] text-ink-muted">
          We started OpenGraph AI because retrieval-augmented agents are stuck on text. Real problems live across
          tables, slides, recordings, and screenshots — and the answers live in the <em>relationships</em> between
          them. We're building a single, open graph layer so agents can reason across all of it.
        </p>
      </section>

      <section className="mx-auto max-w-[1280px] px-6">
        <div className="grid gap-12 border-t border-rule pt-12 md:grid-cols-2">
          <div>
            <h2 className="display text-[40px] leading-[1.05]">Principles</h2>
            <ul className="mt-6 space-y-5">
              {[
                ["Open by default", "Apache-2.0 core. Self-host or use the hosted version. Your graph is portable."],
                ["Modality-agnostic", "If a model can read it, we can graph it. Tables, text, image, audio, video, code."],
                ["Composable", "Bring your own extractor, LLM, embeddings, or graph store. We orchestrate."],
                ["Agent-native", "Designed to be a single tool an agent reaches for — not a service it babysits."],
              ].map(([t, d]) => (
                <li key={t} className="grid grid-cols-[18px_1fr] gap-4">
                  <span className="mt-2.5 inline-block h-1.5 w-1.5 rounded-full bg-accent" />
                  <div>
                    <div className="font-medium">{t}</div>
                    <div className="text-[14px] text-ink-muted">{d}</div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap gap-2 text-[13px]">
              <a className="hairline rounded-full px-4 py-2 hover:border-foreground" href="https://www.opengraphai.io" target="_blank" rel="noreferrer">opengraphai.io ↗</a>
              <a className="hairline rounded-full px-4 py-2 hover:border-foreground" href="https://github.com/OpenGraphAI/opengraph-ai" target="_blank" rel="noreferrer">GitHub ↗</a>
              <a className="hairline rounded-full px-4 py-2 hover:border-foreground" href="https://www.linkedin.com/company/opengraph-ai" target="_blank" rel="noreferrer">LinkedIn ↗</a>
            </div>
          </div>

          <div>
            <h2 className="display text-[40px] leading-[1.05]">Talk to us</h2>
            <p className="mt-3 text-[15px] text-ink-muted">
              Looking for design partners, especially teams building research agents and enterprise memory.
            </p>
            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <Field label="Name" name="name" error={errors.name} />
              <Field label="Email" name="email" type="email" error={errors.email} />
              <Field label="What are you building?" name="message" multiline error={errors.message} />
              <button className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-[14px] text-background hover:-translate-y-px transition-transform">
                Send message →
              </button>
              {status === "sent" && <p className="text-[13px] text-ink-muted">Thanks — we'll be in touch.</p>}
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

function Field({ label, name, type = "text", multiline = false, error }: { label: string; name: string; type?: string; multiline?: boolean; error?: string }) {
  const cls = "w-full border-0 border-b border-rule bg-transparent px-0 py-2.5 text-[15px] outline-none focus:border-foreground placeholder:text-ink-muted/50";
  return (
    <label className="block">
      <div className="mono text-[11px] uppercase tracking-[0.16em] text-ink-muted">{label}</div>
      {multiline ? (
        <textarea name={name} rows={4} maxLength={1000} className={cls + " resize-none"} />
      ) : (
        <input name={name} type={type} maxLength={255} className={cls} />
      )}
      {error && <div className="mt-1 text-[12px] text-destructive">{error}</div>}
    </label>
  );
}
