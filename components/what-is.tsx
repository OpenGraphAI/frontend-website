export function WhatIs() {
  return (
    <section className="border-t border-border py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 md:grid-cols-2 md:gap-20">
          {/* Label */}
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-primary font-semibold">
              What is OpenGraph AI?
            </p>
            <h2 className="mt-4 text-balance font-mono text-3xl font-bold leading-tight tracking-tight text-foreground md:text-4xl">
              A graph engine built for the multimodal AI agents
            </h2>
          </div>

          {/* Body */}
          <div className="flex flex-col justify-center gap-6 text-body leading-relaxed text-xl">
            <p>
              <span className="text-primary">OpenGraph AI</span> is building a semantic graph engine designed to extract, connect, and reason over
              information from multiple data modalities: tables, texts, images, audio, and videos.
            </p>
            <p>
              Built for agentic AI systems, OpenGraph AI provides unified <span className="text-primary">CLIs, APIs, MCP Servers</span> and <span className="text-primary">Agent Skills</span> for constructing graphs layer that power complex reasoning and retrieval for AI agents
              across heterogeneous data.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
