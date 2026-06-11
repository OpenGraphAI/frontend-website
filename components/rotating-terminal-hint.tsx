"use client"

import { useEffect, useState } from "react"

const HINTS = [
  "CLI: opengraph query --entity \"LLM models\"",
  "API: POST /graph/embed",
  "MCP: sync_graph_to_db",
]

export function RotatingTerminalHint() {
  const [hint, setHint] = useState(HINTS[0])
  const [displayedText, setDisplayedText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [hintIndex, setHintIndex] = useState(0)

  useEffect(() => {
    let timeout: NodeJS.Timeout

    if (!isDeleting) {
      // Typing animation
      if (displayedText.length < hint.length) {
        timeout = setTimeout(() => {
          setDisplayedText(hint.slice(0, displayedText.length + 1))
        }, 50)
      } else {
        // Pause before deleting
        timeout = setTimeout(() => setIsDeleting(true), 2000)
      }
    } else {
      // Deleting animation
      if (displayedText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayedText(displayedText.slice(0, -1))
        }, 30)
      } else {
        // Move to next hint
        setIsDeleting(false)
        const nextIndex = (hintIndex + 1) % HINTS.length
        setHintIndex(nextIndex)
        setHint(HINTS[nextIndex])
      }
    }

    return () => clearTimeout(timeout)
  }, [displayedText, isDeleting, hint, hintIndex])

  return (
    <div className="mt-12">
      <p className="font-mono text-xl text-body">
        <span className="text-primary/70">$</span>{" "}
        <span className="font-semibold text-foreground">{displayedText}</span>
        <span className="animate-pulse text-primary">_</span>
      </p>
    </div>
  )
}
