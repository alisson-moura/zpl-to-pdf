"use client"

import { useEffect, useState } from "react"

const messages = [
  "Processando ZPL...",
  "Gerando etiqueta...",
  "Convertendo para PDF...",
  "Quase pronto...",
]

export function ConversionLoader() {
  const [messageIndex, setMessageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length)
    }, 1800)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-16">
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-muted border-t-primary" />
        <div className="absolute inset-2 animate-spin rounded-full border-4 border-muted border-b-primary" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
      </div>
      <p className="animate-pulse text-sm font-medium text-muted-foreground">
        {messages[messageIndex]}
      </p>
    </div>
  )
}
