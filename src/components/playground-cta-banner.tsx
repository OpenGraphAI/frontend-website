import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";

export function PlaygroundCtaBanner() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const bannerRef = useRef<HTMLDivElement | null>(null);
  const zoneRef = useRef<HTMLDivElement | null>(null);
  const btnRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    const cv = canvasRef.current;
    const host = bannerRef.current;
    if (!cv || !host) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(hover: none), (pointer: coarse)").matches;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const ACCENT = "rgba(255,120,72,";
    const LINK = 150;
    const NODE_COUNT = 32;
    const DRIFT = 0.55;

    let w = 0;
    let h = 0;
    type Node = { x: number; y: number; vx: number; vy: number; r: number; accent: boolean };
    let nodes: Node[] = [];

    const build = () => {
      const r = host.getBoundingClientRect();
      w = r.width;
      h = r.height;
      cv.width = w * dpr;
      cv.height = h * dpr;
      cv.style.width = w + "px";
      cv.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      nodes = Array.from({ length: NODE_COUNT }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: Math.random() - 0.5,
        vy: Math.random() - 0.5,
        r: 1.2 + Math.random() * 1.4,
        accent: Math.random() < 0.16,
      }));
    };
    build();
    const ro = new ResizeObserver(build);
    ro.observe(host);

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < LINK) {
            const t = 1 - d / LINK;
            ctx.strokeStyle = "rgba(255,255,255," + t * 0.1 + ")";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (const nd of nodes) {
        ctx.beginPath();
        ctx.arc(nd.x, nd.y, nd.r, 0, 6.283);
        ctx.fillStyle = nd.accent ? ACCENT + "0.55)" : "rgba(255,255,255,0.42)";
        ctx.fill();
      }
    };

    const stepNodes = () => {
      for (const nd of nodes) {
        nd.x += nd.vx * DRIFT;
        nd.y += nd.vy * DRIFT;
        if (nd.x < -6) nd.x = w + 6;
        else if (nd.x > w + 6) nd.x = -6;
        if (nd.y < -6) nd.y = h + 6;
        else if (nd.y > h + 6) nd.y = -6;
      }
    };

    // Magnetic button
    const zone = zoneRef.current;
    const btn = btnRef.current;
    const R = 260;
    const MAX = 32;
    const tgt = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };

    const onMove = (e: MouseEvent) => {
      if (!zone) return;
      const r = zone.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist < R) {
        tgt.x = Math.max(-MAX, Math.min(MAX, dx * 0.35));
        tgt.y = Math.max(-MAX, Math.min(MAX, dy * 0.35));
      } else {
        tgt.x = 0;
        tgt.y = 0;
      }
    };
    const onLeave = () => {
      tgt.x = 0;
      tgt.y = 0;
    };
    const useMagnetic = !reduced && !coarse && btn;
    if (useMagnetic) {
      host.addEventListener("mousemove", onMove);
      host.addEventListener("mouseleave", onLeave);
    }

    if (reduced) {
      draw();
      return () => {
        ro.disconnect();
      };
    }

    let raf = 0;
    const tick = () => {
      stepNodes();
      draw();
      if (useMagnetic && btn) {
        cur.x += (tgt.x - cur.x) * 0.14;
        cur.y += (tgt.y - cur.y) * 0.14;
        btn.style.transform = `translate(${cur.x.toFixed(2)}px,${cur.y.toFixed(2)}px)`;
      }
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      if (useMagnetic) {
        host.removeEventListener("mousemove", onMove);
        host.removeEventListener("mouseleave", onLeave);
      }
    };
  }, []);

  return (
    <section className="mx-auto mt-24 max-w-[1280px] px-6">
      <div
        ref={bannerRef}
        className="relative flex min-h-[280px] flex-wrap items-center justify-between gap-6 overflow-hidden rounded-[24px] border border-white/[0.07] px-6 py-8 sm:px-10 sm:py-10 md:gap-10 md:px-14 md:py-12 lg:px-[60px]"
        style={{ background: "#0d0d0e", boxShadow: "0 24px 60px -20px rgba(0,0,0,0.5)" }}
      >
        <canvas
          ref={canvasRef}
          className="pointer-events-none absolute inset-0 z-0"
          aria-hidden
        />

        <div className="relative z-10 min-w-0 flex-1 md:min-w-[280px]">
          <div
            className="mono uppercase"
            style={{
              fontSize: 12,
              letterSpacing: "0.22em",
              color: "rgba(255,255,255,0.42)",
              marginBottom: 22,
            }}
          >
            Playground
          </div>
          <h2
            className="display text-balance"
            style={{
              margin: 0,
              fontWeight: 400,
              lineHeight: 1,
              letterSpacing: "-0.01em",
              color: "#fafaf7",
            }}
          >
            <span className="block text-[32px] sm:text-[42px] md:text-[48px] lg:text-[54px]">
              Drop a file.
            </span>
            <span className="block text-[32px] sm:text-[42px] md:text-[48px] lg:text-[54px]">
              Watch a graph appear.
            </span>
          </h2>
        </div>

        <div className="relative z-10 flex w-full flex-wrap items-center gap-4 md:w-auto">
          <div ref={zoneRef} className="relative inline-flex w-full sm:w-auto">
            <Link
              to="/playground"
              ref={btnRef}
              className="inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-accent text-white sm:w-auto"
              style={{
                padding: "14px 26px",
                fontWeight: 600,
                fontSize: 16,
                lineHeight: 1,
                whiteSpace: "nowrap",
                boxShadow: "0 8px 30px oklch(0.68 0.21 35 / 0.35)",
                transition: "box-shadow 220ms, background 150ms",
                willChange: "transform",
              }}
            >
              Open playground <span style={{ fontSize: 15 }} aria-hidden>→</span>
            </Link>
          </div>
          <Link
            to="/auth"
            className="c4-acct inline-flex w-full items-center justify-center rounded-full sm:w-auto"
            style={{
              padding: "14px 26px",
              border: "1px solid rgba(255,255,255,0.2)",
              background: "transparent",
              color: "#fafaf7",
              fontWeight: 500,
              fontSize: 16,
              lineHeight: 1,
              whiteSpace: "nowrap",
              transition: "border-color 180ms, background 180ms",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.42)";
              e.currentTarget.style.background = "rgba(255,255,255,0.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
              e.currentTarget.style.background = "transparent";
            }}
          >
            Create account
          </Link>
        </div>
      </div>
    </section>
  );
}