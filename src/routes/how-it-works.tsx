import { createFileRoute } from "@tanstack/react-router";
import { PlaygroundCtaBanner } from "@/components/playground-cta-banner";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How it works — OpenGraph AI" },
      { name: "description", content: "The OpenGraph AI pipeline: ingest any modality, extract a typed knowledge graph, query it from agents." },
      { property: "og:title", content: "How it works — OpenGraph AI" },
      { property: "og:description", content: "Ingest → extract → graph → query. The OpenGraph AI pipeline." },
      { property: "og:url", content: "/how-it-works" },
    ],
    links: [{ rel: "canonical", href: "/how-it-works" }],
  }),
  component: Page,
});

const STEPS = [
  { n: "01", k: "ingest", t: "Point at your data", d: "PDFs, CSVs, JSON, audio, video, images, URLs, S3, Postgres. A unified loader normalizes every modality into a content stream with provenance." },
  { n: "02", k: "extract", t: "Multimodal extractors", d: "Transcribe audio, parse tables, caption images, segment documents. We emit typed entities, relations and timestamped citations." },
  { n: "03", k: "link", t: "Resolve & link", d: "Cross-modal entity resolution merges duplicates and links the same Acme Corp mentioned in a PDF, an MP3, and a chart." },
  { n: "04", k: "graph", t: "Persist the graph", d: "Stored as a property graph with attached embeddings. Versioned, diffable, exportable to Neo4j / Memgraph / Postgres." },
  { n: "05", k: "query", t: "Query in plain language", d: "Natural language → graph query → ranked subgraph + citations. Or hand the graph to an agent as a single tool." },
];

function Page() {
  return (
    <>
      <section className="mx-auto max-w-[1280px] px-6 pt-20 pb-10">
        <div className="mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">pipeline</div>
        <h1 className="display mt-4 text-balance text-[64px] leading-[0.95] md:text-[88px]">
          Five steps from<br /><span className="text-ink-muted italic">files to a graph.</span>
        </h1>
        <p className="mt-6 max-w-xl text-[16px] text-ink-muted">
          Every step is swappable. Bring your own extractor, LLM, embedding model, or graph store —
          OpenGraph AI orchestrates them into one coherent context layer for your agent.
        </p>
      </section>

      <section className="mx-auto max-w-[1280px] px-6">
        <ol className="divide-y divide-rule border-y border-rule">
          {STEPS.map((s) => (
            <li key={s.n} className="grid gap-6 py-12 md:grid-cols-[120px_1fr_1.4fr]">
              <div>
                <div className="display text-[44px] leading-none text-accent">{s.n}</div>
                <div className="mono mt-2 text-[11px] uppercase tracking-[0.18em] text-ink-muted">{s.k}</div>
              </div>
              <h2 className="display text-[34px] leading-[1.05]">{s.t}</h2>
              <p className="text-[15px] text-ink-muted md:pt-3">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* tiny code section */}
      <section className="mx-auto mt-20 max-w-[1280px] px-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-rule bg-[#0f0f10]">
            <div className="border-b border-white/10 px-4 py-2.5 mono text-[11px] text-white/40">python</div>
            <pre className="mono overflow-x-auto p-6 text-[13px] leading-[1.7] text-white/90">
{`from opengraph import Graph

g = Graph()
g.ingest("./customers/**/*")
g.ask("Top 3 churn risks and why?")`}
            </pre>
          </div>
          <div className="overflow-hidden rounded-2xl border border-rule bg-[#0f0f10]">
            <div className="border-b border-white/10 px-4 py-2.5 mono text-[11px] text-white/40">typescript</div>
            <pre className="mono overflow-x-auto p-6 text-[13px] leading-[1.7] text-white/90">
{`import { Graph } from "opengraph-ai";

const g = await Graph.fromSources([
  "s3://acme/calls/*.mp3",
]);
await g.ask("Who flagged pricing risk?");`}
            </pre>
          </div>
        </div>
      </section>
      <PlaygroundCtaBanner />
    </>
  );
}
