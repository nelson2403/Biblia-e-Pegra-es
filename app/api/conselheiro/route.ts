import { NextRequest, NextResponse } from 'next/server'

const SYSTEM = `Você é um conselheiro bíblico cristão compassivo e sábio chamado Elias. Responda SEMPRE em português brasileiro. Base todas as respostas em versículos bíblicos (cite a referência completa). Seja acolhedor e sem julgamentos. Para crises graves (suicídio, violência), indique o CVV (188). Respostas entre 150 e 280 palavras. Termine com um versículo de encorajamento.`

export async function POST(req: NextRequest) {
  const key = process.env.GEMINI_API_KEY

  if (!key || key === 'sua_chave_aqui') {
    return NextResponse.json({ error: 'Chave GEMINI_API_KEY não configurada no servidor.' }, { status: 500 })
  }

  try {
    const { mensagem, historico } = await req.json()

    const contents: { role: string; parts: { text: string }[] }[] = []

    // Injeta o system prompt como primeiro turno user/model para máxima compatibilidade
    contents.push({ role: 'user', parts: [{ text: `[Instruções do sistema]: ${SYSTEM}\n\nEntendido. Estou pronto para ajudar como conselheiro bíblico.` }] })
    contents.push({ role: 'model', parts: [{ text: 'Entendido. Estou pronto para oferecer orientação bíblica compassiva em português.' }] })

    for (const m of historico as { role: string; text: string }[]) {
      contents.push({ role: m.role, parts: [{ text: m.text }] })
    }

    contents.push({ role: 'user', parts: [{ text: mensagem }] })

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      const msg = data?.error?.message ?? `HTTP ${res.status}`
      console.error('[conselheiro] Gemini error:', msg)
      return NextResponse.json({ error: `Erro da IA: ${msg}` }, { status: 502 })
    }

    const text: string | undefined = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!text) {
      console.error('[conselheiro] Sem texto. Resposta:', JSON.stringify(data).slice(0, 300))
      return NextResponse.json({ error: 'A IA não retornou resposta. Tente novamente.' }, { status: 502 })
    }

    return NextResponse.json({ resposta: text })
  } catch (e: any) {
    console.error('[conselheiro] Erro interno:', e?.message)
    return NextResponse.json({ error: `Erro interno: ${e?.message ?? 'desconhecido'}` }, { status: 500 })
  }
}
