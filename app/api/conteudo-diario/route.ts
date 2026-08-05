import { NextRequest, NextResponse } from 'next/server'
import { obterConteudoDiario, hojeISO } from '@/lib/conteudoDiario'
import { usuarioDaRequisicao } from '@/lib/authServer'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

/**
 * Devolve o versículo + estudo do dia. Se ainda não existir para hoje, gera na hora.
 * Assim o conteúdo aparece mesmo que o cron não tenha rodado.
 */
export async function GET(req: NextRequest) {
  const user = await usuarioDaRequisicao(req)
  if (!user) {
    return NextResponse.json({ error: 'Sessão inválida. Entre novamente.' }, { status: 401 })
  }

  const dataParam = req.nextUrl.searchParams.get('data')
  const data = /^\d{4}-\d{2}-\d{2}$/.test(dataParam ?? '') ? dataParam! : hojeISO()

  try {
    const conteudo = await obterConteudoDiario(data)
    return NextResponse.json({ conteudo })
  } catch (e: any) {
    console.error('[conteudo-diario] erro:', e?.message)
    return NextResponse.json(
      { error: e?.message ?? 'Não foi possível carregar o conteúdo do dia.' },
      { status: 500 }
    )
  }
}
