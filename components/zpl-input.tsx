"use client"

import { useCallback, useRef } from "react"
import { Upload, FileText, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ZplInputProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function ZplInput({ value, onChange, disabled }: ZplInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (event) => {
        const text = event.target?.result as string
        onChange(text)
      }
      reader.readAsText(file)

      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    },
    [onChange]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const file = e.dataTransfer.files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (event) => {
        const text = event.target?.result as string
        onChange(text)
      }
      reader.readAsText(file)
    },
    [onChange]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
  }, [])

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">
          ZPL Code
        </label>
        <div className="flex items-center gap-2">
          {value && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onChange("")}
              disabled={disabled}
              className="text-muted-foreground hover:text-foreground h-8 px-2"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Limpar</span>
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className="h-8 gap-1.5 text-xs"
          >
            <Upload className="h-3.5 w-3.5" />
            Upload arquivo
          </Button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".zpl,.txt,.prn"
        onChange={handleFileUpload}
        className="hidden"
        aria-label="Upload ZPL file"
      />

      <div
        className="relative"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {!value && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <FileText className="h-8 w-8 opacity-40" />
            <p className="text-sm">Cole seu ZPL aqui ou arraste um arquivo</p>
          </div>
        )}
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder=""
          spellCheck={false}
          className="h-72 w-full resize-none rounded-lg border border-border bg-secondary p-4 font-mono text-sm text-foreground placeholder:text-transparent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 md:h-96"
        />
      </div>
    </div>
  )
}
