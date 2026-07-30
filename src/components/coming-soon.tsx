import { Link } from "@tanstack/react-router";

export function ComingSoon({
  eyebrow,
  title,
  blurb,
}: {
  eyebrow: string;
  title: string;
  blurb: string;
}) {
  return (
    <section className="mx-auto max-w-[1280px] px-6 pt-20 pb-24">
      <div className="mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">{eyebrow}</div>
      <h1 className="display mt-4 text-balance text-[56px] leading-[0.98] md:text-[80px]">{title}</h1>
      <p className="mt-6 max-w-xl text-[16px] text-ink-muted">{blurb}</p>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-rule bg-surface px-3.5 py-1.5 text-[12px] text-ink-muted">
          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-accent animate-pulse-dot" />
          Coming soon
        </span>
        <Link to="/opengraph-image" className="text-[13px] text-ink-muted hover:text-foreground">
          See OpenGraph Image →
        </Link>
      </div>
    </section>
  );
}