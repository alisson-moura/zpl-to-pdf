import { NextRequest, NextResponse } from "next/server"

const ALLOWED_PDF_DOMAIN = process.env.ALLOWED_PDF_DOMAIN

export async function GET(request: NextRequest) {
  if (!ALLOWED_PDF_DOMAIN) {
    return NextResponse.json(
      { error: "Proxy de PDF não configurado." },
      { status: 503 }
    )
  }

  const url = request.nextUrl.searchParams.get("url")

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 })
  }

  try {
    const parsedUrl = new URL(url)
    if (parsedUrl.hostname !== ALLOWED_PDF_DOMAIN) {
      return NextResponse.json({ error: "Invalid URL domain" }, { status: 403 })
    }

    const response = await fetch(url)

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch PDF" },
        { status: response.status }
      )
    }

    const pdfBuffer = await response.arrayBuffer()

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="label.pdf"',
        "Cache-Control": "public, max-age=3600",
      },
    })
  } catch {
    return NextResponse.json(
      { error: "Erro ao buscar PDF" },
      { status: 500 }
    )
  }
}
