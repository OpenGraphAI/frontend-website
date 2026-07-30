import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/coming-soon";

export const Route = createFileRoute("/opengraph-table")({
  head: () => ({
    meta: [
      { title: "OpenGraph Table — Coming soon" },
      { name: "description", content: "Turn spreadsheets and tabular data into a queryable knowledge graph. Coming soon." },
      { property: "og:title", content: "OpenGraph Table — OpenGraph AI" },
      { property: "og:description", content: "Spreadsheets and tabular data into a queryable knowledge graph. Coming soon." },
      { property: "og:url", content: "/opengraph-table" },
    ],
    links: [{ rel: "canonical", href: "/opengraph-table" }],
  }),
  component: () => (
    <ComingSoon
      eyebrow="modality · table"
      title="Tables into a knowledge graph."
      blurb="OpenGraph Table will link CSVs, spreadsheets and warehouse rows into typed entities and relationships, ready for your agent."
    />
  ),
});