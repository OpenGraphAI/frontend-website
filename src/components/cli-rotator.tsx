import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LINES: { tag: string; prompt: string; text: string }[] = [
  { tag: "CLI", prompt: "$", text: 'opengraph-image query "What\'s the most common scene type?"' },
  { tag: "API", prompt: "›", text: "POST /opengraph-image/embed_" },
  { tag: "MCP", prompt: "▸", text: "Call the get_graph_entities tool from opengraph-image" },
];

const TYPE_MS = 55;
const DELETE_MS = 30;
const HOLD_MS = 1600;

export function CliRotator() {
  const [i, setI] = useState(0);
  const [count, setCount] = useState(0);
  const line = LINES[i];
  const total = line.text.length;

  useEffect(() => {
    setCount(0);
    let raf = 0;
    let start = 0;
    let phase: "type" | "hold" | "delete" = "type";
    let holdTimer: ReturnType<typeof setTimeout> | undefined;
    const tick = (t: number) => {
      if (!start) start = t;
      const elapsed = t - start;
      if (phase === "type") {
        const n = Math.min(total, Math.floor(elapsed / TYPE_MS));
        setCount(n);
        if (n >= total) {
          phase = "hold";
          holdTimer = setTimeout(() => {
            phase = "delete";
            start = performance.now();
            raf = requestAnimationFrame(tick);
          }, HOLD_MS);
          return;
        }
      } else if (phase === "delete") {
        const n = Math.max(0, total - Math.floor(elapsed / DELETE_MS));
        setCount(n);
        if (n <= 0) {
          setI((p) => (p + 1) % LINES.length);
          return;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      if (holdTimer) clearTimeout(holdTimer);
    };
  }, [i, total]);

  return (
    <div className="mt-5">
      <AnimatePresence mode="wait">
        <motion.span
          key={line.tag}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="mono block text-[12px] uppercase tracking-[0.18em] text-ink-muted"
        >
          {line.tag}
        </motion.span>
      </AnimatePresence>
      <div className="mono mt-2 flex items-center gap-2 text-[15px] leading-[1.4] text-foreground whitespace-nowrap overflow-hidden">
        <span>{line.prompt}</span>
        <span>
          {line.text.slice(0, count)}
          <motion.span
            aria-hidden
            className="inline-block w-[6px] -mb-[1px] ml-[1px] bg-current align-baseline"
            style={{ height: "0.9em" }}
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
          />
        </span>
      </div>
    </div>
  );
}
