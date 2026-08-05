import { NextRequest, NextResponse } from 'next/server'
import { groqTranscrever, GroqError } from '@/lib/groq'
import { usuarioDaRequisicao } from '@/lib/authServer'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

/** Limite prático de corpo de requisição nas funções serverless da Vercel. */
const TAMANHO_MAXIMO = 4 * 1024 * 1024

/**
 * Contexto passado ao Whisper. Melhora bastante a grafia de nomes e termos
 * bíblicos, que é justamente onde a transcrição costuma errar.
 */
const CONTEXTO =
  'Anotação de estudo bíblico em português. Termos comuns: Jesus, Cristo, Senhor, Espírito Santo, ' +
  'evangelho, salvação, graça, aliança, discípulos, apóstolo Paulo, Gênesis, Êxodo, Salmos, ' +
  'Provérbios, Isaías, Mateus, Marcos, Lucas, João, Atos, Romanos, Coríntios, Efésios, Apocalipse, ' +
  'versículo, capítulo, pregação, congregação, louvor, aleluia, amém.'

export async function POST(req: NextRequest) {
  const user = await usuarioDaRequisicao(req)
  if (!user) {
    return NextResponse.json({ error: 'Sessão inválida. Entre novamente.' }, { status: 401 })
  }

  try {
    const form = await req.formData()
    const arquivo = form.get('audio')

    if (!(arquivo instanceof Blob)) {
      return NextResponse.json({ error: 'Nenhum áudio foi enviado.' }, { status: 400 })
    }

    if (arquivo.size === 0) {
      return NextResponse.json({ error: 'O áudio está vazio. Grave novamente.' }, { status: 400 })
    }

    if (arquivo.size > TAMANHO_MAXIMO) {
      return NextResponse.json(
        { error: 'Áudio muito longo. Grave trechos de até 10 minutos e transcreva um de cada vez.' },
        { status: 413 }
      )
    }

    const nome = (form.get('nome') as string) || 'gravacao.webm'
    const texto = await groqTranscrever(arquivo, nome, CONTEXTO)

    if (!texto) {
      return NextResponse.json(
        { error: 'Não consegui entender o áudio. Tente falar mais perto do microfone.' },
        { status: 422 }
      )
    }

    return NextResponse.json({ texto })
  } catch (e: any) {
    if (e instanceof GroqError) {
      console.error('[transcrever] Groq:', e.message)
      return NextResponse.json({ error: e.message }, { status: e.status })
    }
    console.error('[transcrever] erro:', e?.message)
    return NextResponse.json(
      { error: `Erro ao transcrever: ${e?.message ?? 'tente novamente'}` },
      { status: 500 }
    )
  }
}
