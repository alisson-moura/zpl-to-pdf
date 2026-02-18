import { NextRequest, NextResponse } from "next/server";

const ZPL_API_URL = process.env.ZPL_API_URL;

export async function POST(request: NextRequest) {
  if (!ZPL_API_URL) {
    return NextResponse.json(
      { error: "Serviço de conversão não configurado." },
      { status: 503 },
    );
  }

  try {
    const zplContent = await request.text();

    if (!zplContent.trim()) {
      return NextResponse.json(
        { error: "ZPL content is required" },
        { status: 400 },
      );
    }

    const response = await fetch(ZPL_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
      },
      body: zplContent,
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          error:
            "Falha ao converter ZPL para PDF. Verifique se o conteúdo ZPL é válido.",
        },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json({
      ...data,
      pdfUrl: data.url,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Erro interno do servidor. Tente novamente." },
      { status: 500 },
    );
  }
}
