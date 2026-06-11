export function Problem() {
  return (
    <section className="border-t border-border py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left: Heterogeneous Data Sources SVG Illustration */}
          <div className="relative">
            <svg
              viewBox="0 0 400 300"
              className="w-full h-auto"
              aria-label="Illustration of disconnected heterogeneous data sources"
            >
              {/* Background grid lines */}
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="400" height="300" fill="url(#grid)" />

              {/* Data Source 1: Text Documents */}
              <g transform="translate(40, 30)">
                <rect x="0" y="0" width="60" height="75" rx="4" fill="none" stroke="#F5C518" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.6" />
                <line x1="10" y1="15" x2="50" y2="15" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                <line x1="10" y1="25" x2="45" y2="25" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
                <line x1="10" y1="35" x2="48" y2="35" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
                <line x1="10" y1="45" x2="40" y2="45" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
                <line x1="10" y1="55" x2="50" y2="55" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
                <text x="30" y="90" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10" fontFamily="monospace">Text</text>
              </g>

              {/* Data Source 2: Table/Spreadsheet */}
              <g transform="translate(170, 20)">
                <rect x="0" y="0" width="70" height="55" rx="4" fill="none" stroke="#F5C518" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.6" />
                <line x1="0" y1="15" x2="70" y2="15" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                <line x1="0" y1="30" x2="70" y2="30" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                <line x1="0" y1="45" x2="70" y2="45" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                <line x1="25" y1="0" x2="25" y2="55" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                <line x1="50" y1="0" x2="50" y2="55" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                <text x="35" y="70" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10" fontFamily="monospace">Tables</text>
              </g>

              {/* Data Source 3: Image */}
              <g transform="translate(300, 40)">
                <rect x="0" y="0" width="60" height="50" rx="4" fill="none" stroke="#F5C518" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.6" />
                <circle cx="20" cy="18" r="8" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
                <path d="M 8 42 L 22 28 L 32 38 L 42 26 L 52 42 Z" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
                <text x="30" y="65" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10" fontFamily="monospace">Images</text>
              </g>

              {/* Data Source 4: Audio Waveform */}
              <g transform="translate(50, 160)">
                <rect x="0" y="0" width="80" height="45" rx="4" fill="none" stroke="#F5C518" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.6" />
                <path d="M 10 22 Q 15 8 20 22 Q 25 36 30 22 Q 35 12 40 22 Q 45 32 50 22 Q 55 14 60 22 Q 65 30 70 22" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                <text x="40" y="60" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10" fontFamily="monospace">Audio</text>
              </g>

              {/* Data Source 5: Video */}
              <g transform="translate(280, 150)">
                <rect x="0" y="0" width="70" height="50" rx="4" fill="none" stroke="#F5C518" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.6" />
                <polygon points="28,15 28,35 45,25" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                <text x="35" y="65" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10" fontFamily="monospace">Video</text>
              </g>

            </svg>
          </div>

          {/* Right: Problem content */}
          <div>
            <p className="font-mono text-sm uppercase tracking-widest text-primary font-semibold">
              Why We Need Graphs
            </p>
            <h2 className="mt-4 text-balance font-mono text-2xl font-bold leading-tight tracking-tight text-foreground md:text-3xl lg:text-4xl">
              The shift from <span className="text-primary">chatbots</span>{" "}
              to <span className="text-primary">agents</span> has made graph layer essential:
            </h2>
            <div className="mt-8 space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border border-primary/50 bg-primary/10">
                    <span className="text-sm font-semibold text-primary">1</span>
                  </div>
                </div>
                <div>
                  <p className="font-mono text-lg font-bold text-foreground">
                    Fragmented Data Sources
                  </p>
                  <p className="mt-2 text-xl text-body">
                    Data scattered across documents, databases and unstructured sources without unified access.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border border-primary/50 bg-primary/10">
                    <span className="text-sm font-semibold text-primary">2</span>
                  </div>
                </div>
                <div>
                  <p className="font-mono text-lg font-bold text-foreground">
                    The Bottleneck: Multi-hop Reasoning
                  </p>
                  <p className="mt-2 text-xl text-body">
                    Scaling agentic AI requires self-operating graph layers that agents can reason over and update.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border border-primary/50 bg-primary/10">
                    <span className="text-sm font-semibold text-primary">3</span>
                  </div>
                </div>
                <div>
                  <p className="font-mono text-lg font-bold text-foreground">
                    Agentic Systems Need Graphs
                  </p>
                  <p className="mt-2 text-xl text-body">
                    Multimodal semantic graph layers that enable retrieval, reasoning, and knowledge synthesis for truly autonomous agents.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section >
  )
}
