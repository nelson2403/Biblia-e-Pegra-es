import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const key = process.env.GROQ_API_KEY

  if (!key || key === 'sua_chave_aqui') {
    return NextResponse.json({ error: 'Chave GROQ_API_KEY não configurada.' }, { status: 500 })
  }

  try {
    const { tema, texto_base, publico } = await req.json()

    const prompt = `Gere uma pregação cristã evangélica completa e poderosa sobre "${tema}" baseada em ${texto_base}${publico ? ` para: ${publico}` : ''}.

Responda APENAS com JSON válido, sem markdown, sem texto extra, neste formato:
{
  "titulo": "Título impactante e memorável",
  "mensagem_central": "A grande verdade central em uma frase poderosa",
  "introducao": "Parágrafo de introdução envolvente que conecta com o público",
  "ponto1": "Primeiro ponto com desenvolvimento e versículo bíblico de apoio",
  "ponto2": "Segundo ponto com desenvolvimento e versículo bíblico de apoio",
  "ponto3": "Terceiro ponto com desenvolvimento e versículo bíblico de apoio",
  "ilustracao": "Uma ilustração prática ou história que ilustra a mensagem",
  "aplicacao_pratica": "Como a congregação pode aplicar isso na vida prática",
  "conclusao": "Conclusão poderosa que amarra tudo",
  "apelo_final": "Chamada para decisão, compromisso ou oração"
}`

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.85,
        max_tokens: 2048,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      const msg = data?.error?.message ?? `HTTP ${res.status}`
      console.error('[gerar-pregacao] Groq error:', msg)
      return NextResponse.json({ error: `Erro da IA: ${msg}` }, { status: 502 })
    }

    const text: string | undefined = data.choices?.[0]?.message?.content

    if (!text) throw new Error('Sem resposta da IA')

    const jsonText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const pregacao = JSON.parse(jsonText)

    return NextResponse.json({ pregacao })
  } catch (e: any) {
    console.error('[gerar-pregacao] Erro:', e?.message)
    return NextResponse.json({ error: `Erro ao gerar a pregação: ${e?.message ?? 'tente novamente'}` }, { status: 500 })
  }
}
