import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal } from "@/components/reveal";

const FAQS: { q: string; a: string }[] = [
  {
    q: "How is this different from vector RAG?",
    a: "Vector RAG retrieves nearest-neighbor passages. OpenGraph AI extracts entities, concepts and relations from every modality and lets your agent traverse them — so multi-hop questions return ranked subgraphs with a citation path, not a wall of chunks.",
  },
  {
    q: "Do I have to define a schema upfront?",
    a: "No. We infer a schema from your data and let you override or extend it. You can bring your own ontology, generate one from sample documents, or evolve it as your sources change.",
  },
  {
    q: "Which data sources are supported?",
    a: "PDFs, CSV/Parquet, JSON, audio and video, images, web pages, and direct connectors for Slack, Notion, Drive, GitHub, S3, Snowflake and Postgres. Anything else? A custom ingest takes a few lines of Python.",
  },
  {
    q: "How do agents call it?",
    a: "MCP server, REST API, Python/TypeScript SDK, or as a registered skill inside your agent framework. The same graph is reachable from every interface.",
  },
  {
    q: "Is my data used to train anyone's model?",
    a: "No. Your graphs stay yours. We never train on customer data, and you can self-host the extraction pipeline if you need full isolation.",
  },
  {
    q: "Is it open source?",
    a: "The core extraction pipeline and graph runtime are open source on GitHub. The hosted playground, managed connectors and team features live in our cloud product.",
  },
];

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="mx-auto max-w-[1280px] px-6 pt-28">
      <Reveal className="grid gap-3 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">faq</div>
          <h2 className="display mt-3 text-[44px] leading-[1]">
            Questions,<br />answered.
          </h2>
          <p className="mt-4 max-w-md text-[14px] text-ink-muted">
            Can't find what you're looking for? Open an issue on{" "}
            <a href="https://github.com/OpenGraphAI/opengraph-ai" className="underline underline-offset-4 hover:text-foreground" target="_blank" rel="noreferrer">
              GitHub
            </a>
            .
          </p>
        </div>
        <div className="md:col-span-7">
          <ul className="border-t border-rule">
            {FAQS.map((f, i) => {
              const isOpen = open === i;
              return (
                <li key={f.q} className="border-b border-rule">
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left"
                  >
                    <span className="text-[15px] font-medium leading-snug">{f.q}</span>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="mono text-[18px] text-ink-muted"
                      aria-hidden
                    >
                      +
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="pb-5 pr-8 text-[14px] text-ink-muted">{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
