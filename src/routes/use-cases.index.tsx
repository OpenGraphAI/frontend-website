import { createFileRoute, Link } from "@tanstack/react-router";
import { USE_CASES } from "@/data/use-cases";
import { UseCaseVisual } from "@/components/use-case-visual";
import { PlaygroundCtaBanner } from "@/components/playground-cta-banner";

export const Route = createFileRoute("/use-cases/")({
  head: () => ({
    meta: [
      { title: "Use cases — OpenGraph AI" },
      { name: "description", content: "Research agents, enterprise memory, investigative analysis, multimodal RAG, and more." },
      { property: "og:title", content: "Use cases — OpenGraph AI" },
      { property: "og:description", content: "Where context graphs beat vector search." },
      { property: "og:url", content: "/use-cases" },
    ],
    links: [{ rel: "canonical", href: "/use-cases" }],
  }),
  component: Page,
});

function Page() {
  return (
    <>
      <section className="mx-auto max-w-[1280px] px-6 pt-20 pb-10">
        <div className="mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">use cases</div>
        <h1 className="display mt-4 text-balance text-[64px] leading-[0.95] md:text-[88px]">
          Where graphs<br /><span className="text-ink-muted italic">beat vector search.</span>
        </h1>
        <p className="mt-6 max-w-xl text-[16px] text-ink-muted">
          Anywhere an agent needs to answer questions that span <em>relationships</em>, not just text.
          A few places teams are using OpenGraph AI today.
        </p>
      </section>

      <section className="mx-auto max-w-[1280px] px-6">
        <div className="grid gap-3 md:grid-cols-2">
          {USE_CASES.map((c) => (
            <Link
              key={c.slug}
              to="/use-cases/$slug"
              params={{ slug: c.slug }}
              className="group hairline block rounded-2xl p-6 transition-colors hover:bg-surface"
            >
              <UseCaseVisual slug={c.slug} />
              <div className="mt-5 flex items-center justify-between">
                <span className="mono text-[11px] uppercase tracking-[0.18em] text-accent">for {c.tag}</span>
                <div className="flex items-center gap-2">
                  {c.slug === "research-agents" && (
                    <span className="mono rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-accent">
                      Featured prototype
                    </span>
                  )}
                  <span className="text-ink-muted transition-transform group-hover:translate-x-1">→</span>
                </div>
              </div>
              <h2 className="display mt-3 text-[28px] leading-[1.05]">{c.title}</h2>
              <p className="mt-3 text-[14px] text-ink-muted">{c.short}</p>
              <span className="mono mt-5 inline-block text-[12px] text-foreground/70 group-hover:text-foreground">
                {c.slug === "research-agents" ? "Explore use case →" : "Read more →"}
              </span>
            </Link>
          ))}
        </div>

      </section>
      <PlaygroundCtaBanner />
    </>
  );
}
