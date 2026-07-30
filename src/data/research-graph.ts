export type ResearchNodeType = "paper" | "author" | "institution" | "topic";

export type ResearchNode = {
  id: string;
  label: string;
  type: ResearchNodeType;
  description?: string;
};

export type ResearchLink = {
  source: string;
  target: string;
  label: string;
};

export const RESEARCH_NODES: ReadonlyArray<ResearchNode> = [
  { id: "paper-a", label: "Paper A", type: "paper", description: "Foundational work on structured retrieval over research corpora." },
  { id: "paper-b", label: "Paper B", type: "paper", description: "Follow-up paper extending the ideas of Paper A into multi-agent settings." },
  { id: "maya", label: "Dr. Maya Chen", type: "author", description: "Researcher focused on knowledge graphs and retrieval systems." },
  { id: "ethan", label: "Dr. Ethan Brooks", type: "author", description: "Researcher working on general-purpose reasoning agents." },
  { id: "stanford", label: "Stanford University", type: "institution", description: "Host institution for Dr. Maya Chen's research group." },
  { id: "mit", label: "MIT", type: "institution", description: "Host institution for Dr. Ethan Brooks's lab." },
  { id: "ml", label: "Machine Learning", type: "topic", description: "Broad topic covering learning from data." },
  { id: "kg", label: "Knowledge Graphs", type: "topic", description: "Structured graph representations of entities and relationships." },
  { id: "ai", label: "Artificial Intelligence", type: "topic", description: "The parent research area for ML and KG work." },
];

export const RESEARCH_LINKS: ReadonlyArray<ResearchLink> = [
  { source: "maya", target: "paper-a", label: "authored" },
  { source: "ethan", target: "paper-b", label: "authored" },
  { source: "maya", target: "stanford", label: "affiliated with" },
  { source: "ethan", target: "mit", label: "affiliated with" },
  { source: "paper-a", target: "ml", label: "discusses" },
  { source: "paper-a", target: "kg", label: "discusses" },
  { source: "paper-b", target: "ai", label: "discusses" },
  { source: "paper-b", target: "paper-a", label: "cites" },
  { source: "ml", target: "ai", label: "related to" },
  { source: "kg", target: "ai", label: "related to" },
];