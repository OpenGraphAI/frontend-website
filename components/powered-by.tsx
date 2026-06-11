export function PoweredBy() {
  return (
    <section className="border-t border-border py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        {/* Heading */}
        <div className="text-center mb-16">
          <p className="font-mono text-sm uppercase tracking-widest text-primary font-semibold mb-4">
            Enterprise Infrastructure
          </p>
          <h2 className="text-balance font-mono text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
            Built on World-Class Technology
          </h2>
        </div>

        {/* Logo Strip */}
        <div className="relative">
          {/* Gradient edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          {/* Logo container */}
          <div className="flex items-center justify-center gap-12 md:gap-20 py-16 border-y border-border/50 flex-wrap">
            {[
              { src: "/google-logo.png", alt: "Google", label: "Google" },
              { src: "/aws-logo.png", alt: "AWS", label: "AWS" },
            ].map(({ src, alt, label }) => (
              <div key={label} className="flex flex-col items-center gap-4 group">
                <div className="h-16 w-32 flex items-center justify-center opacity-60 group-hover:opacity-90 transition-opacity duration-300">
                  <img
                    src={src}
                    alt={alt}
                    className="max-h-16 max-w-full object-contain"
                  />
                </div>
                <span className="font-mono text-sm font-semibold text-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Trust statement */}
        <p className="mt-12 text-center text-xl text-body max-w-2xl mx-auto">
          Trusted by AI teams building the next generation of AI agents with production-grade infrastructure.
        </p>
      </div>
    </section>
  )
}
