export type UseCase = {
  slug: string;
  tag: string;
  title: string;
  short: string;
  description: string;
  bullets: string[];
  sources: string[];
  outputs: string[];
  example: { question: string; answer: string };
};

export const USE_CASES: UseCase[] = [
  {
    slug: "research-agents",
    tag: "research",
    title: "Research agents that cite their work",
    short: "Walk a graph of papers, datasets, and figures with a traceable evidence chain.",
    description:
      "OpenGraph AI ingests papers, lab notebooks, slack threads and dataset descriptions, links them by author, concept, method and result, and lets a research agent answer questions by walking the graph — every claim arrives with its citation path.",
    bullets: [
      "arXiv + lab notebooks + slack threads in one graph",
      "Figure- and table-aware retrieval, not just text",
      "Audit trail for every claim the agent makes",
      "Cross-paper concept linking so contradictions surface",
    ],
    sources: ["arXiv PDFs", "Lab notebooks (md/ipynb)", "Slack threads", "CSV/Parquet result tables"],
    outputs: ["Cited answers", "Evidence subgraph", "Contradiction reports"],
    example: {
      question: "Which post-2023 papers reproduce the scaling law from Chinchilla on multimodal data?",
      answer:
        "→ 4 papers · 2 datasets · 1 contradicting result. Evidence path: Chinchilla → method:compute-optimal → cited_by(7) → modality:multimodal(4).",
    },
  },
  {
    slug: "enterprise-memory",
    tag: "internal",
    title: "Enterprise memory layer",
    short: "Unify Slack, Drive, Notion, GitHub, and CRMs into one graph an agent can query.",
    description:
      "Stop asking five tools the same question. OpenGraph AI resolves people, customers, projects and tickets across your stack and exposes a permission-aware graph that agents can traverse — onboarding, debugging and customer history in plain language.",
    bullets: [
      "Cross-tool entity resolution (one Acme, not nine)",
      "Permission-aware subgraphs — agents only see what the user can",
      "Plugs into MCP and function-calling out of the box",
      "Incremental sync — minutes-fresh, not nightly",
    ],
    sources: ["Slack", "Google Drive / Notion", "GitHub / Linear", "Salesforce / HubSpot"],
    outputs: ["Plain-language Q&A", "Onboarding briefs", "Customer 360 subgraphs"],
    example: {
      question: "Why did Acme churn last quarter and who owned the relationship?",
      answer:
        "→ Owner: Priya R. · 3 escalations · 2 missed SLAs · root cause: integration regression in PR #4821.",
    },
  },
  {
    slug: "investigative-analysis",
    tag: "intel",
    title: "Investigative analysis",
    short: "Find non-obvious connections between people, events, and documents.",
    description:
      "Built for journalists, OSINT and compliance teams. Drop in court filings, leaks, news, images and audio — get back path discovery, timelines, and an evidence chain you can defend in a courtroom or an editor's meeting.",
    bullets: [
      "Path discovery between any two entities",
      "Timeline reconstruction across modalities",
      "Multimedia evidence linking (image, audio, video)",
      "Confidence scores on every edge",
    ],
    sources: ["Court filings", "Leak archives", "News feeds", "Image/audio/video"],
    outputs: ["Connection paths", "Timelines", "Evidence dossiers"],
    example: {
      question: "How is Person A connected to Shell Corp B before 2022?",
      answer: "→ 2 hops · shared director (2019) · shared bank account in document dump (2021-03).",
    },
  },
  {
    slug: "multimodal-rag",
    tag: "infra",
    title: "Multimodal RAG that actually reasons",
    short: "Graph-walks across audio, video and tables — ranked subgraphs, not paragraphs.",
    description:
      "Top-k chunking falls apart on multi-hop questions and ignores tables, charts, audio and video. OpenGraph AI returns ranked subgraphs that include every modality, so your LLM gets structured context instead of a wall of nearest-neighbor text.",
    bullets: [
      "Beats vector-only RAG on multi-hop benchmarks",
      "Streams partial subgraphs to the LLM as it reasons",
      "Pluggable rerankers and graph walkers",
      "Works with any embedding model and any LLM",
    ],
    sources: ["PDFs", "Audio / video", "Tables (CSV/Parquet/SQL)", "Web pages"],
    outputs: ["Ranked subgraphs", "Structured context windows", "Trace logs"],
    example: {
      question: "Summarize Q3 customer concerns mentioning pricing across calls and tickets.",
      answer: "→ 3 customers · 4 calls · 6 tickets · 1 chart. Subgraph returned with citations.",
    },
  },
  {
    slug: "operational-decision-support",
    tag: "ops",
    title: "Operational decision support",
    short: "Turn ticket queues, runbooks, and incidents into a graph the on-call agent can walk.",
    description:
      "Incidents, tickets, runbooks and postmortems live in different tools and rarely link up. OpenGraph AI links them by service, symptom, cause and fix so an on-call agent can surface the runbook that actually solved this last time.",
    bullets: [
      "Incident → cause → fix linkage across years",
      "Auto-summarized postmortems written into the graph",
      "Slack-native — invoke from the channel where the incident lives",
      "Surfaces 'we've seen this before' in seconds",
    ],
    sources: ["PagerDuty / Opsgenie", "Jira / Linear tickets", "Confluence runbooks", "Slack incident channels"],
    outputs: ["Root-cause hypotheses", "Runbook suggestions", "Postmortem drafts"],
    example: {
      question: "Why is checkout p99 spiking again?",
      answer: "→ Matches incident INC-2143 (2024-08). Cause: cache stampede on coupon service. Fix: PR #9981.",
    },
  },
  {
    slug: "tutoring-curriculum",
    tag: "edu",
    title: "Tutoring & curriculum agents",
    short: "Tutors that understand prerequisite chains and your learner's actual graph of understanding.",
    description:
      "Move past chatbot tutors. OpenGraph AI models concepts, prerequisites, textbooks and a learner's per-concept mastery as one graph — so a tutoring agent can recommend the next thing to learn, not just the next thing to read.",
    bullets: [
      "Concept dependency graph across textbooks",
      "Per-student knowledge state, updated from work",
      "Cross-textbook retrieval — same concept, multiple explanations",
      "Recommends the next concept, not the next page",
    ],
    sources: ["Textbooks (PDF)", "Lecture videos / transcripts", "Problem sets", "Student work"],
    outputs: ["Next-concept recommendations", "Personalized review plans", "Knowledge-state reports"],
    example: {
      question: "What should this student study next before tackling backprop?",
      answer: "→ Gaps: chain rule (0.4), partial derivatives (0.6). Recommend: 2 problems + 1 video.",
    },
  },
];

export function getUseCase(slug: string): UseCase | undefined {
  return USE_CASES.find((u) => u.slug === slug);
}
