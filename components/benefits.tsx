export function Benefits() {
  const benefits = [
    {
      title: "10x Faster",
      description: "Graph-based retrieval accelerates agent reasoning, reducing latency and improving response times across complex queries.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      ),
    },
    {
      title: "40% Fewer Tokens",
      description: "Structured graph traversal reduces token consumption by focusing on relevant entities and relationships.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="1" />
          <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24" />
        </svg>
      ),
    },
    {
      title: "Multimodal Capabilities",
      description: "Native support for text, images, tables, audio, and video within a unified semantic graph structure.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="m21 15-5-5L5 21" />
        </svg>
      ),
    },
  ]

  return (
    <section className="border-t border-border py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16">
          <p className="font-mono text-sm uppercase tracking-widest text-primary font-semibold">
            Benefits
          </p>
          <h2 className="mt-4 text-balance font-mono text-2xl font-bold leading-tight tracking-tight text-foreground md:text-3xl lg:text-4xl">
            By having a Graphs Layer
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {benefits.map((benefit, idx) => (
            <div key={idx} className="flex flex-col gap-4 rounded-lg border border-border p-8 hover:border-primary/50 transition-colors">
              <div className="h-10 w-10 text-primary">{benefit.icon}</div>
              <h3 className="font-mono text-xl font-bold text-foreground">
                {benefit.title}
              </h3>
              <p className="text-xl leading-relaxed text-body">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
