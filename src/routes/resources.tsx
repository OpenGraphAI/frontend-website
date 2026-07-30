import { createFileRoute, Link } from "@tanstack/react-router";
import { Reveal, RevealStagger, RevealItem } from "@/components/reveal";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Resources — OpenGraph AI" },
      { name: "description", content: "Documentation, guides, API references, and concept explainers for building with OpenGraph AI." },
      { property: "og:title", content: "Resources — OpenGraph AI" },
      { property: "og:description", content: "Docs, guides, API references and concept explainers." },
    ],
    links: [{ rel: "canonical", href: "/resources" }],
  }),
  component: ResourcesPage,
});

type Resource = {
  title: string;
  description: string;
  href?: string;
  to?: string;
  tag: string;
  external?: boolean;
};

const SECTIONS: { title: string; intro: string; items: Resource[] }[] = [
  {
    title: "Get started",
    intro: "Spin up a graph in under five minutes.",
    items: [
      { tag: "guide", title: "Quickstart", description: "From a folder of PDFs to a queryable graph in 5 minutes.", to: "/playground" },
      { tag: "guide", title: "Concepts: entities, relations, citations", description: "The three primitives every graph in OpenGraph AI is built on.", to: "/how-it-works" },
      { tag: "guide", title: "Choosing an ontology", description: "Infer one from your data, bring your own, or evolve over time.", to: "/how-it-works" },
    ],
  },
  {
    title: "Build",
    intro: "Reference material for the CLI, API, SDKs and MCP server.",
    items: [
      { tag: "ref", title: "CLI reference", description: "opengraph build / query / serve — every flag explained.", href: "https://github.com/OpenGraphAI/opengraph-ai", external: true },
      { tag: "ref", title: "REST API", description: "OpenAPI spec, auth, rate limits, streaming responses.", href: "https://github.com/OpenGraphAI/opengraph-ai", external: true },
      { tag: "ref", title: "Python SDK", description: "`pip install opengraph` — typed client with async support.", href: "https://github.com/OpenGraphAI/opengraph-ai", external: true },
      { tag: "ref", title: "TypeScript SDK", description: "`npm i @opengraph/sdk` — works in Node, edge and browser.", href: "https://github.com/OpenGraphAI/opengraph-ai", external: true },
      { tag: "ref", title: "MCP server", description: "Drop-in MCP transport for Claude, Cursor and Anthropic Agents.", href: "https://github.com/OpenGraphAI/opengraph-ai", external: true },
    ],
  },
  {
    title: "Patterns & recipes",
    intro: "Battle-tested recipes for the agent shapes people actually ship.",
    items: [
      { tag: "recipe", title: "Citation-grounded research agent", description: "Walk a graph of papers and lab notes with an audit trail.", to: "/use-cases/research-agents" },
      { tag: "recipe", title: "Enterprise memory across Slack + Drive + CRM", description: "Permission-aware subgraphs for agent-native onboarding.", to: "/use-cases/enterprise-memory" },
      { tag: "recipe", title: "Multimodal RAG with ranked subgraphs", description: "Replace top-k chunks with structured graph context.", to: "/use-cases/multimodal-rag" },
    ],
  },
  {
    title: "Reference",
    intro: "Specs, schemas, and the things you only need once.",
    items: [
      { tag: "spec", title: "Graph schema spec", description: "Typed nodes, edges, properties, evidence and provenance.", href: "https://github.com/OpenGraphAI/opengraph-ai", external: true },
      { tag: "spec", title: "Query language", description: "Natural language, GraphQL-style and Cypher-compatible queries.", href: "https://github.com/OpenGraphAI/opengraph-ai", external: true },
      { tag: "spec", title: "Self-hosting", description: "Run the extraction pipeline and graph runtime in your VPC.", href: "https://github.com/OpenGraphAI/opengraph-ai", external: true },
    ],
  },
];

function ResourcesPage() {
  return (
    <>
      <section className="mx-auto max-w-[1280px] px-6 pt-16 md:pt-24">
        <Reveal>
          <div className="mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">resources</div>
          <h1 className="display mt-3 text-balance text-[44px] leading-[0.98] md:text-[64px]">
            Everything you need<br />to build with graphs.
          </h1>
          <p className="mt-6 max-w-2xl text-[15px] text-ink-muted">
            Guides, API references, concept explainers and copy-paste recipes for shipping
            context-aware agents on top of OpenGraph AI.
          </p>
        </Reveal>
      </section>

      <div className="mx-auto max-w-[1280px] px-6">
        {SECTIONS.map((s, idx) => (
          <section key={s.title} className="pt-20">
            <Reveal className="grid gap-3 md:grid-cols-12">
              <div className="md:col-span-4">
                <div className="mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">
                  {String(idx + 1).padStart(2, "0")} · {s.title.toLowerCase()}
                </div>
                <h2 className="display mt-3 text-[32px] leading-[1.05]">{s.title}</h2>
                <p className="mt-3 max-w-sm text-[14px] text-ink-muted">{s.intro}</p>
              </div>
              <div className="md:col-span-8">
                <RevealStagger className="grid gap-3 sm:grid-cols-2">
                  {s.items.map((it) => (
                    <RevealItem key={it.title}>
                      <ResourceCard item={it} />
                    </RevealItem>
                  ))}
                </RevealStagger>
              </div>
            </Reveal>
          </section>
        ))}
      </div>

      <Reveal as="section" className="mx-auto mt-28 max-w-[1280px] px-6">
        <div className="hairline rounded-3xl bg-surface p-10 md:p-14">
          <div className="grid items-end gap-6 md:grid-cols-[1.5fr_1fr]">
            <div>
              <div className="mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">community</div>
              <h2 className="display mt-3 text-[36px] leading-[1] md:text-[48px]">
                Built in the open.<br />Improved by everyone.
              </h2>
              <p className="mt-4 max-w-xl text-[14px] text-ink-muted">
                Open issues, propose extractors, share schemas. The roadmap is public and the
                core is MIT-licensed.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 md:justify-end">
              <a href="https://github.com/OpenGraphAI/opengraph-ai" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-[14px] font-medium text-background hover:-translate-y-px transition-transform">
                Star on GitHub →
              </a>
              <Link to="/playground" className="inline-flex items-center gap-2 rounded-full border border-rule px-5 py-3 text-[14px] hover:border-foreground">
                Open the playground
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </>
  );
}

function ResourceCard({ item }: { item: Resource }) {
  const inner = (
    <>
      <div className="flex items-center justify-between">
        <span className="mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">{item.tag}</span>
        <span className="text-ink-muted transition-transform group-hover:translate-x-1">→</span>
      </div>
      <h3 className="mt-3 text-[16px] font-medium leading-snug">{item.title}</h3>
      <p className="mt-1.5 text-[13px] text-ink-muted">{item.description}</p>
    </>
  );
  const cls = "group block h-full rounded-xl border border-rule p-5 transition-colors hover:border-foreground hover:bg-surface";
  if (item.to) {
    return (
      <Link to={item.to} className={cls}>
        {inner}
      </Link>
    );
  }
  return (
    <a href={item.href} target={item.external ? "_blank" : undefined} rel={item.external ? "noreferrer" : undefined} className={cls}>
      {inner}
    </a>
  );
}
