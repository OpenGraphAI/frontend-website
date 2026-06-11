"use client"

import { useEffect, useRef } from "react"

interface Node {
  x: number
  y: number
  r: number
  opacity: number
}

interface Edge {
  a: number
  b: number
}

const NODES: Node[] = [
  { x: 0.12, y: 0.18, r: 3.5, opacity: 0.9 },
  { x: 0.28, y: 0.08, r: 2.5, opacity: 0.7 },
  { x: 0.42, y: 0.22, r: 4.0, opacity: 1.0 },
  { x: 0.58, y: 0.10, r: 2.0, opacity: 0.6 },
  { x: 0.72, y: 0.25, r: 3.0, opacity: 0.85 },
  { x: 0.88, y: 0.15, r: 2.5, opacity: 0.7 },
  { x: 0.06, y: 0.45, r: 2.0, opacity: 0.5 },
  { x: 0.20, y: 0.55, r: 3.0, opacity: 0.8 },
  { x: 0.35, y: 0.42, r: 2.5, opacity: 0.65 },
  { x: 0.50, y: 0.50, r: 5.0, opacity: 1.0 },  // central hub
  { x: 0.65, y: 0.40, r: 3.0, opacity: 0.8 },
  { x: 0.80, y: 0.55, r: 2.0, opacity: 0.55 },
  { x: 0.92, y: 0.42, r: 2.5, opacity: 0.7 },
  { x: 0.15, y: 0.75, r: 2.0, opacity: 0.5 },
  { x: 0.30, y: 0.82, r: 3.0, opacity: 0.75 },
  { x: 0.45, y: 0.70, r: 2.5, opacity: 0.65 },
  { x: 0.62, y: 0.78, r: 2.0, opacity: 0.55 },
  { x: 0.76, y: 0.68, r: 3.5, opacity: 0.85 },
  { x: 0.90, y: 0.80, r: 2.0, opacity: 0.5 },
  { x: 0.55, y: 0.90, r: 2.5, opacity: 0.6 },
]

const EDGES: Edge[] = [
  { a: 0, b: 2 }, { a: 1, b: 2 }, { a: 2, b: 4 }, { a: 3, b: 4 },
  { a: 4, b: 5 }, { a: 2, b: 9 }, { a: 7, b: 9 }, { a: 8, b: 9 },
  { a: 9, b: 10 }, { a: 9, b: 15 }, { a: 10, b: 11 }, { a: 10, b: 12 },
  { a: 7, b: 14 }, { a: 14, b: 15 }, { a: 15, b: 16 }, { a: 17, b: 10 },
  { a: 17, b: 16 }, { a: 14, b: 19 }, { a: 19, b: 16 }, { a: 6, b: 7 },
  { a: 0, b: 7 }, { a: 4, b: 10 },
]

export function NodeGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const YELLOW = "#F5C518"

    function draw() {
      if (!canvas || !ctx) return
      const { width, height } = canvas

      ctx.clearRect(0, 0, width, height)

      // Draw edges
      for (const edge of EDGES) {
        const na = NODES[edge.a]
        const nb = NODES[edge.b]
        const ax = na.x * width
        const ay = na.y * height
        const bx = nb.x * width
        const by = nb.y * height

        ctx.beginPath()
        ctx.moveTo(ax, ay)
        ctx.lineTo(bx, by)
        ctx.strokeStyle = `rgba(245,197,24,0.12)`
        ctx.lineWidth = 1
        ctx.stroke()
      }

      // Draw nodes
      for (const node of NODES) {
        const x = node.x * width
        const y = node.y * height

        // glow
        const grd = ctx.createRadialGradient(x, y, 0, x, y, node.r * 4)
        grd.addColorStop(0, `rgba(245,197,24,${node.opacity * 0.3})`)
        grd.addColorStop(1, "rgba(245,197,24,0)")
        ctx.beginPath()
        ctx.arc(x, y, node.r * 4, 0, Math.PI * 2)
        ctx.fillStyle = grd
        ctx.fill()

        // dot
        ctx.beginPath()
        ctx.arc(x, y, node.r, 0, Math.PI * 2)
        ctx.fillStyle = YELLOW
        ctx.globalAlpha = node.opacity
        ctx.fill()
        ctx.globalAlpha = 1
      }
    }

    function resize() {
      if (!canvas) return
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx!.scale(window.devicePixelRatio, window.devicePixelRatio)
      draw()
    }

    resize()
    window.addEventListener("resize", resize)
    return () => window.removeEventListener("resize", resize)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: "block" }}
      aria-hidden="true"
    />
  )
}
