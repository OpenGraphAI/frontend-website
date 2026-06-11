import Link from "next/link"

export function OpenSource() {
  return (
    <section id="open-source" className="border-t border-border py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-start justify-between gap-12 md:flex-row md:items-center">
          {/* Left */}
          <div className="max-w-xl">
            <p className="font-mono text-sm uppercase tracking-widest text-primary font-semibold">
              Open Source
            </p>
            <h2 className="mt-4 text-balance font-mono text-2xl font-bold tracking-tight text-foreground md:text-3xl lg:text-4xl">
              Built in the open,{" "}
              <span className="text-primary">for contributors.</span>
            </h2>
            <p className="mt-4 text-xl leading-relaxed text-body">
              OpenGraph AI is open-source and Apache-2.0 licensed. We welcome
              contributions of all kinds — new extractors, graph algorithms,
              integrations, and documentation improvements.
            </p>
          </div>

          {/* Right — GitHub CTA card */}
          <div className="w-full max-w-sm rounded-md border border-border bg-card p-8">
            <div className="flex items-center gap-3 text-foreground">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
              <p className="font-mono text-sm font-semibold">opengraph-ai / core</p>
            </div>

            <div className="mt-6 flex items-center gap-6 font-mono text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-primary" />
                Python
              </span>
              <span>Apache-2.0 License</span>
            </div>

            <a
              href="https://github.com/OpenGraphAI/opengraph-ai"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-md border border-primary bg-transparent px-4 py-2.5 font-mono text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              View on GitHub
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M7 7h10v10" />
                <path d="M7 17 17 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
