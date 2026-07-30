import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { USE_CASES, getUseCase } from "@/data/use-cases";
import { AnimatedGraph } from "@/components/animated-graph";
import { PlaygroundCtaBanner } from "@/components/playground-cta-banner";
import { KnowledgeGraph } from "@/components/knowledge-graph";
import { RESEARCH_NODES, RESEARCH_LINKS } from "@/data/research-graph";

export const Route = createFileRoute("/use-cases/$slug")({
  loader: ({ params }) => {
    const useCase = getUseCase(params.slug);
    if (!useCase) throw notFound();
    return { useCase };
  },
  head: ({ loaderData }) => {
    const u = loaderData?.useCase;
    if (!u) {
      return { meta: [{ title: "Use case — OpenGraph AI" }] };
    }
    if (u.slug === "research-agents") {
      const t = "Research Knowledge Graph — OpenGraph AI";
      const d =
        "OpenGraph turns papers, authors, institutions, citations, and topics into a connected graph that research agents can traverse.";
      return {
        meta: [
          { title: t },
          { name: "description", content: d },
          { property: "og:title", content: t },
          { property: "og:description", content: d },
          { property: "og:url", content: `/use-cases/${u.slug}` },
        ],
        links: [{ rel: "canonical", href: `/use-cases/${u.slug}` }],
      };
    }
    return {
      meta: [
        { title: `${u.title} — OpenGraph AI` },
        { name: "description", content: u.short },
        { property: "og:title", content: `${u.title} — OpenGraph AI` },
        { property: "og:description", content: u.short },
        { property: "og:url", content: `/use-cases/${u.slug}` },
      ],
      links: [{ rel: "canonical", href: `/use-cases/${u.slug}` }],
    };
  },
  component: UseCasePage,
  notFoundComponent: () => (
    <section className="mx-auto max-w-[1280px] px-6 py-32">
      <div className="mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">404</div>
      <h1 className="display mt-4 text-[56px] leading-[1]">Use case not found.</h1>
      <Link to="/use-cases" className="mt-6 inline-block text-[14px] hover:text-accent">← Back to use cases</Link>
    </section>
  ),
  errorComponent: ({ error }) => (
    <section className="mx-auto max-w-[1280px] px-6 py-32">
      <div className="mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">error</div>
      <h1 className="display mt-4 text-[44px] leading-[1.05]">Something went wrong.</h1>
      <p className="mt-3 text-ink-muted text-[14px]">{error.message}</p>
      <Link to="/use-cases" className="mt-6 inline-block text-[14px] hover:text-accent">← Back to use cases</Link>
    </section>
  ),
});

