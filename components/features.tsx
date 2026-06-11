const FEATURES = [
  {
    id: "01",
    title: "Multimodal Extractors",
    description:
      "First-class extractors for tables, texts, images, audio and videos. Parse and normalize diverse data sources into a unified node representation.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M3 9h18M3 15h18M9 3v18" />
      </svg>
    ),
  },
  {
    id: "02",
    title: "Semantic Graph Builder",
    description:
      "Automatically infer relationships and build traversable knowledge graphs with configurable embedding strategies and link schemas.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <path d="m8.59 13.51 6.83 3.98M15.41 4.51 8.59 8.49" />
      </svg>
    ),
  },
  {
    id: "03",
    title: "CLI + API + MCP + Skills",
    description:
      "REST API and a typed CLI — integrate into any stack or automate graph-building pipelines with a single command.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="4 17 10 11 4 5" />
        <line x1="12" x2="20" y1="19" y2="19" />
      </svg>
    ),
  },
  {
    id: "04",
    title: "Agent-First Architecture",
    description:
      "Composable modules, schema-driven configuration, and callable CLI/API/MCP/SKills that agents need for structured understanding.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="m18 16 4-4-4-4" />
        <path d="m6 8-4 4 4 4" />
        <path d="m14.5 4-5 16" />
      </svg>
    ),
  },
]

export function Features() {
  return (
    <section id="features" className="border-t border-border py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16">
          <p className="font-mono text-sm uppercase tracking-widest text-primary font-semibold">
            Key Features
          </p>
          <h2 className="mt-4 text-balance font-mono text-2xl font-bold tracking-tight text-foreground md:text-3xl lg:text-4xl">
            Everything you need to build on graphs
          </h2>
        </div>

        <div className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => (
            <article
              key={feature.id}
              className="flex flex-col gap-4 bg-background p-8"
            >
              {/* Icon */}
              <div className="text-primary">{feature.icon}</div>

              {/* Number */}
              <p className="font-mono text-sm text-foreground font-semibold">
                {feature.id}
              </p>

              {/* Title */}
              <h3 className="font-mono text-lg font-bold text-foreground">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-lg leading-relaxed text-body">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
