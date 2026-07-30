import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/coming-soon";

export const Route = createFileRoute("/opengraph-text")({
  head: () => ({
    meta: [
      { title: "OpenGraph Text — Coming soon" },
      { name: "description", content: "Turn documents and long-form text into a queryable knowledge graph. Coming soon." },
      { property: "og:title", content: "OpenGraph Text — OpenGraph AI" },
      { property: "og:description", content: "Documents and long-form text into a queryable knowledge graph. Coming soon." },
      { property: "og:url", content: "/opengraph-text" },
    ],
    links: [{ rel: "canonical", href: "/opengraph-text" }],
  }),
  component: () => (
    <ComingSoon
      eyebrow="modality · text"
      title="Text into a knowledge graph."
      blurb="OpenGraph Text will read PDFs, docs and long-form prose, extract typed entities and relationships, and hand the result to your agent."
    />
  ),
});