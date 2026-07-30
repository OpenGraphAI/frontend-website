import { createFileRoute } from "@tanstack/react-router";
import { WorkflowCanvas } from "@/components/workflow-canvas";
import { PlaygroundCtaBanner } from "@/components/playground-cta-banner";

export const Route = createFileRoute("/opengraph-image")({
  head: () => ({
    meta: [
      { title: "OpenGraph Image — Visual data into a knowledge graph" },
      {
        name: "description",
        content:
          "Turn images into typed entities, relationships and a queryable knowledge graph. Outputs graph.json, graph.html and agent-ready context.",
      },
      { property: "og:title", content: "OpenGraph Image — OpenGraph AI" },
      {
        property: "og:description",
        content: "The image-to-graph workflow: extract entities, build the graph, ask questions, ship context to your agent.",
      },
      { property: "og:url", content: "/opengraph-image" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/opengraph-image" }],
  }),
  component: Page,
});

function Page() {
  return (
    <>
      <section className="mx-auto max-w-[1280px] px-6 pt-16 pb-6">
        <div className="flex items-start justify-between gap-6">
          <div>
            <div className="mono text-[11px] lowercase tracking-[0.18em] text-ink-muted">
              how it works · opengraph image
            </div>
            <h1 className="display mt-3 text-balance text-[56px] leading-[0.98] md:text-[88px]">
              OpenGraph <span className="italic text-accent">Image</span>
            </h1>
            <p className="mt-4 max-w-xl text-[15px] text-foreground">
              Turn image folders into queryable graph context.
            </p>
          </div>
          <span className="mono inline-flex shrink-0 items-center gap-2 rounded-full border border-rule bg-card px-3 py-1.5 text-[11px] text-foreground">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#1ca35f]" />
            MCP · live
          </span>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-6">
        <WorkflowCanvas />
      </section>

      <PlaygroundCtaBanner />
    </>
  );
}