function UseCasePage() {
  const { useCase: u } = Route.useLoaderData();
  const others = USE_CASES.filter((x) => x.slug !== u.slug).slice(0, 3);

  if (u.slug === "research-agents") {
    return <ResearchAgentsPage others={others} />;
  }

  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-[1280px] px-6 pt-20 pb-10">
        <Link to="/use-cases" className="mono text-[11px] uppercase tracking-[0.18em] text-ink-muted hover:text-foreground">
          ← use cases
        </Link>
        <div className="mt-6 flex items-center gap-3">
          <span className="mono text-[11px] uppercase tracking-[0.18em] text-accent">{u.tag}</span>
          <span className="h-px w-10 bg-rule" />
          <span className="mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">use case</span>
        </div>
        <h1 className="display mt-5 text-balance text-[56px] leading-[0.98] md:text-[80px]">{u.title}</h1>
        <p className="mt-6 max-w-2xl text-[17px] text-ink-muted">{u.description}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/playground" className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-[14px] font-medium text-background hover:-translate-y-px transition-transform">
            Try it in the playground →
          </Link>
          <Link to="/how-it-works" className="inline-flex items-center gap-2 rounded-full border border-rule px-5 py-3 text-[14px] hover:border-foreground">
            How it works
          </Link>
        </div>
      </section>

      {/* Graph + bullets */}
      <section className="mx-auto max-w-[1280px] px-6">
        <div className="grid gap-6 md:grid-cols-12">
          <div className="md:col-span-7 rounded-2xl border border-rule overflow-hidden bg-card">
            <AnimatedGraph height={420} interactive />
          </div>
          <div className="md:col-span-5">
            <div className="mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">what you get</div>
            <ul className="mt-4 space-y-3">
              {u.bullets.map((b: string) => (
                <li key={b} className="flex items-start gap-3 text-[15px]">
                  <span className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-accent" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Sources / Outputs */}
      <section className="mx-auto max-w-[1280px] px-6 pt-20">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-rule p-8 bg-surface">
            <div className="mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">sources in</div>
            <ul className="mt-5 space-y-2 text-[14px]">
              {u.sources.map((s: string) => (
                <li key={s} className="flex items-center gap-2">
                  <span className="mono text-ink-muted">→</span> {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-rule p-8 bg-surface">
            <div className="mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">what comes out</div>
            <ul className="mt-5 space-y-2 text-[14px]">
              {u.outputs.map((s: string) => (
                <li key={s} className="flex items-center gap-2">
                  <span className="mono text-accent">◇</span> {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Example Q&A */}
      <section className="mx-auto max-w-[1280px] px-6 pt-20">
        <div className="mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">example</div>
        <h2 className="display mt-3 text-[40px] leading-[1.05]">A question your agent can now answer.</h2>
        <div className="mt-8 overflow-hidden rounded-2xl border border-rule bg-[#0f0f10]">
          <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
            <span className="mono ml-3 text-[11px] text-white/40">agent.session</span>
          </div>
          <div className="p-6 md:p-8 mono text-[13px] leading-[1.7] text-white/90">
            <div className="text-white/40">{">"} ask</div>
            <div className="mt-1">{u.example.question}</div>
            <div className="mt-5 text-white/40">{">"} graph</div>
            <div className="mt-1 text-accent">{u.example.answer}</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <PlaygroundCtaBanner />

      {/* Other use cases */}
      <section className="mx-auto mt-24 max-w-[1280px] px-6 pb-10">
        <div className="mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">more use cases</div>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {others.map((o) => (
            <Link
              key={o.slug}
              to="/use-cases/$slug"
              params={{ slug: o.slug }}
              className="group hairline block rounded-2xl p-6 transition-colors hover:bg-surface"
            >
              <div className="mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">{o.tag}</div>
              <div className="display mt-3 text-[22px] leading-[1.1]">{o.title}</div>
              <span className="mono mt-4 inline-block text-[12px] text-foreground/70 group-hover:text-foreground">Read →</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

function ResearchAgentsPage({ others }: { others: typeof USE_CASES }) {
  return (
    <>
      <section className="mx-auto max-w-[1280px] px-6 pt-20 pb-10">
        <Link to="/use-cases" className="mono text-[11px] uppercase tracking-[0.18em] text-ink-muted hover:text-foreground">
          ← use cases
        </Link>
        <div className="mt-6 flex items-center gap-3">
          <span className="mono text-[11px] uppercase tracking-[0.18em] text-accent">research</span>
          <span className="h-px w-10 bg-rule" />
          <span className="mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">featured prototype</span>
        </div>
        <h1 className="display mt-5 text-balance text-[56px] leading-[0.98] md:text-[80px]">Research Knowledge Graph</h1>
        <p className="mt-6 max-w-2xl text-[17px] text-ink-muted">
          OpenGraph converts research documents into a connected graph of papers, authors, institutions, and topics —
          so an agent can answer questions by <em>walking the relationships</em>, not just reading paragraphs.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/playground" className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-[14px] font-medium text-background hover:-translate-y-px transition-transform">
            Try it in the playground →
          </Link>
          <Link to="/how-it-works" className="inline-flex items-center gap-2 rounded-full border border-rule px-5 py-3 text-[14px] hover:border-foreground">
            How it works
          </Link>
        </div>
      </section>

      {/* Problem */}
      <section className="mx-auto max-w-[1280px] px-6 pt-10">
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">the problem</div>
            <h2 className="display mt-3 text-[36px] leading-[1.05]">Research is a graph pretending to be a pile of PDFs.</h2>
          </div>
          <div className="md:col-span-7 md:col-start-6 text-[15.5px] text-ink-muted space-y-4">
            <p>
              A single research question spans <span className="text-foreground">papers, authors, institutions, citations, and topics</span> —
              but that structure lives implicitly across a folder of documents.
            </p>
            <p>
              Vector search returns the paragraphs most similar to a query. It does not know that Paper B cites Paper A,
              that both authors work on adjacent topics, or which institutions are behind the work.
            </p>
          </div>
        </div>
      </section>

      {/* How OpenGraph helps */}
      <section className="mx-auto max-w-[1280px] px-6 pt-20">
        <div className="mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">how opengraph helps</div>
        <h2 className="display mt-3 text-[40px] leading-[1.05]">Extract entities. Connect relationships. Query the graph.</h2>
        <div className="mt-8 grid gap-3 md:grid-cols-3">
          {[
            { k: "01", t: "Extract entities", d: "Parse research documents into typed nodes — papers, authors, institutions, topics." },
            { k: "02", t: "Connect relationships", d: "Link entities with typed edges: authored, affiliated with, discusses, cites, related to." },
            { k: "03", t: "Query the graph", d: "Walk the graph to answer questions vector search can't — cited by, co-authored, related topics." },
          ].map((s) => (
            <div key={s.k} className="rounded-2xl border border-rule bg-surface p-6">
              <div className="mono text-[11px] uppercase tracking-[0.18em] text-accent">{s.k}</div>
              <div className="display mt-3 text-[22px] leading-[1.1]">{s.t}</div>
              <p className="mt-2 text-[13.5px] text-ink-muted">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive graph */}
      <section className="mx-auto max-w-[1280px] px-6 pt-20">
        <div className="mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">interactive graph</div>
        <h2 className="display mt-3 text-[40px] leading-[1.05]">A slice of a research corpus.</h2>
        <p className="mt-3 max-w-2xl text-[14.5px] text-ink-muted">
          A tiny sample of the kind of graph OpenGraph produces. Drag nodes, zoom, or select an entity to inspect its relationships.
        </p>
        <div className="mt-8">
          <KnowledgeGraph nodes={RESEARCH_NODES} links={RESEARCH_LINKS} height={560} />
        </div>
      </section>

      {/* Example insights */}
      <section className="mx-auto max-w-[1280px] px-6 pt-20">
        <div className="mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">example insights</div>
        <h2 className="display mt-3 text-[36px] leading-[1.05]">Questions your agent can now answer.</h2>
        <div className="mt-8 grid gap-3 md:grid-cols-3">
          {[
            { q: "Which authors at Stanford publish on Knowledge Graphs?", a: "→ Dr. Maya Chen · affiliated with Stanford · discusses Knowledge Graphs (via Paper A)." },
            { q: "What papers cite Paper A?", a: "→ Paper B cites Paper A. Path: Paper B → cites → Paper A." },
            { q: "How are Machine Learning and AI related in this corpus?", a: "→ Machine Learning related to Artificial Intelligence. Knowledge Graphs also related to Artificial Intelligence." },
          ].map((c, i) => (
            <div key={i} className="rounded-2xl border border-rule p-6 bg-[#0f0f10] text-white/90">
              <div className="mono text-[10px] uppercase tracking-[0.16em] text-white/40">Q</div>
              <div className="mt-1 text-[14px]">{c.q}</div>
              <div className="mono mt-4 text-[10px] uppercase tracking-[0.16em] text-white/40">A</div>
              <div className="mt-1 text-[13px] text-accent">{c.a}</div>
            </div>
          ))}
        </div>
      </section>

      <PlaygroundCtaBanner />

      {/* Other use cases */}
      <section className="mx-auto mt-24 max-w-[1280px] px-6 pb-10">
        <div className="mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">more use cases</div>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {others.map((o) => (
            <Link
              key={o.slug}
              to="/use-cases/$slug"
              params={{ slug: o.slug }}
              className="group hairline block rounded-2xl p-6 transition-colors hover:bg-surface"
            >
              <div className="mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">{o.tag}</div>
              <div className="display mt-3 text-[22px] leading-[1.1]">{o.title}</div>
              <span className="mono mt-4 inline-block text-[12px] text-foreground/70 group-hover:text-foreground">Read →</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
