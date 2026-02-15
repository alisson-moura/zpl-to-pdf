"use client"

import { useEffect, useState, useCallback } from "react"
import { Download, ExternalLink, RotateCcw, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PdfPreviewProps {
  pdfUrl: string
  onReset: () => void
}

export function PdfPreview({ pdfUrl, onReset }: PdfPreviewProps) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let revoked = false

    async function fetchPdf() {
      try {
        setLoading(true)
        setError(false)

        const proxyUrl = `/api/pdf-proxy?url=${encodeURIComponent(pdfUrl)}`
        const response = await fetch(proxyUrl)

        if (!response.ok) throw new Error("Failed to fetch PDF")

        const blob = await response.blob()
        const url = URL.createObjectURL(blob)

        if (!revoked) {
          setBlobUrl(url)
          setLoading(false)
        }
      } catch {
        if (!revoked) {
          setError(true)
          setLoading(false)
        }
      }
    }

    fetchPdf()

    return () => {
      revoked = true
      if (blobUrl) URL.revokeObjectURL(blobUrl)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdfUrl])

  const handleDownload = useCallback(() => {
    if (!blobUrl) return
    const link = document.createElement("a")
    link.href = blobUrl
    link.download = "label.pdf"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [blobUrl])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-border bg-card p-12">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Carregando preview do PDF...</p>
      </div>
    )
  }

  if (error || !blobUrl) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-lg border border-destructive/50 bg-destructive/10 p-8">
        <p className="text-sm text-foreground">Nao foi possivel carregar o preview do PDF.</p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onReset} className="h-8 gap-1.5 text-xs">
            <RotateCcw className="h-3.5 w-3.5" />
            Nova conversao
          </Button>
          <Button
            size="sm"
            asChild
            className="h-8 gap-1.5 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3.5 w-3.5" />
              Abrir link direto
            </a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <h2 className="text-sm font-medium text-foreground">
          PDF gerado com sucesso
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="h-8 gap-1.5 text-xs"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Nova conversao
          </Button>
          <Button
            variant="outline"
            size="sm"
            asChild
            className="h-8 gap-1.5 text-xs"
          >
            <a href={blobUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3.5 w-3.5" />
              Abrir em nova aba
            </a>
          </Button>
          <Button
            size="sm"
            onClick={handleDownload}
            className="h-8 gap-1.5 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Download className="h-3.5 w-3.5" />
            Download PDF
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-secondary">
        <iframe
          src={blobUrl}
          title="PDF Preview"
          className="h-[500px] w-full md:h-[600px]"
        />
      </div>
    </div>
  )
}
