"use client"

import { useEffect, useRef, useState } from "react"

const YELLOW = "#F5C518"

interface Node {
  id: number
  x: number
  y: number
  connections: number[]
}

// Generate snowflake pattern nodes
// Center at (0.5, 0.5), 6-fold radial symmetry
const CENTER = { x: 0.5, y: 0.5 }
const INNER_RADIUS = 0.15
const OUTER_RADIUS = 0.32
const BRANCH_RADIUS = 0.24
const BRANCH_OFFSET = Math.PI / 6 // 30 degrees offset for branches

function polarToCart(cx: number, cy: number, r: number, angle: number) {
  return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) }
}

// Node 0: Center
// Nodes 1-6: Inner ring (hexagon)
// Nodes 7-12: Outer tips of main arms
// Nodes 13-18: Branch tips between arms
// Node 19: Extra center accent
const NODES: Node[] = [
  // Center node - connects to all inner ring nodes
  { id: 0, ...CENTER, connections: [1, 2, 3, 4, 5, 6, 19] },
  
  // Inner ring (6 nodes forming hexagon) - each connects to center, neighbors, and outer tip
  ...Array.from({ length: 6 }, (_, i) => {
    const angle = (i * Math.PI) / 3 - Math.PI / 2 // Start from top
    const pos = polarToCart(CENTER.x, CENTER.y, INNER_RADIUS, angle)
    const prevInner = i === 0 ? 6 : i
    const nextInner = i === 5 ? 1 : i + 2
    return {
      id: i + 1,
      ...pos,
      connections: [0, prevInner, nextInner, i + 7, i + 13 > 18 ? 13 : i + 13, i + 14 > 18 ? 14 - 6 : i + 14]
    }
  }),
  
  // Outer tips (6 nodes at end of main arms)
  ...Array.from({ length: 6 }, (_, i) => {
    const angle = (i * Math.PI) / 3 - Math.PI / 2
    const pos = polarToCart(CENTER.x, CENTER.y, OUTER_RADIUS, angle)
    const innerNode = i + 1
    const leftBranch = 13 + i
    const rightBranch = 13 + ((i + 5) % 6)
    return {
      id: i + 7,
      ...pos,
      connections: [innerNode, leftBranch > 18 ? leftBranch - 6 : leftBranch, rightBranch]
    }
  }),
  
  // Branch tips (6 nodes between main arms)
  ...Array.from({ length: 6 }, (_, i) => {
    const angle = (i * Math.PI) / 3 - Math.PI / 2 + BRANCH_OFFSET
    const pos = polarToCart(CENTER.x, CENTER.y, BRANCH_RADIUS, angle)
    const innerNode1 = i + 1
    const innerNode2 = ((i + 1) % 6) + 1
    const outerNode = i + 7
    return {
      id: i + 13,
      ...pos,
      connections: [innerNode1, innerNode2, outerNode, 19]
    }
  }),
  
  // Extra center accent node (slightly offset)
  { id: 19, x: CENTER.x, y: CENTER.y + 0.06, connections: [0, 13, 14, 15, 16, 17, 18] },
]

// Animation timing
const PHASE_APPEAR = 1800   // nodes fade in
const PHASE_CONNECT = 1500  // lines draw
const PHASE_HOLD = 2500     // display complete graph with label
const PHASE_FADE = 500      // fade out before reset
const TOTAL_CYCLE = PHASE_APPEAR + PHASE_CONNECT + PHASE_HOLD + PHASE_FADE

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

