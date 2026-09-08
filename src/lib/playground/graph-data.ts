export interface PgNode {
  id: string;
  label: string;
  kind: string;
  modality?: string;
  x: number;
  y: number;
  r?: number;
}

export interface PgEdge {
  id: string;
  from: string;
  to: string;
  label: string;
  confidence: number;
}

export const MODALITIES = [
  { id: "text", label: "Text", glyph: "📄" },
  { id: "table", label: "Table", glyph: "📊" },
  { id: "image", label: "Image", glyph: "🖼️" },
  { id: "audio", label: "Audio", glyph: "🎙️" },
  { id: "code", label: "Code", glyph: "⚡" },
];

export const ACTIVE_MODALITIES = new Set([
  "text",
  "table",
  "image",
  "audio",
  "code",
]);

export const EXAMPLE_DATASETS = [
  {
    id: "meeting",
    title: "Executive All-Hands & Q3 Risk",
    caption: "Audio transcript + churn table + CFO slides",
    glyph: "⚡",
    color: "var(--accent)",
  },
  {
    id: "clinical",
    title: "Clinical Trial Subgraph",
    caption: "Bio-medical papers + patient lab metrics",
    glyph: "🧪",
    color: "#8fb8ff",
  },
];

export const EXAMPLE_QUERIES = [
  "Which customer risks connect Q3 calls, support tickets, and renewal data?",
  "What caused the customer churn warning in the enterprise tier?",
  "Trace citations connecting the CFO summary with pipeline metrics.",
];

export const INGESTED_FILES = [
  {
    name: "q3_all_hands_transcript.mp3",
    meta: "Audio · 42 min · Whisper extracted",
  },
  {
    name: "customer_churn_q3.csv",
    meta: "Table · 1,420 rows · SQL schema linked",
  },
  {
    name: "risk_assessment_memo.pdf",
    meta: "Document · 18 pages · OCR + Chunked",
  },
  { name: "pipeline_chart.png", meta: "Image · 1920x1080 · Multimodal vision" },
];

export const LOADING_STEPS = [
  { pct: 25, text: "Ingesting multimodal source files..." },
  { pct: 50, text: "Extracting entities, concepts & citations..." },
  {
    pct: 75,
    text: "Resolving relationships across sources into context graph...",
  },
  { pct: 100, text: "Context graph ready." },
];

export function nodeColor(kind: string, modality?: string): string {
  if (modality === "table") return "#22c55e";
  if (modality === "image") return "#ec4899";
  if (modality === "audio") return "#eab308";
  if (kind === "entity") return "#c96a4a";
  if (kind === "concept") return "#8fb8ff";
  if (kind === "doc") return "#f4c47a";
  return "var(--accent)";
}

export const NODES: PgNode[] = [
  {
    id: "doc_transcript",
    label: "Executive Call Transcript",
    kind: "doc",
    modality: "audio",
    x: 220,
    y: 180,
    r: 18,
  },
  {
    id: "doc_churn_csv",
    label: "Q3 Churn Dataset",
    kind: "doc",
    modality: "table",
    x: 210,
    y: 480,
    r: 18,
  },
  {
    id: "ent_churn",
    label: "Enterprise Churn Risk",
    kind: "entity",
    modality: "table",
    x: 480,
    y: 340,
    r: 22,
  },
  {
    id: "ent_cfo",
    label: "CFO Forecast",
    kind: "entity",
    modality: "text",
    x: 490,
    y: 160,
    r: 16,
  },
  {
    id: "ent_ticket_cluster",
    label: "API Latency Escalations",
    kind: "entity",
    modality: "text",
    x: 740,
    y: 240,
    r: 16,
  },
  {
    id: "cnc_renewal",
    label: "Q4 Renewal Exposure",
    kind: "concept",
    x: 790,
    y: 440,
    r: 20,
  },
  {
    id: "doc_slide",
    label: "CFO Strategy Deck",
    kind: "doc",
    modality: "image",
    x: 330,
    y: 240,
    r: 16,
  },
];

export const EDGES: PgEdge[] = [
  {
    id: "e1",
    from: "doc_transcript",
    to: "ent_cfo",
    label: "cites",
    confidence: 0.96,
  },
  {
    id: "e2",
    from: "doc_churn_csv",
    to: "ent_churn",
    label: "records",
    confidence: 0.98,
  },
  {
    id: "e3",
    from: "ent_cfo",
    to: "ent_churn",
    label: "correlates_with",
    confidence: 0.89,
  },
  {
    id: "e4",
    from: "ent_churn",
    to: "ent_ticket_cluster",
    label: "triggered_by",
    confidence: 0.92,
  },
  {
    id: "e5",
    from: "ent_churn",
    to: "cnc_renewal",
    label: "jeopardizes",
    confidence: 0.95,
  },
  {
    id: "e6",
    from: "ent_ticket_cluster",
    to: "cnc_renewal",
    label: "amplifies",
    confidence: 0.88,
  },
  {
    id: "e7",
    from: "doc_slide",
    to: "ent_cfo",
    label: "illustrates",
    confidence: 0.91,
  },
];

