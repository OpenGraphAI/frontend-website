export type MockNode = {
  id: string;
  label: string;
  kind: "doc" | "entity" | "concept";
  x?: number;
  y?: number;
  r?: number;
  [key: string]: unknown;
};

export type MockEdge = {
  id?: string;
  source: string;
  target: string;
  label?: string;
  confidence?: number;
  [key: string]: unknown;
};

export function buildMockGraph(filenames: string[]): {
  nodes: MockNode[];
  edges: MockEdge[];
} {
  const nodes: MockNode[] = [];
  const edges: MockEdge[] = [];

  // Add document nodes
  filenames.forEach((fn, idx) => {
    const docId = `doc_${idx}_${fn.replace(/[^a-zA-Z0-9]/g, "_")}`;
    nodes.push({
      id: docId,
      label: fn,
      kind: "doc",
    });

    // Add associated entities
    const entityId = `ent_${idx}`;
    nodes.push({
      id: entityId,
      label: `Entity (${fn.split(".")[0]})`,
      kind: "entity",
    });
    edges.push({
      id: `e_doc_ent_${idx}`,
      source: docId,
      target: entityId,
      label: "extracts",
    });
  });

  // If no files provided, supply default fallback nodes
  if (nodes.length === 0) {
    nodes.push(
      { id: "doc_default", label: "q3_financials.pdf", kind: "doc" },
      { id: "ent_revenue", label: "Q3 ARR", kind: "entity" },
      { id: "ent_churn", label: "Churn Risk", kind: "entity" },
      { id: "cnc_expansion", label: "Enterprise Expansion", kind: "concept" },
    );
    edges.push(
      {
        id: "e1",
        source: "doc_default",
        target: "ent_revenue",
        label: "cites",
      },
      {
        id: "e2",
        source: "ent_revenue",
        target: "cnc_expansion",
        label: "drives",
      },
      {
        id: "e3",
        source: "ent_revenue",
        target: "ent_churn",
        label: "impacts",
      },
    );
  } else if (nodes.length > 2) {
    // Connect concepts
    nodes.push({
      id: "cnc_multimodal_context",
      label: "Multimodal Context",
      kind: "concept",
    });
    edges.push({
      id: "e_cross",
      source: nodes[1].id,
      target: "cnc_multimodal_context",
      label: "relates_to",
    });
  }

  return { nodes, edges };
}

export function fakeAnswer(
  question: string,
  nodes: MockNode[],
): { content: string; trace: string[] } {
  const labels = nodes.slice(0, 3).map((n) => n.label);
  const trace = nodes.slice(0, 4).map((n) => n.id);
  return {
    content: `Traversing context graph for "${question}". Evidence connected across: ${labels.join(", ")}. Confidence score: 0.94.`,
    trace,
  };
}
