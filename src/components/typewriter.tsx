import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";

type Segment = {
  text: string;
  className?: string;
  italic?: boolean;
};

type Props = {
  segments: Segment[];
  speed?: number; // ms per character
  startDelay?: number;
  onDone?: () => void;
  caret?: boolean;
};

/**
 * Smooth, clean typewriter. Reveals characters one at a time across multiple
 * styled segments. Honors prefers-reduced-motion. Runs once per mount.
 */
export function Typewriter({ segments, speed = 28, startDelay = 250, onDone, caret = true }: Props) {
  const total = segments.reduce((n, s) => n + s.text.length, 0);
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const [count, setCount] = useState(reduced ? total : 0);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    if (reduced) {
      onDoneRef.current?.();
      return;
    }
    let raf = 0;
    let start = 0;
    let done = false;
    const tick = (t: number) => {
      if (!start) start = t + startDelay;
      const elapsed = Math.max(0, t - start);
      const n = Math.min(total, Math.floor(elapsed / speed));
      setCount(n);
      if (n >= total) {
        if (!done) {
          done = true;
          onDoneRef.current?.();
        }
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [total, speed, startDelay, reduced]);

  let remaining = count;
  const rendered: ReactNode[] = [];
  segments.forEach((seg, i) => {
    const take = Math.max(0, Math.min(seg.text.length, remaining));
    remaining -= take;
    const shown = seg.text.slice(0, take);
    if (!shown) return;
    if (seg.text === "\n") {
      rendered.push(<br key={i} />);
      return;
    }
    rendered.push(
      <span key={i} className={seg.className}>
        {seg.italic ? <em>{shown}</em> : shown}
      </span>,
    );
  });

  return (
    <>
      {rendered}
      {caret && count < total && (
        <motion.span
          aria-hidden
          className="inline-block w-[0.06em] -mb-[0.05em] ml-[0.05em] bg-current align-baseline"
          style={{ height: "0.85em" }}
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
        />
      )}
    </>
  );
}
