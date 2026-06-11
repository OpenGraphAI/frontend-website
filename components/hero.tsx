import Link from "next/link"
import { RotatingTerminalHint } from "@/components/rotating-terminal-hint"

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-16 bg-background">

      {/* Content - uses same container as other sections */}
      <div className="relative mx-auto w-full max-w-6xl px-6 py-32">
        {/* 2-column grid: left 2/3 content, right 1/3 negative space */}
        <div className="grid grid-cols-1 lg:grid-cols-3">
          {/* Left column - spans 2 of 3 columns on desktop */}
          <div className="lg:col-span-2">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <span className="font-mono text-sm" style={{ color: 'var(--badge-text)' }}>
                open-source · semantic graph layer
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-balance font-mono text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Building the <span className="text-primary">Graph Intelligence</span> For Multimodal AI Agents
            </h1>

            {/* Subheadline */}
            <p className="mt-6 max-w-xl text-pretty leading-relaxed text-body text-xl">
              An open-source semantic graph layer for extracting, linking, and
              reasoning across multimodal data.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="https://github.com/OpenGraphAI/opengraph-ai"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 font-mono text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </a>
              <Link
                href="#"
                className="flex items-center gap-2 rounded-md border border-primary/30 bg-primary/5 px-5 py-2.5 font-mono text-sm font-semibold text-primary transition-colors hover:border-primary/50 hover:bg-primary/10"
              >
                Documentation
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
              </Link>
            </div>

            {/* Install hint — rotating terminal hints */}
            <RotatingTerminalHint />
          </div>
          
          {/* Right column - intentional negative space on desktop */}
          <div className="hidden lg:block" aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
