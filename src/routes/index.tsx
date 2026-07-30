import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { GraphProductPreview } from "@/components/graph-product-preview";
import { Reveal, RevealStagger, RevealItem } from "@/components/reveal";
import { IntegrationsSection } from "@/components/integrations-section";
import { CliRotator } from "@/components/cli-rotator";
import { DataSourcesStrip } from "@/components/data-sources-strip";
import { BenefitsBanner } from "@/components/benefits-banner";
import { BuildShowcase } from "@/components/build-showcase";
import { FaqSection } from "@/components/faq-section";
import { PlaygroundCtaBanner } from "@/components/playground-cta-banner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OpenGraph AI — Context graphs for reasoning agents" },
      { name: "description", content: "Turn tables, text, images, audio and video into queryable knowledge graphs that power complex reasoning and retrieval for AI agents." },
      { property: "og:title", content: "OpenGraph AI — Context graphs for reasoning agents" },
      { property: "og:description", content: "Turn tables, text, images, audio and video into queryable knowledge graphs that power complex reasoning and retrieval for AI agents." },
      { property: "og:url", content: "/" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  const [typed] = useState(true);
  return (
    <>
      {/* Hero — split, fits viewport */}
      <section className="relative">
        <div className="mx-auto grid min-h-[calc(100svh-64px)] max-w-[1280px] grid-cols-1 items-center gap-10 px-6 py-10 lg:gap-12 lg:py-0">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-2"
            >
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-accent animate-pulse-dot" />
              <span className="mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">Open Source</span>
            </motion.div>
            <h1 className="display mt-6 text-balance text-[44px] leading-[1.02] sm:text-[56px] lg:text-[68px] xl:text-[76px]">
              Turn multimodal data into a <em className="text-accent">queryable context graph</em> for AI agents.
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: typed ? 1 : 0, y: typed ? 0 : 12 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 max-w-xl text-pretty text-[15px] text-ink-muted"
            >
              Ingest files, extract entities and citations, and give your AI agents a graph they can query and reason over.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: typed ? 1 : 0, y: typed ? 0 : 12 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="mt-7 flex flex-wrap items-center gap-3"
            >
              <Link to="/playground" className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-[14px] font-medium text-background hover:-translate-y-px transition-transform focus-visible:rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background">
                Try the playground <span aria-hidden>→</span>
              </Link>
              <a
                href="https://github.com/OpenGraphAI/opengraph-ai"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-rule px-5 py-3 text-[14px] hover:border-foreground focus-visible:rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M12 .5C5.73.5.75 5.48.75 11.75c0 4.97 3.22 9.18 7.69 10.67.56.1.77-.24.77-.54 0-.27-.01-1.16-.02-2.1-3.13.68-3.79-1.34-3.79-1.34-.51-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.69.08-.69 1.13.08 1.72 1.16 1.72 1.16 1 1.72 2.63 1.22 3.27.93.1-.73.39-1.22.71-1.5-2.5-.28-5.13-1.25-5.13-5.56 0-1.23.44-2.23 1.16-3.02-.12-.29-.5-1.44.11-3 0 0 .94-.3 3.09 1.15.9-.25 1.87-.38 2.83-.38.96 0 1.93.13 2.83.38 2.15-1.45 3.09-1.15 3.09-1.15.61 1.56.23 2.71.11 3 .72.79 1.16 1.79 1.16 3.02 0 4.32-2.63 5.27-5.14 5.55.4.35.76 1.03.76 2.08 0 1.5-.01 2.71-.01 3.08 0 .3.2.65.78.54 4.46-1.49 7.68-5.7 7.68-10.67C23.25 5.48 18.27.5 12 .5z"/>
                </svg>
                View on GitHub
              </a>
              <Link
                to="/resources"
                className="inline-flex items-center gap-2 rounded-full border border-rule px-5 py-3 text-[14px] text-ink-muted hover:border-foreground hover:text-foreground focus-visible:rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Explore Resources
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: typed ? 1 : 0, y: typed ? 0 : 12 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              {typed && <CliRotator />}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: typed ? 1 : 0, y: typed ? 0 : 12 }}
              transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="mt-10 flex justify-center"
            >
              <Link
                to="/ai"
                className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-foreground px-5 py-2.5 text-[13px] font-medium text-background shadow-[0_4px_18px_rgba(0,0,0,0.12)] transition-all hover:bg-accent hover:shadow-[0_8px_28px_oklch(0.68_0.21_35/0.35)]"
              >
                <span className="relative flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[11px] transition-colors group-hover:bg-white/25">
                  🤖
                </span>
                <span>Are you an AI agent?</span>
                <span className="ml-0.5 text-background/70 transition-transform group-hover:translate-x-0.5" aria-hidden>→</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Orientation */}
      <section className="mx-auto max-w-[1280px] px-6 pb-6">
        <nav aria-label="Page orientation" className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[14px] text-ink-muted">
          <span>
            Explore an interactive graph in the{" "}
            <Link to="/playground" className="text-foreground underline-offset-2 hover:text-accent hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background">
              playground
            </Link>
            .
          </span>
          <span>
            Review the source on{" "}
            <a
              href="https://github.com/OpenGraphAI/opengraph-ai"
              target="_blank"
              rel="noreferrer"
              className="text-foreground underline-offset-2 hover:text-accent hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              GitHub
            </a>
            .
          </span>
          <span>
            Find supporting material in{" "}
            <Link to="/resources" className="text-foreground underline-offset-2 hover:text-accent hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background">
              Resources
            </Link>
            .
          </span>
        </nav>
      </section>

      <DataSourcesStrip />
      <BenefitsBanner />

      {/* What it does — 3 panels */}
      <section className="mx-auto max-w-[1280px] px-6 pt-24">
        <Reveal className="grid gap-3 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">01 · what</div>
            <h2 className="display mt-3 text-[44px] leading-[1]">A knowledge graph<br />AI agent can actually query.</h2>
          </div>
          <p className="text-[15px] text-ink-muted md:col-span-7 md:pt-12">
            RAG retrieves passages. Graphs retrieve <em>relationships</em>. OpenGraph AI extracts entities,
            concepts and citations from every modality, links them, and exposes a graph your agent can
            traverse and reason.
          </p>
        </Reveal>

        <RevealStagger className="mt-10 grid gap-3 md:grid-cols-3">
          {[
            { k: "ingest", t: "Any data in", d: "PDF, CSV, JSON, MP3/MP4, JPG/PNG, URLs, buckets, etc.. One unified pipeline.", n: "→" },
            { k: "extract", t: "Entities & relations", d: "Cross-modal entity resolutions: one graph, with many senses.", n: "◇" },
            { k: "query", t: "Reason across", d: "Natural language questions, graph queries, or hand it to an agent (Claude, etc.) as a tool.", n: "∞" },
          ].map((c) => (
            <RevealItem key={c.k} className="group relative overflow-hidden rounded-2xl border border-rule bg-card p-6 transition-colors hover:border-foreground">
              <div className="flex items-start justify-between">
                <span className="mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">{c.k}</span>
                <span className="display text-3xl text-accent">{c.n}</span>
              </div>
              <h3 className="display mt-10 text-[28px] leading-[1.05]">{c.t}</h3>
              <p className="mt-3 text-[14px] text-ink-muted">{c.d}</p>
            </RevealItem>
          ))}
        </RevealStagger>
      </section>

      {/* See it in action — playground preview */}
      <section className="mx-auto max-w-[1280px] px-6 pt-28">
        <Reveal className="flex items-end justify-between gap-6">
          <div>
            <div className="mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">see it in action</div>
            <h2 className="display mt-3 text-[44px] leading-[1]">
              The playground,<br />without the wait.
            </h2>
            <p className="mt-4 max-w-xl text-[15px] text-ink-muted">
              A live preview of what you'll build: heterogeneous sources extracted into entities,
              concepts and citations — explorable, queryable, agent-ready.
            </p>
          </div>
          <Link to="/playground" className="hidden text-[14px] text-ink-muted hover:text-foreground md:inline">
            Open the playground →
          </Link>
        </Reveal>
        <Reveal className="mt-10">
          <GraphProductPreview />
        </Reveal>
      </section>

      {/* 02 · How — interface tabs (CLI / API / MCP / Skill) */}
      <section className="mx-auto max-w-[1280px] px-6 pt-28">
        <Reveal className="grid gap-3 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">02 · how</div>
            <h2 className="display mt-3 text-[44px] leading-[1]">Use it where<br />you already work.</h2>
            <p className="mt-4 text-[15px] text-ink-muted">
              MCP server in Claude, CLI in terminal, REST API, or as a skill.md inside your agent runtime.
              Same graph — every interface.
            </p>
            <Link to="/how-it-works" className="mt-6 inline-flex items-center gap-1 text-[14px] hover:text-accent">
              See the full pipeline <span aria-hidden>→</span>
            </Link>
          </div>
          <div className="md:col-span-7">
            <IntegrationsSection embedded />
          </div>
        </Reveal>
      </section>

      {/* What you can build */}
      <section className="mx-auto max-w-[1280px] px-6 pt-24">
        <div className="flex items-end justify-between">
          <div>
            <div className="mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">03 · build</div>
            <h2 className="display mt-3 text-[44px] leading-[1]">What you can build.</h2>
          </div>
          <Link to="/use-cases" className="hidden text-[14px] text-ink-muted hover:text-foreground md:inline">All use cases →</Link>
        </div>

        <BuildShowcase />
      </section>

      <FaqSection />



      {/* CTA */}
      <PlaygroundCtaBanner />
    </>
  );
}
