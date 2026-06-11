import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { Problem } from "@/components/problem"
import { WhatIs } from "@/components/what-is"
import { Benefits } from "@/components/benefits"
import { GraphDemo } from "@/components/graph-demo"
import { Features } from "@/components/features"
import { PoweredBy } from "@/components/powered-by"
import { OpenSource } from "@/components/open-source"
import { Footer } from "@/components/footer"

export default function Page() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <WhatIs />
        <Benefits />
        <GraphDemo />
        <Features />
        <PoweredBy />
        <OpenSource />
      </main>
      <Footer />
    </div>
  )
}
