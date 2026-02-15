"use client"

import { useState, useCallback } from "react"
import { FileCode2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ZplInput } from "@/components/zpl-input"
import { ConversionLoader } from "@/components/conversion-loader"
import { PdfPreview } from "@/components/pdf-preview"

type AppState = "input" | "loading" | "preview" | "error"

export default function Page() {
  const [zplContent, setZplContent] = useState("")
  const [appState, setAppState] = useState<AppState>("input")
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState("")

  const handleConvert = useCallback(async () => {
    if (!zplContent.trim()) return

    setAppState("loading")
    setErrorMessage("")

    try {
      const response = await fetch("/api/convert", {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
        },
        body: zplContent,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Falha na conversão")
      }

      const data = await response.json()
      setPdfUrl(data.pdfUrl)
      setAppState("preview")
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Erro desconhecido. Tente novamente."
      )
      setAppState("error")
    }
  }, [zplContent])

  const handleReset = useCallback(() => {
    setAppState("input")
    setPdfUrl(null)
    setErrorMessage("")
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <FileCode2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-foreground">
              ZPL to PDF
            </h1>
            <p className="text-xs text-muted-foreground">
              Converta ZPL para PDF em segundos
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        {appState === "input" && (
          <div className="flex flex-col gap-6">
            <ZplInput
              value={zplContent}
              onChange={setZplContent}
              disabled={false}
            />
            <Button
              onClick={handleConvert}
              disabled={!zplContent.trim()}
              className="h-11 gap-2 bg-primary text-primary-foreground hover:bg-primary/90 self-end"
            >
              Converter para PDF
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {appState === "loading" && (
          <div className="rounded-lg border border-border bg-card p-8">
            <ConversionLoader />
          </div>
        )}

        {appState === "preview" && pdfUrl && (
          <PdfPreview pdfUrl={pdfUrl} onReset={handleReset} />
        )}

        {appState === "error" && (
          <div className="flex flex-col items-center gap-4 rounded-lg border border-destructive/50 bg-destructive/10 p-8">
            <div className="text-center">
              <h2 className="text-base font-semibold text-foreground">
                Erro na conversão
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {errorMessage}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleReset}
                className="h-9 gap-1.5"
              >
                Voltar e tentar novamente
              </Button>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <p className="text-center text-xs text-muted-foreground">
            Envie seu ZPL como texto ou arquivo. O PDF é gerado instantaneamente.
          </p>
        </div>
      </footer>
    </div>
  )
}
