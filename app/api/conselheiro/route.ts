import { NextRequest, NextResponse } from 'next/server'

const SYSTEM = `Você é um conselheiro bíblico cristão compassivo e sábio, chamado Elias. Seu papel é oferecer orientação espiritual embasada nas Escrituras Sagradas.

Regras:
- Responda SEMPRE em português brasileiro
- Base TODA resposta em versículos bíblicos relevantes (cite livro, capítulo e versículo)
- Seja compassivo, acolhedor e sem julgamentos
- Para crises graves (suicídio, violência doméstica), indique ajuda profissional imediatamente (CVV: 188)
- Respostas entre 150 e 280 palavras
- Termine com um versículo de encorajamento em itálico`

export async function POST(req: NextRequest) {
  const key = process.env.GEMINI_API_KEY

  if (!key || key === 'sua_chave_aqui') {
    return NextResponse.json({ error: 'Chave da IA não configurada no servidor.' }, { status: 500 })
  }

  const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`

  try {
    const { mensagem, historico } = await req.json()

    const contents = [
      ...(historico as { role: string; text: string }[]).map(m => ({
        role: m.role,
        parts: [{ text: m.text }],
      })),
      { role: 'user', parts: [{ text: mensagem }] },
    ]

    const res = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM }] },
        contents,
        generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      const geminiError = data?.error?.message ?? `HTTP ${res.status}`
      console.error('Gemini API error:', geminiError)
      return NextResponse.json({ error: `Erro da IA: ${geminiError}` }, { status: 502 })
    }

    const text: string | undefined = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!text) {
      console.error('Gemini sem texto. Resposta completa:', JSON.stringify(data))
      return NextResponse.json({ error: 'A IA não retornou resposta. Tente novamente.' }, { status: 502 })
    }

    return NextResponse.json({ resposta: text })
  } catch (e: any) {
    console.error('Conselheiro route error:', e?.message)
    return NextResponse.json({ error: 'Erro interno ao consultar o conselheiro.' }, { status: 500 })
  }
}
