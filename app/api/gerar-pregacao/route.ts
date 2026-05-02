import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const key = process.env.GEMINI_API_KEY

  if (!key || key === 'sua_chave_aqui') {
    return NextResponse.json({ error: 'Chave GEMINI_API_KEY não configurada.' }, { status: 500 })
  }

  const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`

  try {
    const { tema, texto_base, publico } = await req.json()

    const prompt = `Gere uma pregação cristã evangélica completa e poderosa sobre "${tema}" baseada em ${texto_base}${publico ? ` para: ${publico}` : ''}.

Responda APENAS com JSON válido, sem markdown, sem explicações, neste formato exato:
{
  "titulo": "Título impactante e memorável",
  "mensagem_central": "A grande verdade central em uma frase poderosa",
  "introducao": "Parágrafo de introdução envolvente que conecta com o público e apresenta o problema",
  "ponto1": "Primeiro ponto com desenvolvimento e versículo bíblico de apoio (cite a referência completa)",
  "ponto2": "Segundo ponto com desenvolvimento e versículo bíblico de apoio (cite a referência completa)",
  "ponto3": "Terceiro ponto com desenvolvimento e versículo bíblico de apoio (cite a referência completa)",
  "ilustracao": "Uma ilustração prática, história ou exemplo que ilustra a mensagem",
  "aplicacao_pratica": "Como a congregação pode aplicar isso na vida prática esta semana",
  "conclusao": "Conclusão poderosa que amarra tudo e apela ao coração",
  "apelo_final": "Chamada para decisão, compromisso ou oração"
}`

    const res = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.85, maxOutputTokens: 2048 },
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      const msg = data?.error?.message ?? `HTTP ${res.status}`
      console.error('[gerar-pregacao] Gemini error:', msg)
      return NextResponse.json({ error: `Erro da IA: ${msg}` }, { status: 502 })
    }

    const text: string | undefined = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!text) throw new Error('Sem resposta da IA')

    const jsonText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const pregacao = JSON.parse(jsonText)

    return NextResponse.json({ pregacao })
  } catch (e: any) {
    console.error('[gerar-pregacao] Erro:', e?.message)
    return NextResponse.json({ error: `Erro ao gerar a pregação: ${e?.message ?? 'tente novamente'}` }, { status: 500 })
  }
}
