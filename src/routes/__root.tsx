import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  useRouterState,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteNav, SiteFooter } from "@/components/site-chrome";
import { supabase } from "@/integrations/supabase/client";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-md text-center">
        <div className="mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">404</div>
        <h1 className="display mt-4 text-[64px] leading-none">Lost in the graph.</h1>
        <p className="mt-3 text-[14px] text-ink-muted">No node exists at this URL.</p>
        <a href="/" className="mt-6 inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-[14px] text-background">Back home →</a>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => { reportLovableError(error, { boundary: "tanstack_root_error_component" }); }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="max-w-md text-center">
        <h1 className="display text-[40px]">Something broke.</h1>
        <p className="mt-2 text-[14px] text-ink-muted">Try again, or head home.</p>
        <div className="mt-6 flex justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }} className="rounded-full bg-foreground px-5 py-3 text-[14px] text-background">Try again</button>
          <a href="/" className="rounded-full border border-rule px-5 py-3 text-[14px]">Go home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "OpenGraph AI — Context graphs for reasoning agents" },
      { name: "description", content: "Turn tables, text, images, audio and video into queryable knowledge graphs that power complex reasoning and retrieval for AI agents." },
      { name: "author", content: "OpenGraph AI" },
      { property: "og:site_name", content: "OpenGraph AI" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "OpenGraph AI — Context graphs for reasoning agents" },
      { name: "twitter:title", content: "OpenGraph AI — Context graphs for reasoning agents" },
      { property: "og:description", content: "Turn tables, text, images, audio and video into queryable knowledge graphs that power complex reasoning and retrieval for AI agents." },
      { name: "twitter:description", content: "Turn tables, text, images, audio and video into queryable knowledge graphs that power complex reasoning and retrieval for AI agents." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/9b3091a1-d2bf-472d-9cfa-26091bed6e0d" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/9b3091a1-d2bf-472d-9cfa-26091bed6e0d" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500&family=Instrument+Serif:ital@0;1&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAuth = pathname === "/auth";

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      router.invalidate();
      if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
    });
    return () => sub.subscription.unsubscribe();
  }, [router, queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen flex-col">
        {!isAuth && <SiteNav />}
        <main className="flex-1">
          <Outlet />
        </main>
        {!isAuth && <SiteFooter />}
      </div>
    </QueryClientProvider>
  );
}