export function GraphDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef(0)
  const startTimeRef = useRef<number | null>(null)
  const [, setFrame] = useState(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    function draw(currentTime: number) {
      if (!canvas || !ctx) return
      const width = canvas.offsetWidth
      const height = canvas.offsetHeight

      // Set canvas size for high DPI
      const dpr = window.devicePixelRatio || 1
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.scale(dpr, dpr)

      if (startTimeRef.current === null) {
        startTimeRef.current = currentTime
      }

      const elapsed = (currentTime - startTimeRef.current) % TOTAL_CYCLE
      
      // Determine phase and progress
      let phase: "appear" | "connect" | "hold" | "fade"
      let phaseProgress: number
      let globalAlpha = 1
      
      if (elapsed < PHASE_APPEAR) {
        phase = "appear"
        phaseProgress = elapsed / PHASE_APPEAR
      } else if (elapsed < PHASE_APPEAR + PHASE_CONNECT) {
        phase = "connect"
        phaseProgress = (elapsed - PHASE_APPEAR) / PHASE_CONNECT
      } else if (elapsed < PHASE_APPEAR + PHASE_CONNECT + PHASE_HOLD) {
        phase = "hold"
        phaseProgress = (elapsed - PHASE_APPEAR - PHASE_CONNECT) / PHASE_HOLD
      } else {
        phase = "fade"
        phaseProgress = (elapsed - PHASE_APPEAR - PHASE_CONNECT - PHASE_HOLD) / PHASE_FADE
        globalAlpha = 1 - easeInOutCubic(phaseProgress)
      }

      ctx.clearRect(0, 0, width, height)
      ctx.globalAlpha = globalAlpha

      // Calculate node size based on canvas size
      const nodeRadius = Math.min(width, height) * 0.025
      const nodeRadiusOuter = nodeRadius * 1.6

      // Get node positions
      const positions = NODES.map(node => ({
        x: node.x * width,
        y: node.y * height
      }))

      // Draw connections
      if (phase === "connect" || phase === "hold" || phase === "fade") {
        const connectionProgress = phase === "connect" ? easeOutCubic(phaseProgress) : 1
        const drawnConnections = new Set<string>()

        ctx.lineCap = "round"

        NODES.forEach((node) => {
          const from = positions[node.id]

          node.connections.forEach((targetId) => {
            // Avoid drawing same connection twice
            const key = [node.id, targetId].sort().join("-")
            if (drawnConnections.has(key)) return
            drawnConnections.add(key)

            const to = positions[targetId]
            
            // Line gradient from node to node
            const gradient = ctx.createLinearGradient(from.x, from.y, to.x, to.y)
            gradient.addColorStop(0, `rgba(245, 197, 24, 0.5)`)
            gradient.addColorStop(0.5, `rgba(245, 197, 24, 0.3)`)
            gradient.addColorStop(1, `rgba(245, 197, 24, 0.5)`)
            
            ctx.strokeStyle = gradient
            ctx.lineWidth = 1.5

            ctx.beginPath()
            ctx.moveTo(from.x, from.y)
            
            if (connectionProgress < 1) {
              // Animate line drawing
              const midX = from.x + (to.x - from.x) * connectionProgress
              const midY = from.y + (to.y - from.y) * connectionProgress
              ctx.lineTo(midX, midY)
            } else {
              ctx.lineTo(to.x, to.y)
            }
            
            ctx.stroke()
          })
        })
      }

      // Draw nodes
      NODES.forEach((node, i) => {
        const pos = positions[i]
        
        // Calculate per-node appear progress (staggered entrance)
        let nodeAlpha = 1
        if (phase === "appear") {
          const staggerDelay = i * 120 // 120ms stagger between nodes
          const nodeProgress = Math.max(0, (elapsed - staggerDelay) / (PHASE_APPEAR * 0.6))
          nodeAlpha = Math.min(1, easeOutCubic(nodeProgress))
        }

        if (nodeAlpha <= 0) return

        // Outer glow
        const glowGradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, nodeRadiusOuter * 2)
        glowGradient.addColorStop(0, `rgba(245, 197, 24, ${0.2 * nodeAlpha})`)
        glowGradient.addColorStop(1, "rgba(245, 197, 24, 0)")
        ctx.fillStyle = glowGradient
        ctx.beginPath()
        ctx.arc(pos.x, pos.y, nodeRadiusOuter * 2, 0, Math.PI * 2)
        ctx.fill()

        // Node outer ring
        ctx.strokeStyle = `rgba(245, 197, 24, ${0.4 * nodeAlpha})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(pos.x, pos.y, nodeRadiusOuter, 0, Math.PI * 2)
        ctx.stroke()

        // Node core
        ctx.fillStyle = `rgba(245, 197, 24, ${nodeAlpha})`
        ctx.beginPath()
        ctx.arc(pos.x, pos.y, nodeRadius, 0, Math.PI * 2)
        ctx.fill()
      })

      ctx.globalAlpha = 1
      animationRef.current = requestAnimationFrame(draw)
    }

    animationRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animationRef.current)
    }
  }, [])

  return (
    <section className="border-t border-border py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left column: Canvas animation */}
          <div className="relative aspect-[16/9] overflow-hidden rounded-lg border border-border bg-background">
            <canvas
              ref={canvasRef}
              className="w-full h-full"
              style={{ display: "block" }}
              aria-hidden="true"
            />
          </div>

          {/* Right column: Content */}
          <div className="flex flex-col gap-6">
            <p className="font-mono text-sm uppercase tracking-widest text-primary font-semibold">
              Interactive Demo
            </p>
            <h2 className="text-balance font-mono text-2xl font-bold leading-tight tracking-tight text-foreground md:text-3xl lg:text-4xl">
              Watch the Graph Build in Real-Time
            </h2>
            <p className="text-xl text-body leading-relaxed">
              See how scattered data points transform into a connected knowledge graph. The graph layer enables semantic understanding across your entire data landscape, powering intelligent retrieval, multi-hop reasoning, and autonomous decision-making for AI agents.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
