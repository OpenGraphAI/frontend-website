import Link from "next/link"

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4" aria-label="Main navigation">
        <Link href="/" className="flex items-center gap-2 text-foreground">
          {/* Logo mark */}
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <circle cx="4" cy="4" r="2.5" fill="#F5C518" />
            <circle cx="16" cy="4" r="2.5" fill="#F5C518" opacity="0.5" />
            <circle cx="10" cy="10" r="3" fill="#F5C518" />
            <circle cx="4" cy="16" r="2.5" fill="#F5C518" opacity="0.5" />
            <circle cx="16" cy="16" r="2.5" fill="#F5C518" />
            <line x1="4" y1="4" x2="10" y2="10" stroke="#F5C518" strokeWidth="1" strokeOpacity="0.4" />
            <line x1="16" y1="4" x2="10" y2="10" stroke="#F5C518" strokeWidth="1" strokeOpacity="0.4" />
            <line x1="10" y1="10" x2="4" y2="16" stroke="#F5C518" strokeWidth="1" strokeOpacity="0.4" />
            <line x1="10" y1="10" x2="16" y2="16" stroke="#F5C518" strokeWidth="1" strokeOpacity="0.4" />
          </svg>
          <span className="font-mono text-sm font-semibold tracking-tight text-foreground">
            <span className="text-foreground">Open</span><span className="text-primary">Graph</span>{" "}
            <span className="text-foreground">AI</span>
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="#features"
            className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:block"
          >
            Features
          </Link>
          <Link
            href="#open-source"
            className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:block"
          >
            Open Source
          </Link>
          <Link
            href="https://github.com/OpenGraphAI/opengraph-ai"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Docs
          </Link>
          <Link
            href="#"
            className="flex items-center gap-1 text-muted-foreground transition-colors hover:text-primary"
            title="Discord"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.211.375-.445.864-.607 1.25a18.27 18.27 0 0 0-5.487 0c-.163-.386-.395-.875-.607-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.975 14.975 0 0 0 1.293-2.1a.07.07 0 0 0-.038-.098a13.11 13.11 0 0 1-1.872-.892a.072.072 0 0 1-.009-.119c.126-.094.252-.192.372-.291a.075.075 0 0 1 .078-.01c3.928 1.793 8.18 1.793 12.062 0a.075.075 0 0 1 .079.009c.12.099.246.198.373.292a.07.07 0 0 1-.006.118a12.299 12.299 0 0 1-1.873.892a.07.07 0 0 0-.037.099a14.997 14.997 0 0 0 1.293 2.1a.078.078 0 0 0 .084.028a19.963 19.963 0 0 0 6.002-3.03a.079.079 0 0 0 .033-.057c.5-4.761-.838-8.898-3.549-12.571a.06.06 0 0 0-.031-.027zM8.02 15.33c-1.183 0-2.157-.965-2.157-2.156c0-1.193.964-2.157 2.157-2.157c1.193 0 2.156.964 2.157 2.157c0 1.19-.964 2.156-2.157 2.156zm7.975 0c-1.183 0-2.157-.965-2.157-2.156c0-1.193.964-2.157 2.157-2.157c1.193 0 2.156.964 2.157 2.157c0 1.19-.964 2.156-2.157 2.156z" />
            </svg>
          </Link>
          <a
            href="https://github.com/OpenGraphAI/opengraph-ai"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm text-foreground transition-colors hover:border-primary/50 hover:text-primary"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
            GitHub
          </a>
        </div>
      </nav>
    </header>
  )
}
