import { NextRequest, NextResponse } from 'next/server'
import { obterConteudoDiario, hojeISO } from '@/lib/conteudoDiario'
import { enviarParaTodos } from '@/lib/pushServer'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

/** Hora atual (0-23) no fuso de São Paulo. */
function horaDeBrasilia(): number {
  const h = new Date().toLocaleString('en-US', {
    timeZone: 'America/Sao_Paulo',
    hour: '2-digit',
    hour12: false,
  })
  return parseInt(h, 10)
}

function resumir(texto: string, limite = 160): string {
  const limpo = texto.replace(/\s+/g, ' ').trim()
  if (limpo.length <= limite) return limpo
  const corte = limpo.slice(0, limite)
  const ultimoEspaco = corte.lastIndexOf(' ')
  return `${corte.slice(0, ultimoEspaco > 0 ? ultimoEspaco : limite)}…`
}

/**
 * Roda de hora em hora. Garante que o conteúdo do dia exista e envia o push
 * para quem escolheu receber naquela hora.
 *
 * Chamado pelo Vercel Cron (header x-vercel-cron) ou manualmente com
 * Authorization: Bearer $CRON_SECRET.
 */
export async function GET(req: NextRequest) {
  const segredo = process.env.CRON_SECRET
  const ehVercelCron = req.headers.get('x-vercel-cron') !== null
  const autorizado =
    ehVercelCron ||
    (!!segredo && req.headers.get('authorization') === `Bearer ${segredo}`)

  if (!autorizado) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
  }

  const url = new URL(req.url)
  // ?todos=1 ignora o filtro de horário — útil em planos com apenas 1 cron por dia.
  const ignorarHora = url.searchParams.get('todos') === '1'
  const horaParam = url.searchParams.get('hora')
  const hora = horaParam !== null ? parseInt(horaParam, 10) : horaDeBrasilia()

  try {
    const conteudo = await obterConteudoDiario(hojeISO())

    const envio = await enviarParaTodos(
      {
        titulo: `📖 ${conteudo.versiculo_ref}`,
        corpo: resumir(conteudo.versiculo_texto),
        url: '/diario',
        tag: `diario-${conteudo.data}`,
      },
      { tipo: 'versiculo', ...(ignorarHora ? {} : { hora }) }
    )

    return NextResponse.json({
      ok: true,
      data: conteudo.data,
      referencia: conteudo.versiculo_ref,
      hora: ignorarHora ? 'todas' : hora,
      ...envio,
    })
  } catch (e: any) {
    console.error('[cron/diario] erro:', e?.message)
    return NextResponse.json(
      {
        error: e?.message ?? 'Erro desconhecido',
        // Sem isto não dá para saber, de fora, qual dia o servidor tentou gerar
        // — e diferença de fuso entre a Vercel (UTC) e o Brasil já causou confusão.
        diagnostico: {
          dataCalculada: hojeISO(),
          dataUTC: new Date().toISOString().split('T')[0],
          horaBrasilia: horaDeBrasilia(),
        },
      },
      { status: 500 }
    )
  }
}
