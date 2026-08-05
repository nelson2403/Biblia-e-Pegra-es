import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'
import { usuarioDaRequisicao } from '@/lib/authServer'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const user = await usuarioDaRequisicao(req)
  if (!user) {
    return NextResponse.json({ error: 'Sessão inválida. Entre novamente.' }, { status: 401 })
  }

  try {
    const { endpoint } = await req.json()
    const admin = getSupabaseAdmin()

    // Sem endpoint, desliga todos os aparelhos do usuário.
    const query = admin.from('push_subscriptions').delete().eq('user_id', user.id)
    const { error } = endpoint ? await query.eq('endpoint', endpoint) : await query

    if (error) {
      console.error('[push/unsubscribe] erro:', error.message)
      return NextResponse.json({ error: `Erro ao remover: ${error.message}` }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: `Erro interno: ${e?.message ?? 'desconhecido'}` }, { status: 500 })
  }
}
