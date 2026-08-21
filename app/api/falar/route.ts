import { NextRequest, NextResponse } from 'next/server'
import { sintetizar, vozValida, temChaveTTS, formatoValido, VOZES } from '@/lib/tts'
import { usuarioDaRequisicao } from '@/lib/authServer'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

/** Diz ao app se a voz de nuvem está disponível e quais vozes existem. */
export async function GET() {
  return NextResponse.json({
    disponivel: temChaveTTS(),
    vozes: VOZES,
  })
}

/**
 * Devolve a URL do áudio de um trecho. Gera na Google só na primeira vez;
 * depois serve do cache no Supabase Storage.
 */
export async function POST(req: NextRequest) {
  const user = await usuarioDaRequisicao(req)
  if (!user) {
    return NextResponse.json({ error: 'Sessão inválida. Entre novamente.' }, { status: 401 })
  }

  if (!temChaveTTS()) {
    // O app cai para a voz do aparelho — não é erro, é ausência de recurso.
    return NextResponse.json({ error: 'Voz natural não configurada.' }, { status: 503 })
  }

  try {
    const { texto, voz, formato } = await req.json()

    if (typeof texto !== 'string' || !texto.trim()) {
      return NextResponse.json({ error: 'Texto vazio.' }, { status: 400 })
    }

    // A velocidade não entra aqui: o áudio sai em ritmo natural e o aparelho
    // acelera na reprodução, o que mantém um único arquivo em cache por trecho.
    const resultado = await sintetizar(texto, vozValida(voz), formatoValido(formato))

    return NextResponse.json(resultado)
  } catch (e: any) {
    console.error('[falar] erro:', e?.message)
    return NextResponse.json(
      { error: e?.message ?? 'Não foi possível gerar a voz.' },
      { status: 500 }
    )
  }
}