export const INSPECTOR: Record<
  string,
  {
    confidence: number;
    properties: [string, string][];
    snippet: string;
    source: string;
  }
> = {
  ent_churn: {
    confidence: 0.95,
    properties: [
      ["Severity", "Critical"],
      ["Accounts At Risk", "14 Tier-1 Customers"],
      ["Primary Driver", "Unresolved latency tickets in v2.4"],
      ["Exposure", "$1.2M ARR"],
    ],
    snippet:
      "Enterprise accounts reported recurring timeouts after the v2.4 upgrade; correlation with Q3 contract reviews shows 62% elevated flight risk.",
    source:
      "customer_churn_q3.csv (Row 142) & q3_all_hands_transcript.mp3 (00:18:24)",
  },
  doc_transcript: {
    confidence: 0.96,
    properties: [
      ["Duration", "42:15"],
      ["Speaker", "CFO & Head of Product"],
      ["Topic", "Q3 Performance & Downward Guidance"],
    ],
    snippet:
      "We are observing early hesitation from our top five renewal candidates citing infrastructure stability.",
    source: "q3_all_hands_transcript.mp3",
  },
  doc_churn_csv: {
    confidence: 0.98,
    properties: [
      ["Rows", "1,420"],
      ["Format", "CSV"],
      ["Timestamp", "2026-07-28"],
    ],
    snippet: "AccountID: ACME-091, Status: Red, DaysToRenewal: 41, OpenBugs: 7",
    source: "customer_churn_q3.csv",
  },
  ent_cfo: {
    confidence: 0.91,
    properties: [
      ["Entity Type", "Role / Executive Target"],
      ["Sentiment", "Guarded"],
    ],
    snippet: "CFO emphasized risk retention targets in opening remarks.",
    source: "q3_all_hands_transcript.mp3",
  },
  ent_ticket_cluster: {
    confidence: 0.92,
    properties: [
      ["Category", "Engineering Incident"],
      ["Count", "38 Escalations"],
    ],
    snippet: "Cluster of P0/P1 tickets opened within 48 hours of release.",
    source: "risk_assessment_memo.pdf",
  },
  cnc_renewal: {
    confidence: 0.95,
    properties: [
      ["Impact Horizon", "Q4 2026"],
      ["Total ARR", "$3.4M"],
    ],
    snippet:
      "Aggregated renewal pipeline exposed to ongoing operational blockers.",
    source: "customer_churn_q3.csv",
  },
  doc_slide: {
    confidence: 0.91,
    properties: [
      ["Slide", "Page 8"],
      ["Chart", "Cohort Retention Curve"],
    ],
    snippet: "Visual retention curve showing sharp dip at month 11.",
    source: "pipeline_chart.png",
  },
};

export const CANNED_ANSWER = {
  text: "OpenGraph AI resolved multi-hop evidence across 3 modalities (Audio, CSV table, and PDF memo). The enterprise renewal risk ($1.2M ARR) connects directly from CFO statements in the all-hands audio to 38 escalated latency tickets logged post-v2.4 rollout in the customer churn table.",
  graphJson: JSON.stringify(
    {
      nodes: NODES,
      edges: EDGES,
      subgraph: "enterprise_renewal_exposure",
      sources: INGESTED_FILES.map((f) => f.name),
    },
    null,
    2,
  ),
  cypher: `MATCH (d:Document)-[:CITES]->(e:Entity {name: "Enterprise Churn Risk"})
MATCH (e)-[r:JEOPARDIZES]->(c:Concept {name: "Q4 Renewal Exposure"})
RETURN d, e, r, c;`,
  skillsMd: `### Agent Evidence Trail
- **[Audio]** CFO noted retention sensitivity in \`q3_all_hands_transcript.mp3\` @ 18:24
- **[Table]** 14 high-value accounts flagged with >5 open tickets in \`customer_churn_q3.csv\`
- **[Cross-Reference]** P0 latency issues cited as root cause in \`risk_assessment_memo.pdf\`
- **Graph Confidence:** 0.94`,
};
