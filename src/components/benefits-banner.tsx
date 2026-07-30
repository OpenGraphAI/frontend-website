import { Zap, Coins, Layers } from "lucide-react";
import { Reveal, RevealItem, RevealStagger } from "@/components/reveal";

const ITEMS = [
  {
    key: "performance",
    icon: Zap,
    eyebrow: "Performance target",
    title: "Up to 10x faster",
    body: "Aspirational target — not a proven benchmark.",
  },
  {
    key: "efficiency",
    icon: Coins,
    eyebrow: "Efficiency target",
    title: "Up to 40% fewer tokens",
    body: "Aspirational target — not a proven benchmark.",
  },
  {
    key: "multimodal",
    icon: Layers,
    eyebrow: "By design",
    title: "Multimodal by design",
    body: "Text, tables, images, audio, and video into one queryable context graph.",
  },
];

export function BenefitsBanner() {
  return (
    <section aria-label="Benefit targets" className="mx-auto mt-24 max-w-[1280px] px-6">
      <Reveal>
        <div className="overflow-hidden rounded-2xl border border-primary-foreground/10 bg-primary p-8 text-primary-foreground">
          <p className="mono text-[11px] uppercase tracking-[0.18em] text-accent">Benefit targets</p>
          <RevealStagger className="mt-6 grid gap-8 md:grid-cols-3" delay={0.1}>
            {ITEMS.map((item) => (
              <RevealItem key={item.key} className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <item.icon className="h-4 w-4 text-accent" aria-hidden="true" />
                  <span className="mono text-[11px] uppercase tracking-[0.16em] text-accent">
                    {item.eyebrow}
                  </span>
                </div>
                <h3 className="display text-[26px] leading-[1.05] text-balance">{item.title}</h3>
                <p className="text-[14px] text-pretty text-primary-foreground/70">
                  {item.body}
                </p>
              </RevealItem>
            ))}
          </RevealStagger>
        </div>
      </Reveal>
    </section>
  );
}
