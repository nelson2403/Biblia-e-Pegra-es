import { NextRequest, NextResponse } from 'next/server'
import { enviarParaUsuario } from '@/lib/pushServer'
import { usuarioDaRequisicao } from '@/lib/authServer'

export const dynamic = 'force-dynamic'

/** Dispara uma notificação de teste para o próprio usuário confirmar que está tudo certo. */
export async function POST(req: NextRequest) {
  const user = await usuarioDaRequisicao(req)
  if (!user) {
    return NextResponse.json({ error: 'Sessão inválida. Entre novamente.' }, { status: 401 })
  }

  try {
    const resultado = await enviarParaUsuario(user.id, {
      titulo: '🙏 Notificações ativadas',
      corpo: 'É assim que você vai receber a Palavra do dia. Que Deus abençoe!',
      url: '/diario',
      tag: 'teste',
    })

    if (resultado.enviadas === 0) {
      return NextResponse.json(
        { error: 'Nenhum aparelho inscrito. Ative as notificações e tente de novo.' },
        { status: 400 }
      )
    }

    return NextResponse.json({ ok: true, ...resultado })
  } catch (e: any) {
    console.error('[push/teste] erro:', e?.message)
    return NextResponse.json({ error: e?.message ?? 'Erro ao enviar teste.' }, { status: 500 })
  }
}
