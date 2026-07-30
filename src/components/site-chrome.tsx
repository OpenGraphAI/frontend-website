import { Link, useNavigate } from "@tanstack/react-router";
import { useCurrentUser } from "@/hooks/use-current-user";
import { supabase } from "@/integrations/supabase/client";
import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const HOW_ITEMS = [
  { to: "/opengraph-image", label: "OpenGraph Image", desc: "Images → knowledge graph" },
  { to: "/opengraph-text", label: "OpenGraph Text", desc: "Docs & long-form text (soon)" },
  { to: "/opengraph-table", label: "OpenGraph Table", desc: "Tables & spreadsheets (soon)" },
] as const;

export function SiteNav() {
  const user = useCurrentUser();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  }
  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[1280px] items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <Logo className="h-5 w-5" />
          <span className="text-[15px] font-medium tracking-tight">OpenGraph&nbsp;<span className="text-accent">AI</span></span>
        </Link>
        <nav className="hidden items-center gap-7 text-[13px] text-ink-muted md:flex">
          <HowItWorksMenu />
          <Link to="/use-cases" className="hover:text-foreground transition-colors" activeProps={{ className: "text-foreground" }}>Use cases</Link>
          <Link to="/resources" className="hover:text-foreground transition-colors" activeProps={{ className: "text-foreground" }}>Resources</Link>
          <Link to="/about" className="hover:text-foreground transition-colors" activeProps={{ className: "text-foreground" }}>About</Link>
          <a href="https://github.com/OpenGraphAI/opengraph-ai" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">GitHub</a>
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <button onClick={signOut} className="hidden text-[13px] text-ink-muted hover:text-foreground sm:inline">Sign out</button>
              <Link
                to="/dashboard"
                className="hidden items-center gap-1.5 rounded-full bg-foreground px-3.5 py-1.5 text-[13px] font-medium text-background transition-transform hover:-translate-y-px sm:inline-flex"
              >
                Dashboard
                <span aria-hidden>→</span>
              </Link>
            </>
          ) : (
            <>
              <Link to="/auth" className="hidden text-[13px] text-ink-muted hover:text-foreground sm:inline">Sign in</Link>
              <Link
                to="/playground"
                className="hidden items-center gap-1.5 rounded-full bg-foreground px-3.5 py-1.5 text-[13px] font-medium text-background transition-transform hover:-translate-y-px sm:inline-flex"
              >
                Try playground
                <span aria-hidden>→</span>
              </Link>
            </>
          )}
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="ml-1 inline-flex h-9 w-9 items-center justify-center rounded-md border border-rule text-ink-muted hover:text-foreground md:hidden"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              {mobileOpen ? (
                <>
                  <path d="M4 4l8 8" />
                  <path d="M12 4l-8 8" />
                </>
              ) : (
                <>
                  <path d="M2.5 5h11" />
                  <path d="M2.5 8h11" />
                  <path d="M2.5 11h11" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [howOpen, setHowOpen] = useState(true);
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
          className="border-t border-rule bg-background md:hidden"
          id="mobile-menu"
        >
          <div className="mx-auto max-w-[1280px] px-6 py-4">
            <div className="flex flex-col gap-1 text-[14px]">
              <MobileGroup
                label="How it works"
                to="/how-it-works"
                open={howOpen}
                onToggle={() => setHowOpen((v) => !v)}
                onNavigate={onClose}
                items={HOW_ITEMS.map((i) => ({ to: i.to, label: i.label }))}
              />
              <Link to="/use-cases" onClick={onClose} className="rounded-md px-2 py-2 hover:bg-surface">Use cases</Link>
              <Link to="/resources" onClick={onClose} className="rounded-md px-2 py-2 hover:bg-surface">Resources</Link>
              <Link to="/about" onClick={onClose} className="rounded-md px-2 py-2 hover:bg-surface">About</Link>
              <a href="https://github.com/OpenGraphAI/opengraph-ai" target="_blank" rel="noreferrer" className="rounded-md px-2 py-2 hover:bg-surface">GitHub</a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MobileGroup({
  label,
  to,
  open,
  onToggle,
  onNavigate,
  items,
}: {
  label: string;
  to: string;
  open: boolean;
  onToggle: () => void;
  onNavigate: () => void;
  items: { to: string; label: string }[];
}) {
  return (
    <div>
      <div className="flex items-center">
        <Link to={to} onClick={onNavigate} className="flex-1 rounded-md px-2 py-2 hover:bg-surface">
          {label}
        </Link>
        <button
          type="button"
          aria-label={`${open ? "Collapse" : "Expand"} ${label}`}
          aria-expanded={open}
          onClick={onToggle}
          className="grid h-9 w-9 place-items-center rounded-md text-ink-muted hover:text-foreground"
        >
          <motion.svg width="10" height="10" viewBox="0 0 10 10" animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </motion.svg>
        </button>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden pl-3"
          >
            {items.map((i) => (
              <li key={i.to}>
                <a
                  href={i.to}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate();
                    window.location.assign(i.to);
                  }}
                  className="block rounded-md px-2 py-2 text-ink-muted hover:bg-surface hover:text-foreground"
                >
                  {i.label}
                </a>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

function HowItWorksMenu() {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const firstItemRef = useRef<HTMLAnchorElement | null>(null);

  const clearClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };
  const scheduleClose = () => {
    clearClose();
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    // move focus to first item for keyboard users
    setTimeout(() => firstItemRef.current?.focus(), 20);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative flex items-center" onMouseEnter={() => { clearClose(); setOpen(true); }} onMouseLeave={scheduleClose}>
      <Link
        to="/how-it-works"
        className="hover:text-foreground transition-colors"
        activeProps={{ className: "text-foreground" }}
      >
        How it works
      </Link>
      <button
        type="button"
        aria-label={open ? "Close How it works menu" : "Open How it works menu"}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls="how-it-works-menu"
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setOpen(true);
          }
        }}
        className="ml-1 inline-flex h-6 w-6 items-center justify-center rounded text-ink-muted hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
      >
        <motion.svg width="10" height="10" viewBox="0 0 10 10" animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="opacity-60">
          <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id="how-it-works-menu"
            role="menu"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-1/2 top-full z-50 mt-3 w-[380px] -translate-x-1/2"
            style={{ transformOrigin: "top center" }}
            onMouseEnter={clearClose}
            onMouseLeave={scheduleClose}
          >
            <div className="rounded-2xl border border-rule bg-background p-4 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.25)]">
              <div className="mb-2 flex items-center justify-between px-2">
                <span className="mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">Modalities</span>
                <Link to="/how-it-works" onClick={() => setOpen(false)} className="text-[11px] text-ink-muted hover:text-foreground">
                  Pipeline overview →
                </Link>
              </div>
              <ul className="flex flex-col">
                {HOW_ITEMS.map((item, i) => (
                  <li key={item.to}>
                    <Link
                      ref={i === 0 ? firstItemRef : undefined}
                      to={item.to}
                      role="menuitem"
                      onClick={() => setOpen(false)}
                      className="group block rounded-lg px-3 py-2.5 transition-colors hover:bg-surface focus-visible:bg-surface focus-visible:outline-none"
                    >
                      <div className="text-[13px] font-medium text-foreground group-hover:text-accent transition-colors">
                        {item.label}
                      </div>
                      <p className="mt-0.5 text-[11.5px] leading-snug text-ink-muted">{item.desc}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-rule mt-32">
      <div className="mx-auto grid max-w-[1280px] gap-10 px-6 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2">
            <Logo className="h-5 w-5" />
            <span className="text-[15px] font-medium">OpenGraph&nbsp;<span className="text-accent">AI</span></span>
          </div>
          <p className="mt-3 max-w-xs text-[13px] text-ink-muted">
            Heterogeneous data into queryable knowledge graphs. Context for agents that need to reason.
          </p>
        </div>
        <FooterCol title="Product" links={[
          { label: "How it works", to: "/how-it-works" },
          { label: "Use cases", to: "/use-cases" },
          { label: "Playground", to: "/playground" },
        ]} />
        <FooterCol title="Company" links={[
          { label: "About", to: "/about" },
          { label: "LinkedIn", href: "https://www.linkedin.com/company/opengraph-ai" },
          { label: "Website", href: "https://www.opengraphai.io" },
        ]} />
        <FooterCol title="Developers" links={[
          { label: "Resources", to: "/resources" },
          { label: "GitHub", href: "https://github.com/OpenGraphAI/opengraph-ai" },
        ]} />
      </div>
      <div className="border-t border-rule">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-4 text-[12px] text-ink-muted">
          <span>© {new Date().getFullYear()} OpenGraph AI</span>
          <span className="mono">v0.1 · research preview</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; to?: string; href?: string }[] }) {
  return (
    <div>
      <div className="text-[12px] uppercase tracking-[0.14em] text-ink-muted">{title}</div>
      <ul className="mt-3 space-y-2 text-[13px]">
        {links.map((l) =>
          l.to ? (
            <li key={l.label}><Link to={l.to} className="hover:text-accent">{l.label}</Link></li>
          ) : (
            <li key={l.label}><a href={l.href} target="_blank" rel="noreferrer" className="hover:text-accent">{l.label}</a></li>
          )
        )}
      </ul>
    </div>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="5" cy="6" r="2" fill="currentColor" />
      <circle cx="19" cy="6" r="2" />
      <circle cx="12" cy="13" r="2" fill="currentColor" />
      <circle cx="5" cy="19" r="2" />
      <circle cx="19" cy="19" r="2" fill="currentColor" />
      <path d="M5 6L12 13M19 6L12 13M12 13L5 19M12 13L19 19" />
    </svg>
  );
}
