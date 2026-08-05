import { NextRequest, NextResponse } from 'next/server'
import { groqJson, GroqError, GROQ_MODELS } from '@/lib/groq'
import { usuarioDaRequisicao } from '@/lib/authServer'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

interface Organizada {
  titulo: string
  conteudo: string
  tags: string[]
}

/**
 * Transforma um texto ditado (cru, sem parágrafos, cheio de "né", "então")
 * numa anotação organizada, sem inventar conteúdo novo.
 */
export async function POST(req: NextRequest) {
  const user = await usuarioDaRequisicao(req)
  if (!user) {
    return NextResponse.json({ error: 'Sessão inválida. Entre novamente.' }, { status: 401 })
  }

  try {
    const { texto } = await req.json()

    if (typeof texto !== 'string' || texto.trim().length < 20) {
      return NextResponse.json({ error: 'Escreva ou dite um pouco mais antes de organizar.' }, { status: 400 })
    }

    const resultado = await groqJson<Organizada>({
      model: GROQ_MODELS.texto,
      temperature: 0.3,
      maxTokens: 2048,
      messages: [
        {
          role: 'system',
          content:
            'Você organiza anotações de estudo bíblico em português brasileiro. Responde sempre em JSON válido.',
        },
        {
          role: 'user',
          content: `Organize a anotação abaixo, que foi ditada por voz.

REGRAS:
- Não invente conteúdo, não acrescente ideias, não pregue. Apenas organize o que já está lá.
- Corrija pontuação, quebre em parágrafos e remova vícios de fala ("né", "então", "tipo", repetições).
- Mantenha a voz e as palavras da pessoa. Se ela citou um versículo, preserve a citação exatamente como ela disse.
- Se houver uma lista de tópicos, formate como lista com hífens.
- Sem markdown de títulos, sem asteriscos.

TEXTO DITADO:
"""
${texto.trim().slice(0, 12000)}
"""

Responda apenas com JSON:
{
  "titulo": "Um título curto e descritivo, até 60 caracteres",
  "conteudo": "O texto organizado em parágrafos",
  "tags": ["até", "quatro", "tags", "minusculas"]
}`,
        },
      ],
    })

    return NextResponse.json({
      titulo: String(resultado.titulo ?? '').trim().slice(0, 120),
      conteudo: String(resultado.conteudo ?? '').trim(),
      tags: Array.isArray(resultado.tags)
        ? resultado.tags.map(t => String(t).toLowerCase().trim()).filter(Boolean).slice(0, 4)
        : [],
    })
  } catch (e: any) {
    if (e instanceof GroqError) {
      return NextResponse.json({ error: e.message }, { status: e.status })
    }
    console.error('[organizar-anotacao] erro:', e?.message)
    return NextResponse.json({ error: `Erro ao organizar: ${e?.message ?? 'tente de novo'}` }, { status: 500 })
  }
}
