import { NextRequest, NextResponse } from 'next/server'

const SYSTEM = `Você é um conselheiro bíblico cristão compassivo e sábio chamado Elias. Responda SEMPRE em português brasileiro. Base todas as respostas em versículos bíblicos relevantes (cite o livro, capítulo e versículo). Seja acolhedor e sem julgamentos. Para crises graves como suicídio ou violência, indique ajuda profissional imediatamente (CVV: 188). Mantenha respostas entre 150 e 280 palavras. Termine com um versículo de encorajamento.`

export async function POST(req: NextRequest) {
  const key = process.env.GROQ_API_KEY

  if (!key || key === 'sua_chave_aqui') {
    return NextResponse.json({ error: 'Chave GROQ_API_KEY não configurada no servidor.' }, { status: 500 })
  }

  try {
    const { mensagem, historico } = await req.json()

    const messages: { role: string; content: string }[] = [
      { role: 'system', content: SYSTEM },
      ...(historico as { role: string; text: string }[]).map(m => ({
        role: m.role === 'model' ? 'assistant' : 'user',
        content: m.text,
      })),
      { role: 'user', content: mensagem },
    ]

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages,
        temperature: 0.7,
        max_tokens: 1024,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      const msg = data?.error?.message ?? `HTTP ${res.status}`
      console.error('[conselheiro] Groq error:', msg)
      return NextResponse.json({ error: `Erro da IA: ${msg}` }, { status: 502 })
    }

    const text: string | undefined = data.choices?.[0]?.message?.content

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
