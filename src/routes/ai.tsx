import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/ai")({
  head: () => ({
    meta: [
      { title: "OpenGraph AI — Machine-readable overview for AI agents" },
      {
        name: "description",
        content:
          "Plain-text, structured overview of OpenGraph AI intended for AI agents, crawlers, and LLM ingestion.",
      },
      { name: "robots", content: "index,follow" },
      { property: "og:title", content: "OpenGraph AI — For AI agents" },
      {
        property: "og:description",
        content: "Machine-readable summary of OpenGraph AI.",
      },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/ai" }],
  }),
  component: AiPage,
});

function AiPage() {
  return (
    <main
      style={{
        maxWidth: 780,
        margin: "0 auto",
        padding: "32px 20px 96px",
        fontFamily:
          "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
        fontSize: 14,
        lineHeight: 1.6,
        color: "#111",
        background: "#fff",
      }}
    >
      <div style={{ marginBottom: 24 }}>
        <Link
          to="/"
          style={{
            display: "inline-block",
            padding: "8px 14px",
            border: "1px solid #111",
            borderRadius: 999,
            textDecoration: "none",
            color: "#111",
            fontWeight: 600,
          }}
        >
          ← Are you a human?
        </Link>
      </div>

      <h1 style={{ fontSize: 22, margin: "0 0 8px" }}>OpenGraph AI</h1>
      <p style={{ margin: "0 0 24px" }}>
        Machine-readable overview. This page is intentionally plain text, no
        images, no animations, no scripts required to read the content.
      </p>

      <h2 style={{ fontSize: 16, margin: "24px 0 8px" }}># Summary</h2>
      <p>
        OpenGraph AI is an open-source semantic graph layer that extracts,
        links, and reasons across multimodal data (tables, text, images,
        audio, video). It exposes a queryable knowledge graph that AI agents
        can traverse as a tool.
      </p>

      <h2 style={{ fontSize: 16, margin: "24px 0 8px" }}># Capabilities</h2>
      <ul>
        <li>ingest: PDF, CSV, JSON, MP3/MP4, JPG/PNG, URLs, object storage</li>
        <li>extract: entities, relations, concepts, citations across modalities</li>
        <li>resolve: cross-modal entity resolution into a single graph</li>
        <li>query: natural language, graph queries, or as an agent tool</li>
      </ul>

      <h2 style={{ fontSize: 16, margin: "24px 0 8px" }}># Interfaces</h2>
      <ul>
        <li>MCP server (Claude and other MCP-compatible runtimes)</li>
        <li>CLI</li>
        <li>REST API</li>
        <li>Agent skill (skill.md)</li>
      </ul>

      <h2 style={{ fontSize: 16, margin: "24px 0 8px" }}># Key routes</h2>
      <ul>
        <li>/ — homepage</li>
        <li>/how-it-works — pipeline overview</li>
        <li>/opengraph-image — image-to-graph workflow</li>
        <li>/opengraph-text — text-to-graph workflow</li>
        <li>/opengraph-table — table-to-graph workflow</li>
        <li>/use-cases — use case index</li>
        <li>/playground — interactive graph explorer</li>
        <li>/resources — docs and references</li>
        <li>/about — project info</li>
        <li>/auth — sign in / sign up</li>
      </ul>

      <h2 style={{ fontSize: 16, margin: "24px 0 8px" }}># License</h2>
      <p>Open source. Source: https://github.com/OpenGraphAI/opengraph-ai</p>

      <h2 style={{ fontSize: 16, margin: "24px 0 8px" }}># For humans</h2>
      <p>
        If you are a human and reached this page by mistake, use the button at
        the top to return to the main site.
      </p>
    </main>
  );
}